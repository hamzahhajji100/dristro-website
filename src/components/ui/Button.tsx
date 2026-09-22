import { Link } from "@/i18n/navigation";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "outlineInverse";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-background hover:bg-primary-dark",
  secondary:
    "bg-accent text-primary-dark hover:bg-accent/90",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-background",
  // Für Einsatz auf dunklem (primärfarbenem) Hintergrund, z.B. im Hero.
  outlineInverse:
    "border border-background text-background hover:bg-background hover:text-primary",
};

const base =
  "inline-flex items-center justify-center rounded px-6 py-3 font-heading font-semibold transition-colors";

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${base} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variantClasses[variant]} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
