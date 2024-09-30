type RequiredKeys<T> = {
  [K in keyof T]: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type OnlyRequired<T> = Pick<T, RequiredKeys<T>>;
