// https://stackoverflow.com/questions/68724603/how-to-create-a-uuid-template-literal-type-in-typescript

type VersionChar = '1' | '2' | '3' | '4' | '5';

type Char =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f';

type Prev<X extends number> = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  ...never[]
][X];

type HasLength<S extends string, Len extends number> = [Len] extends [0]
  ? S extends ''
    ? true
    : never
  : S extends `${infer C}${infer Rest}`
  ? Lowercase<C> extends Char
    ? HasLength<Rest, Prev<Len>>
    : never
  : never;

type Char4<S extends string> = true extends HasLength<S, 4> ? S : never;
type Char8<S extends string> = true extends HasLength<S, 8> ? S : never;
type Char12<S extends string> = true extends HasLength<S, 12> ? S : never;

type VersionGroup<S extends string> = S extends `${infer Version}${infer Rest}`
  ? Version extends VersionChar
    ? true extends HasLength<Rest, 3>
      ? S
      : never
    : never
  : never;

type NilUUID128 = '00000000-0000-0000-0000-000000000000';

export type UUID128Hyphen<S extends string> = S extends NilUUID128
  ? S
  : S extends `${infer S8}-${infer S4_1}-${infer S4_2}-${infer S4_3}-${infer S12}`
  ? S8 extends Char8<S8>
    ? S4_1 extends Char4<S4_1>
      ? S4_2 extends VersionGroup<S4_2>
        ? S4_3 extends Char4<S4_3>
          ? S12 extends Char12<S12>
            ? S
            : never
          : never
        : never
      : never
    : never
  : never;

export type UUID128<S extends string = string> =
  | HasLength<S, 32>
  | UUID128Hyphen<S>;

const getUser = <S extends string>(id: UUID128<S>): void => console.log(id);
//
// getUser('00000000-0000-0000-0000-000000000000'); // ✅  special Nil UUID
// getUser('11111111-1111-0111-1111-111111111111'); // ✅  error: version 0 is a special case
// getUser('11111111-1111-1111-1111-111111111111'); // ✅  version 1
// getUser('11111111-1111-2111-1111-111111111111'); // ✅  version 2
// getUser('11111111-1111-3111-1111-111111111111'); // ✅  version 3
// getUser('11111111-1111-4111-1111-111111111111'); // ✅  version 4
// getUser('11111111-1111-5111-1111-111111111111'); // ✅  version 5
// getUser('11111111-1111-6111-1111-111111111111'); // ✅  error: version 6 doesn't exist
// getUser('11111111-1111-1111-1111-11111111111'); // ✅  error: invalid format
//
// const test1: UUID128Hyphen<'00000000-0000-0000-0000-000000000000'> =
//   '00000000-0000-0000-0000-000000000000'; // ✅  special Nil UUID
// const test2: UUID128Hyphen<'11111111-1111-0111-1111-111111111111'> =
//   '11111111-1111-0111-1111-111111111111'; // ✅  error: version 0 is a special case
// ('11111111-1111-1111-1111-111111111111'); // ✅  version 1
// ('11111111-1111-2111-1111-111111111111'); // ✅  version 2
// ('11111111-1111-3111-1111-111111111111'); // ✅  version 3
// ('11111111-1111-4111-1111-111111111111'); // ✅  version 4
// ('11111111-1111-5111-1111-111111111111'); // ✅  version 5
// ('11111111-1111-6111-1111-111111111111'); // ✅  error: version 6 doesn't exist
// ('11111111-1111-1111-1111-11111111111'); // ✅  error: invalid format
