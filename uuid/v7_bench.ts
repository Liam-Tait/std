import { generate, generateArrayAccess } from "./v7.ts";

const options = {
  timestamp: 0x017F22E279B0,
  random: new Uint8Array([
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
  ]),
};

Deno.bench("view", {
  group: "with preset options",
  baseline: true,
}, () => {
  generate(options);
});

Deno.bench("direct array", {
  group: "with preset options",
}, () => {
  generateArrayAccess(options);
});


Deno.bench("view", {
  group: "defaults",
  baseline: true,
}, () => {
  generate();
});

Deno.bench("direct array", {
  group: "defaults",
}, () => {
  generateArrayAccess();
});


