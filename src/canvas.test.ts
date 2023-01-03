import { getDistance } from "./canvas";
import { it, expect, describe } from "vitest";

// All tests within this suite will be run in parallel
describe.concurrent("suite", () => {
  it("Get the distance of various points.", async (): Promise<void> => {
    expect(getDistance(1, 1, 1, 1)).toBe(0);
    expect(getDistance(1, 2, 1, 2)).toBe(0);
    expect(getDistance(1, 1, 2, 1)).toBe(1);
    expect(getDistance(-5, 1, -1, 1)).toBe(4);
  });

  it.concurrent("Snapshot getDistance.", async () => {
    const result = getDistance(0, 0, 0, 0);
    expect(result).toMatchInlineSnapshot("0");
  });
});
