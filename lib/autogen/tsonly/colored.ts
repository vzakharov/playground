export const colors = ['gray', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan'] as const;

export type Color = typeof colors[number];

export const ansiPrefixes = {
  gray: '\x1b[90m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
} as const;

export type AnsiPrefixes = typeof ansiPrefixes;

export const ansiSuffix = '\x1b[0m';

export type AnsiSuffix = typeof ansiSuffix;

export type Colored<C extends Color, T extends string> = `${AnsiPrefixes[C]}${T}${AnsiSuffix}`;

export const colored = colors.reduce((colored, color) => {
  colored[color] = <T extends string>(text: T) => ansiPrefixes[color] + text + ansiSuffix as any;
  return colored;
}, {} as {
  [C in Color]: <T extends string>(text: T) => Colored<C, T>;
});

const greenHello = colored.green('Hello');
