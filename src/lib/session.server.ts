import "server-only";

export const sessionConfig = {
  name: "hammer-solidstart",
  password: "fixture-only-key-change-before-real-use-2026",
  maxAge: 60 * 60,
  cookie: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: false,
    path: "/",
  },
};
