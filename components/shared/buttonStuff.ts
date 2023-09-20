export type ButtonProps = {
  caption: string,
  disabled?: boolean,
  type?: 'button' | 'submit' | 'reset',
  rounded?: boolean,
  small?: boolean,
  outline?: boolean,
  checkmarkAfterCallback?: boolean,
  tooltip?: string,
};