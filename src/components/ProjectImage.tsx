"use client";

import { useState } from "react";

export default function ProjectImage({ id }: { id: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="project-entry-image" aria-hidden="true">
      {!failed && (
        <img
          src={`/api/project-images/${encodeURIComponent(id)}`}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
