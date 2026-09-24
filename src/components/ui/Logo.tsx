import { Link } from "@/i18n/navigation";

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
}

// Platzhalter-Icon: stilisierte Flasche mit drei verbundenen Punkten
// (Netzwerk-/Vertriebssymbol) in der Primärfarbe.
// TODO: durch finale Logo-Datei ersetzen, sobald vorhanden.
export function Logo({ className = "", withWordmark = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 ${className}`}
      aria-label="dristro"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M13 5C8.02944 5 4 9.02944 4 14C4 18.9706 8.02944 23 13 23C16.4193 23 19.3924 21.0904 20.9128 18.2792"
          stroke="#0B6E76"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4.5 12.5H19"
          stroke="#0B6E76"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 19L19 9"
          stroke="#0B6E76"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20.5" cy="8.5" r="3" fill="#E3A73E" />
        <circle cx="24" cy="13.5" r="2.5" fill="#E3A73E" />
        <circle cx="9" cy="21.5" r="2.5" fill="#E3A73E" />
      </svg>
      {withWordmark && (
        <span className="font-heading text-xl font-bold text-primary">
          dristro
        </span>
      )}
    </Link>
  );
}
