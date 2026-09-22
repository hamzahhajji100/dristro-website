interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-foreground/80 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
