import { describe, expect, it } from "vitest";

import parseJsonResponse from "./parse-json-response";

describe("parseJsonResponse", () => {
  it("parses valid JSON response", () => {
    const input = `{"foo": "bar"}`;
    const result = parseJsonResponse(input);

    expect(result).toEqual({ foo: "bar" });
  });

  it("parses JSON response when surrounded by text", () => {
    const input = ` Here is your result:
        {"foo": "bar"}
        thanks!`;
    const result = parseJsonResponse(input);

    expect(result).toEqual({ foo: "bar" });
  });

  it("throws error when no JSON is present", () => {
    const input = "this is not json";
    expect(() => parseJsonResponse(input)).toThrow(
      "Model did not return valid JSON.",
    );
  });

  it("throws when extracted JSON is invalid", () => {
    const input = `
        Here:
        { invalid json }
        `;

    expect(() => parseJsonResponse(input)).toThrow(
      "Model did not return valid JSON.",
    );
  });
});
