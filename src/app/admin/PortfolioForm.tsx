"use client";

import { useActionState, type ReactNode } from "react";

export default function PortfolioForm({
  action,
  children,
}: {
  action: (error: string | null, data: FormData) => Promise<string | null>;
  children: ReactNode;
}) {
  const [error, submit] = useActionState(action, null);

  return (
    <form
      action={submit}
      className="form-grid"
      onChange={(event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || input.name !== "image") return;
        const size = input.files?.[0]?.size ?? 0;
        input.setCustomValidity(size > 1024 * 1024 ? "Project images must be 1 MB or smaller." : "");
        if (size > 1024 * 1024) input.reportValidity();
      }}
    >
      {error && <p role="alert">{error}</p>}
      {children}
    </form>
  );
}
