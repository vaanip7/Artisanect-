import { PrismaClient } from "@prisma/client";

/**
 * Single shared PrismaClient instance for the whole app.
 *
 * Express runs as one long-lived process, so one PrismaClient (and the
 * connection pool it opens to Postgres) for the process's entire lifetime
 * is correct here — instantiating a new PrismaClient per request would
 * open a new pool on every single API call.
 */
export const prisma = new PrismaClient();
