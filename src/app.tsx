import { MetaProvider, Title } from "@solidjs/meta";
import { A, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, JSX, Suspense } from "solid-js";
import { HttpStatusCode } from "@solidjs/start";
import "./app.css";

function AppShell(props: { children?: JSX.Element }) {
  return (
    <MetaProvider>
      <Title>Hammer · SolidStart SSR</Title>
      <div class="site-shell">
        <header class="topbar">
          <A class="brand" href="/" end>
            <img src="/solid-mark.svg" alt="" width="36" height="36" />
            <span>Hammer / SolidStart SSR</span>
          </A>
          <nav aria-label="Primary navigation">
            <A href="/" end activeClass="active">Home</A>
            <A href="/products/anvil" activeClass="active">Dynamic</A>
            <A href="/static" activeClass="active">Prerender</A>
            <A href="/stream" activeClass="active">Stream</A>
            <A href="/client" activeClass="active">Client-only</A>
            <A href="/session" activeClass="active">Action</A>
          </nav>
        </header>
        <ErrorBoundary
          fallback={(error, reset) => (
            <main>
              <HttpStatusCode code={500} />
              <section class="panel error-panel" data-testid="error-boundary">
                <p class="eyebrow">SSR error boundary · status 500</p>
                <h1>The route threw on purpose.</h1>
                <pre>{error instanceof Error ? error.message : String(error)}</pre>
                <button type="button" onClick={reset}>Reset boundary</button>
              </section>
            </main>
          )}
        >
          <Suspense fallback={<main><p class="panel">Loading route…</p></main>}>
            {props.children}
          </Suspense>
        </ErrorBoundary>
        <footer>
          <span>Streaming SSR fixture</span>
          <span>SolidStart 2 · Nitro 3 · Vite 8</span>
        </footer>
      </div>
    </MetaProvider>
  );
}

export default function App() {
  return (
    <Router root={AppShell}>
      <FileRoutes />
    </Router>
  );
}
