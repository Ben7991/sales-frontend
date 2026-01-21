// const { createDefaultPreset } = require("ts-jest");
import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  verbose: true,
  roots: ["./src"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    ...tsJestTransformCfg,
  },
};
