"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "accent" | "ghost";
type Size = "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconLeft?: boolean;
  fullWidth?: boolean;
  className?: string;
};

type ButtonAsButton = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

type ButtonAsLink = BaseProps & {
  href: string;
  onClick?: () => void;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium " +
  "transition-colors duration-200 select-none whitespace-nowrap disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white bg-black shadow-button",
  outline: "bg-white text-ink border border-line hover:border-ink",
  accent: "bg-accent text-white hover:brightness-105 shadow-button",
  ghost: "bg-transparent text-ink hover:bg-cream",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconLeft = false,
  fullWidth = false,
  className = "",
  ...rest
}: ButtonProps) {
  const reduce = useReducedMotion();

  const classes = [
    base,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const hover = reduce ? undefined : { y: -2 };
  const tap = reduce ? undefined : { scale: 0.98 };

  const content = (
    <>
      {icon && iconLeft ? <span aria-hidden>{icon}</span> : null}
      {children}
      {icon && !iconLeft ? <span aria-hidden>{icon}</span> : null}
    </>
  );

  if ("href" in rest && rest.href) {
    return (
      <motion.a
        href={rest.href}
        onClick={rest.onClick}
        className={classes}
        whileHover={hover}
        whileTap={tap}
      >
        {content}
      </motion.a>
    );
  }

  const { onClick, type = "button" } = rest as ButtonAsButton;
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      whileHover={hover}
      whileTap={tap}
    >
      {content}
    </motion.button>
  );
}
