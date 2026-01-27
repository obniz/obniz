"use strict";
// https://stackoverflow.com/questions/68724603/how-to-create-a-uuid-template-literal-type-in-typescript
Object.defineProperty(exports, "__esModule", { value: true });
const getUser = (id) => console.log(id);
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
