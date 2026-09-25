import { Title } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";

const BrowserPanel = clientOnly(() => import("~/components/BrowserPanel"), { lazy: true });

export default function ClientRoute() {
  return (
    <main>
      <Title>Client-only surface · Hammer</Title>
      <section class="panel page-heading">
        <p class="eyebrow">SSR shell + client-only island</p>
        <h1>The server stops at the fallback.</h1>
        <p>The panel below is dynamically imported after mount and safely reads localStorage, location, and navigator.</p>
      </section>
      <BrowserPanel fallback={<section class="panel client-fallback" data-testid="client-fallback">Waiting for the browser-only module…</section>} />
    </main>
  );
}
