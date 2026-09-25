import { Title } from "@solidjs/meta";
import { createAsync, query } from "@solidjs/router";
import { Show, Suspense } from "solid-js";

const getSlowResult = query(async () => {
  "use server";
  await new Promise(resolve => setTimeout(resolve, 700));
  return {
    message: "The deferred server resource arrived.",
    resolvedAt: new Date().toISOString(),
  };
}, "slow-stream-result");

export default function StreamRoute() {
  const result = createAsync(() => getSlowResult());

  return (
    <main>
      <Title>Streaming Suspense · Hammer</Title>
      <section class="panel page-heading">
        <p class="eyebrow">Streaming Suspense</p>
        <h1>The shell does not wait for the slow card.</h1>
        <p>This heading is immediately renderable. The nested server query intentionally waits 700 ms.</p>
      </section>
      <Suspense fallback={<section class="panel stream-pending" data-testid="stream-fallback">Server resource is still cooking…</section>}>
        <Show when={result()} keyed>
          {data => (
            <section class="panel stream-result" data-testid="stream-result">
              <p class="eyebrow">Deferred chunk resolved</p>
              <h2>{data.message}</h2>
              <p>{data.resolvedAt}</p>
            </section>
          )}
        </Show>
      </Suspense>
    </main>
  );
}
