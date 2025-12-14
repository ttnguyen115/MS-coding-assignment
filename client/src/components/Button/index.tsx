import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  isActive?: boolean;
}

function Button({
  children,
  isActive = false,
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    styles["button"],
    isActive ? styles["active"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
