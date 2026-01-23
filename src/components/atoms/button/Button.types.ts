import type { ComponentPropsWithoutRef } from "react";
import type { LinkProps as RRLinkProps } from "react-router";

type Variant = "primary" | "outline" | "danger";

export type ButtonProps = {
  el: "button";
  variant: Variant;
} & ComponentPropsWithoutRef<"button">;

export type LinkProps = {
  el: "link";
  variant: Variant;
} & RRLinkProps;
