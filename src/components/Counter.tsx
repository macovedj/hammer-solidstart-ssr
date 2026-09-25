import { createSignal, onMount } from "solid-js";

export default function Counter() {
  const [count, setCount] = createSignal(0);
  const [hydrated, setHydrated] = createSignal(false);

  onMount(() => setHydrated(true));

  return (
    <div class="counter-card">
      <div class="counter" aria-label="Hydrated counter">
        <button type="button" onClick={() => setCount(value => value - 1)} aria-label="Decrease count">−</button>
        <output aria-live="polite">{count()}</output>
        <button type="button" onClick={() => setCount(value => value + 1)} aria-label="Increase count">+</button>
      </div>
      <p class="hydration-state" data-testid="hydration-state">
        {hydrated() ? "Hydrated in the browser" : "Server-rendered; awaiting hydration"}
      </p>
    </div>
  );
}
