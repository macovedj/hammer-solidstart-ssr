import { Title } from "@solidjs/meta";

export default function StaticRoute() {
  return (
    <main>
      <Title>Prerendered route · Hammer</Title>
      <section class="panel page-heading" data-testid="prerendered-route">
        <p class="eyebrow">Build-time prerender target</p>
        <h1>Written to static HTML during build.</h1>
        <p>
          Nitro is configured with <code>prerender.routes: ["/static"]</code>. The production artifact can serve this document without invoking the SSR handler.
        </p>
      </section>
    </main>
  );
}
