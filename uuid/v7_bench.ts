import { stub } from "../testing/mock.ts";
import { generate, generateArrayAccess } from "./v7.ts";

const random = new Uint8Array([
  // rand_a = 0xCC3
  0xC,
  0xC3,
  // rand_b = 0b01, 0x8C4DC0C0C07398F
  0x18,
  0xC4,
  0xDC,
  0x0C,
  0x0C,
  0x07,
  0x39,
  0x8F,
]);
const getRandomValuesStub = stub(crypto, "getRandomValues", (array) => {
  for (let index = 0; index < (random.length); index++) {
    array[index] = random[index]!;
  }
  return random;
});
const timestamp = 0x017F22E279B0;
const options = { timestamp };

Deno.bench("view", {
  group: "with mocked random and timestamp",
  baseline: true,
}, () => {
  generate(options);
});

Deno.bench("direct array", {
  group: "with mocked random and timestamp",
}, () => {
  generateArrayAccess(options);
});

getRandomValuesStub.restore();

Deno.bench("view", {
  group: "default",
  baseline: true,
}, () => {
  generate();
});

Deno.bench("direct array", {
  group: "default",
}, () => {
  generateArrayAccess();
});
