import { describe, it, expect } from "@jest/globals";

import {
  formatAmount,
  getPaginatedData,
  makeFirstLetterUppercase,
} from "./helpers.utils";

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
    it("should return the right string with hyphens replaces with space when hyphenated string is passed", () => {
      const result = makeFirstLetterUppercase("testing-again");
      expect(result).toMatch("Testing Again");
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

  describe("formatAmount()", () => {
    it("should not add commas if digit string length is not beyond 4 numbers", () => {
      expect(formatAmount(200)).toBe("200.00");
    });

    it("should ensure that the previous decimal number is not lost after formating", () => {
      expect(formatAmount(200.5)).toBe("200.50");
      expect(formatAmount(200.55)).toBe("200.55");
    });

    it("should add commas if digit string length is beyond 4 numbers", () => {
      expect(formatAmount(2000.5)).toBe("2,000.50");
      expect(formatAmount(2000.55)).toBe("2,000.55");
      expect(formatAmount(2000000.42)).toBe("2,000,000.42");
      expect(formatAmount(20000.55)).toBe("20,000.55");
    });
  });
});
