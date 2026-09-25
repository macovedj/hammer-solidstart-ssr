import { Title } from "@solidjs/meta";
import { createAsync, query, type RouteDefinition, type RouteSectionProps } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import { Show } from "solid-js";
import { findProduct } from "~/lib/products.server";

const getProduct = query(async (id: string) => {
  "use server";
  return findProduct(id);
}, "product-by-id");

export const route = {
  preload: ({ params }) => getProduct(params.id ?? ""),
} satisfies RouteDefinition;

export default function ProductRoute(props: RouteSectionProps) {
  const product = createAsync(() => getProduct(props.params.id ?? ""));

  return (
    <main>
      <Show
        when={product()}
        keyed
        fallback={
          <section class="panel error-panel">
            <HttpStatusCode code={404} />
            <Title>Product not found</Title>
            <p class="eyebrow">Dynamic SSR miss · status 404</p>
            <h1>No product named “{props.params.id}”.</h1>
            <a href="/products/anvil">Try the known product</a>
          </section>
        }
      >
        {item => (
          <section class="panel product-detail">
            <Title>{item.name} · Hammer</Title>
            <p class="eyebrow">Dynamic SSR route · /products/{item.id}</p>
            <h1>{item.name}</h1>
            <p class="price">${item.price}</p>
            <p>{item.description}</p>
            <p class="status-line" data-testid="product-source">Resolved by a server-only module through a serialized query.</p>
          </section>
        )}
      </Show>
    </main>
  );
}
