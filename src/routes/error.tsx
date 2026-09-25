import { Title } from "@solidjs/meta";

export default function ErrorRoute() {
  throw new Error("Intentional SolidStart SSR render failure");

  return <Title>Unreachable error route</Title>;
}
