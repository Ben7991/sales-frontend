import type { ComponentPropsWithoutRef } from "react";
import type { LinkProps as RRLinkProps } from "react-router";

export type ButtonProps = {
  el: "button";
} & ComponentPropsWithoutRef<"button">;

export type LinkProps = {
  el: "link";
} & RRLinkProps;
