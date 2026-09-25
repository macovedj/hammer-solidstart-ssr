import { Title } from "@solidjs/meta";
import { action, createAsync, query, redirect, useSubmission } from "@solidjs/router";
import { useSession } from "@solidjs/start/http";
import { Show } from "solid-js";
import { sessionConfig } from "~/lib/session.server";

type VisitorSession = {
  nickname?: string;
  updates?: number;
};

const getVisitor = query(async () => {
  "use server";
  const session = await useSession<VisitorSession>(sessionConfig);
  return {
    nickname: session.data.nickname ?? null,
    updates: session.data.updates ?? 0,
  };
}, "visitor-session");

const saveVisitor = action(async (formData: FormData) => {
  "use server";
  const nickname = String(formData.get("nickname") ?? "").trim();

  if (nickname.length < 2 || nickname.length > 24) {
    return { error: "Use a nickname between 2 and 24 characters." };
  }

  const session = await useSession<VisitorSession>(sessionConfig);
  await session.update({
    nickname,
    updates: (session.data.updates ?? 0) + 1,
  });

  return redirect("/session?saved=1", { revalidate: "visitor-session" });
}, "save-visitor");

export default function SessionRoute() {
  const visitor = createAsync(() => getVisitor());
  const submission = useSubmission(saveVisitor);

  return (
    <main>
      <Title>Session action · Hammer</Title>
      <section class="grid two-up">
        <article class="panel">
          <p class="eyebrow">Progressively enhanced server action</p>
          <h1>Name this session.</h1>
          <form action={saveVisitor} method="post">
            <label for="nickname">Nickname</label>
            <input id="nickname" name="nickname" minlength="2" maxlength="24" required placeholder="Ada" />
            <button type="submit" disabled={submission.pending}>{submission.pending ? "Saving…" : "Save and redirect"}</button>
          </form>
          <Show when={submission.result?.error}><p class="form-error">{submission.result?.error}</p></Show>
        </article>
        <article class="panel">
          <p class="eyebrow">Signed HTTP-only cookie session</p>
          <h2>Server-read state</h2>
          <Show when={visitor()} keyed fallback={<p>Reading session…</p>}>
            {data => (
              <dl class="facts" data-testid="session-state">
                <div><dt>Nickname</dt><dd>{data.nickname ?? "Not set"}</dd></div>
                <div><dt>Successful writes</dt><dd>{data.updates}</dd></div>
              </dl>
            )}
          </Show>
        </article>
      </section>
    </main>
  );
}
