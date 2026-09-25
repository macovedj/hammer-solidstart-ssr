import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <main>
      <Title>Not found · Hammer</Title>
      <HttpStatusCode code={404} />
      <section class="panel error-panel" data-testid="not-found">
        <p class="eyebrow">Filesystem route fallback · status 404</p>
        <h1>Nothing is forged at this URL.</h1>
        <a href="/">Return to the SSR home</a>
      </section>
    </main>
  );
}
