import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { agencies } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { agencySeedData } from "@shared/agencySeedData";

async function listAgencies() {
  const db = await getDb();
  if (!db) return agencySeedData;

  try {
    const rows = await db.select().from(agencies);
    return rows.length > 0 ? rows : agencySeedData;
  } catch (error) {
    console.warn("[Agencies] Falling back to seed data:", error);
    return agencySeedData;
  }
}

async function getAgencyById(id: string) {
  const db = await getDb();
  if (!db) return agencySeedData.find((agency) => agency.id === id) ?? null;

  try {
    const result = await db
      .select()
      .from(agencies)
      .where(eq(agencies.id, id))
      .limit(1);
    if (result.length > 0) return result[0];
  } catch (error) {
    console.warn("[Agencies] Falling back to seed data for detail:", error);
  }

  return agencySeedData.find((agency) => agency.id === id) ?? null;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  agencies: router({
    list: publicProcedure.query(listAgencies),
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => getAgencyById(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
