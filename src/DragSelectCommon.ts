import { InjectionKey } from 'vue';
import { MaybeRef } from './typings/internal';

export interface DragSelectProps<T = unknown> {
  /**
   * binding value
   * @alias v-model
   */
  modelValue?: MaybeRef<T>;
  /**
   * whether DragSelect is disabled
   * @default false
   */
  disabled?: boolean;
}

export type OptionValue = unknown;

export interface Option<T = OptionValue> {
  dom: HTMLElement;
  value: T;
}

interface ForOptionAction {
  has: (option: Option) => boolean;
  isSelected: (option: Option) => boolean;
  add: (option: Option) => void;
  delete: (option: Option) => void;
  onClick: (option: Option) => void;
}

export const forOptionActionKey: InjectionKey<ForOptionAction> = Symbol();
