-- Week 6: Add Google OAuth support
-- Make password nullable (Google users have no password)
-- Add googleId column for Google OAuth subject ID

ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

ALTER TABLE "users" ADD COLUMN "googleId" TEXT;

CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");
