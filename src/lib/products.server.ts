import "server-only";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const products: Product[] = [
  {
    id: "anvil",
    name: "Server Anvil",
    description: "Loaded inside a server query and serialized into the hydrated route.",
    price: 64,
  },
  {
    id: "bellows",
    name: "Streaming Bellows",
    description: "Keeps the shell moving while an async server resource resolves.",
    price: 42,
  },
  {
    id: "tongs",
    name: "Session Tongs",
    description: "A deterministic record with no database or external service attached.",
    price: 28,
  },
];

export function listProducts() {
  return products;
}

export function findProduct(id: string) {
  return products.find(product => product.id === id) ?? null;
}
