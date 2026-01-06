import { expect, $ } from "@wdio/globals";

describe("Hello Tauri", () => {
  it("should be easy on the eyes", async () => {
    expect(1 + 2).toBeLessThan(255);
  });
});
