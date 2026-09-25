import type { APIEvent } from "@solidjs/start/server";
import { findProduct } from "~/lib/products.server";

export function GET({ params }: APIEvent) {
  const product = findProduct(params.id);
  return product
    ? Response.json(product)
    : Response.json({ error: "Product not found", id: params.id }, { status: 404 });
}
