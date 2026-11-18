-- Add image storage without changing any existing portfolio records.
DO $$
BEGIN
  PERFORM pg_advisory_xact_lock(491748239);

  CREATE TABLE IF NOT EXISTS "ProjectImage" (
    "projectId" TEXT PRIMARY KEY,
    "contentType" TEXT NOT NULL,
    "bytes" BYTEA NOT NULL,
    CONSTRAINT "ProjectImage_projectId_fkey"
      FOREIGN KEY ("projectId") REFERENCES "Project"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
  );
END;
$$;
