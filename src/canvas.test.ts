/* eslint-disable no-magic-numbers */
import { getDistance } from "./canvas";
import { it, expect } from "vitest";

it("add", () => {
  expect(getDistance(1, 1, 1, 1)).toBe(0);
  expect(getDistance(1, 2, 1, 2)).toBe(0);
  expect(getDistance(1, 1, 2, 1)).toBe(1);
  expect(getDistance(-5, 1, -1, 1)).toBe(4);
});
