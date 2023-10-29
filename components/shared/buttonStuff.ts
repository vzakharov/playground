export const buttonProps = {
  caption: {
    type: String,
    required: true,
  },
  disabled: Boolean,
  primary: Boolean,
  danger: Boolean,
  type: String as PropType<'button' | 'submit' | 'reset'>,
  rounded: Boolean,
  small: Boolean,
  outline: Boolean,
  ghost: Boolean,
  checkmarkAfterCallback: Boolean,
  tooltip: String,
  class: String,
  confirmPrompt: String,
  confirmInput: String,
} as const;

export type MakeBooleanKeysOptional<T> = {
  [K in keyof T as T[K] extends boolean ? K : never]?: T[K]
} & {
  [K in keyof T as T[K] extends boolean ? never : K]: T[K]
};

export type ButtonProps = MakeBooleanKeysOptional<ExtractPropTypes<typeof buttonProps>>

export type ButtonPropsForGroup = ButtonProps & {
  onClick?: () => void;
};

function test(props: ButtonProps) {
  props.caption;
  props.disabled;
  props.rounded;
  props.small;
  props.outline;
  props.checkmarkAfterCallback;
  props.tooltip;
  props.type;
}
