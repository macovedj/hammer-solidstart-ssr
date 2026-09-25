import { Title } from "@solidjs/meta";
import { createAsync, query, type RouteDefinition } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import Counter from "~/components/Counter";

const getServerSnapshot = query(async () => {
  "use server";

  return {
    renderedAt: new Date().toISOString(),
    runtime: "Node.js via the SolidStart SSR handler",
    source: "SolidStart server query",
  };
}, "server-snapshot");

export const route = {
  preload: () => getServerSnapshot(),
} satisfies RouteDefinition;

export default function Home() {
  const snapshot = createAsync(() => getServerSnapshot());

  return (
    <main>
      <Title>Hammer · SolidStart SSR</Title>
      <section class="hero panel">
        <div>
          <p class="eyebrow">Streaming server render + browser hydration</p>
          <h1>HTML first. Fine-grained interaction next.</h1>
          <p class="lede">
            This route renders content on the application server, transfers query data, and hydrates the counter without rebuilding the page.
          </p>
          <div class="badges"><span>SSR</span><span>Hydration</span><span>Server query</span></div>
        </div>
        <img class="hero-mark" src="/solid-mark.svg" alt="SolidStart fixture mark" width="160" height="160" />
      </section>

      <section class="grid two-up">
        <article class="panel">
          <p class="eyebrow">Hydration boundary</p>
          <h2>Server HTML with live signals</h2>
          <Counter />
        </article>
        <article class="panel">
          <p class="eyebrow">Request-time evidence</p>
          <h2>Made on the server</h2>
          <Suspense fallback={<p>Waiting for server snapshot…</p>}>
            <Show when={snapshot()} keyed>
              {data => (
                <dl class="facts" data-testid="server-snapshot">
                  <div><dt>Rendered</dt><dd>{data.renderedAt}</dd></div>
                  <div><dt>Runtime</dt><dd>{data.runtime}</dd></div>
                  <div><dt>Source</dt><dd>{data.source}</dd></div>
                </dl>
              )}
            </Show>
          </Suspense>
        </article>
      </section>
    </main>
  );
}
