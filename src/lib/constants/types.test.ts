import { describe, expect, it } from "vitest";

import { typeColor } from "./types";

describe("typeColor", () => {
  it("returns the mapped color for a known type", () => {
    expect(typeColor("fire")).toBe("#EE8130");
  });

  it("falls back to the unknown color for an unmapped type", () => {
    expect(typeColor("made-up-type")).toBe(typeColor("unknown"));
  });
});
