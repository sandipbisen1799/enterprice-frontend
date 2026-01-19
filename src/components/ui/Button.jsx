import React from "react";
import clsx from "clsx";

function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  const base =
    "rounded-lg cursor-pointer  font-semibold transition-all focus:outline-none focus:ring-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    outline: "border border-gray-300 text-gray-700",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}

export default Button;
