export class GenerateException extends Error {
  constructor(
    public readonly code: 'specMismatch' | 'yamlError',
    public readonly meta: any
  ) {
    super(code);
  };
};
