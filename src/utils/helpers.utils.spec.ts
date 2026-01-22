import { describe, it, expect } from "@jest/globals";

import { getPaginatedData, makeFirstLetterUppercase } from "./helpers.utils";

describe("helpers.utils.ts", () => {
  describe("makeFirstLetterUppercase()", () => {
    it("should return an empty string if undefined is passed", () => {
      const resultWithoutArgument = makeFirstLetterUppercase();
      const resultwithUndefined = makeFirstLetterUppercase(undefined);
      expect(resultWithoutArgument).toBe("");
      expect(resultwithUndefined).toBe("");
    });
    it("should return the right string", () => {
      const result = makeFirstLetterUppercase("testing");
      expect(result).toMatch("Testing");
    });
  });

  describe("getPaginatedData()", () => {
    it("should return default pagination data if an empty URLSearchParams is passed", () => {
      const params = new URLSearchParams();
      const result = getPaginatedData(params);
      const expectedResult = {
        query: "",
        page: 1,
        perPage: 10,
      };
      expect(result).toEqual(expectedResult);
    });

    it("should return default pagination data if wrong values are provided to URLSearchParams is passed", () => {
      const params = new URLSearchParams();
      params.set("q", "search");
      params.set("page", "a");
      params.set("perPage", "b");

      const result = getPaginatedData(params);
      const expectedResult = {
        query: "search",
        page: 1,
        perPage: 10,
      };
      expect(result).toEqual(expectedResult);
    });

    it("should return the same pagination data if data is provided to URLSearchParams", () => {
      const params = new URLSearchParams();
      params.set("q", "search");
      params.set("page", "2");
      params.set("perPage", "25");

      const result = getPaginatedData(params);
      const expectedResult = {
        query: "search",
        page: 2,
        perPage: 25,
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
