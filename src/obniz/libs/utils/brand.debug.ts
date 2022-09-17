// https://basarat.gitbook.io/typescript/main-1/nominaltyping
// https://zenn.dev/f_subal/articles/phantom_type_in_typescript
export type Brand<K, T> = K & { _brand: T };
