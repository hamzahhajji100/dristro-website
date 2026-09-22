import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-primary/10 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] w-full bg-background">
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          className="object-contain p-8"
          sizes="(min-width: 1024px) 380px, 90vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-heading text-xs font-semibold uppercase tracking-wide text-warm">
          {product.brand} &middot; {product.origin}
        </p>
        <h3 className="mt-2 font-heading text-xl font-bold text-primary">
          {product.name}
        </h3>
        <p className="mt-3 flex-1 text-sm text-foreground/75">
          {product.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.formats.map((format) => (
            <span
              key={format}
              className="rounded-sm bg-background px-3 py-1 text-xs font-semibold text-foreground/70"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
