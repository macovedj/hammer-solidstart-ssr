import { createSignal, onMount } from "solid-js";

export default function BrowserPanel() {
  const [snapshot, setSnapshot] = createSignal({
    mountedAt: "waiting",
    path: "waiting",
    userAgent: "waiting",
    visits: 0,
  });

  onMount(() => {
    const visits = Number(localStorage.getItem("hammer-solidstart-visits") ?? "0") + 1;
    localStorage.setItem("hammer-solidstart-visits", String(visits));
    setSnapshot({
      mountedAt: new Date().toISOString(),
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      visits,
    });
  });

  return (
    <section class="panel" data-testid="browser-panel">
      <p class="eyebrow">Client-only module loaded</p>
      <h2>Browser APIs are safe here.</h2>
      <dl class="facts">
        <div><dt>Mounted</dt><dd>{snapshot().mountedAt}</dd></div>
        <div><dt>Path</dt><dd>{snapshot().path}</dd></div>
        <div><dt>Local visits</dt><dd>{snapshot().visits}</dd></div>
        <div><dt>User agent</dt><dd>{snapshot().userAgent}</dd></div>
      </dl>
    </section>
  );
}
