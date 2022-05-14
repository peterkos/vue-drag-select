import { ref, unref } from 'vue';
import { MaybeNullableRef, Position } from '../typings/internal';
import { useDrag, UseDragOptions } from './useDrag';

export interface UseDragPointsOptions extends Omit<UseDragOptions, 'preventDefault' | 'onStart'> {
  /**
   * Callback when the dragging starts. Return `false` to prevent dragging.
   */
  onStart?: (event: PointerEvent, fromPoint: Position) => void | false;
}

export function useDragPoints(target: MaybeNullableRef<HTMLElement | SVGElement>, options: UseDragPointsOptions = {}) {
  const isDragging = ref(false);

  // only working for single pointer
  const fromPoint = ref<Position>([0, 0]);
  const toPoint = ref<Position>([0, 0]);

  const stop = useDrag(target, {
    ...options,
    preventDefault: true,
    onStart(e) {
      if (isDragging.value) return false;
      const targetDOM = unref(target);
      if (!targetDOM) return false;
      isDragging.value = true;
      const rect = targetDOM.getBoundingClientRect();
      const _fromPoint: Position = [
        e.clientX - rect.left - targetDOM.clientLeft + targetDOM.scrollLeft,
        e.clientY - rect.top - targetDOM.clientTop + targetDOM.scrollTop,
      ];
      if (options.onStart?.(e, _fromPoint) === false) {
        return false;
      }
      fromPoint.value = _fromPoint;
      toPoint.value = _fromPoint;
    },
    onMove(e) {
      const targetDOM = unref(target);
      if (!targetDOM) return;
      const rect = targetDOM.getBoundingClientRect();
      toPoint.value = [
        e.clientX - rect.left - targetDOM.clientLeft + targetDOM.scrollLeft,
        e.clientY - rect.top - targetDOM.clientTop + targetDOM.scrollTop,
      ];
      options.onMove?.(e);
    },
    onEnd(e) {
      isDragging.value = false;
      fromPoint.value = [0, 0];
      toPoint.value = [0, 0];
      options.onEnd?.(e);
    },
  });

  return { fromPoint, toPoint, isDragging, stop };
}
