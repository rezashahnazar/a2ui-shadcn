import { describe, it, expect } from "vitest";
import { createDataModelStore } from "./store";

describe("createDataModelStore", () => {
  it("get and set values", () => {
    const store = createDataModelStore({});
    store.set("/user/name", "Alice");
    expect(store.get("/user/name")).toBe("Alice");
    expect(store.get("/user")).toEqual({ name: "Alice" });
  });

  it("getAll returns full data", () => {
    const store = createDataModelStore({ a: 1 });
    store.set("/b", 2);
    expect(store.getAll()).toEqual({ a: 1, b: 2 });
  });

  it("subscribe notifies on change", () => {
    const store = createDataModelStore({});
    let value: unknown;
    const unsub = store.subscribe("/x", (v) => {
      value = v;
    });
    store.set("/x", 42);
    expect(value).toBe(42);
    unsub();
  });
});
