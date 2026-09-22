interface TrustBadgeProps {
  icon: React.ReactNode;
  label: string;
}

export function TrustBadge({ icon, label }: TrustBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded bg-accent/15 text-primary">
        {icon}
      </span>
      <span className="font-heading text-sm font-semibold text-foreground">
        {label}
      </span>
    </div>
  );
}
