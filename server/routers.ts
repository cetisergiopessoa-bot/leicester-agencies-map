import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { agencies } from "../drizzle/schema";
import { agencySeedData } from "../shared/agencySeedData";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";

type AgencySource = "database" | "fallback";
const loggedAgencyFallbackReasons = new Set<string>();

const inquiryInputSchema = z.object({
  agencyId: z.string().min(1),
  agencyName: z.string().min(1),
  agencyEmail: z.string().email().optional().nullable(),
  recruiterEmail: z.string().email().optional().nullable(),
  recruiterName: z.string().optional().nullable(),
  senderName: z.string().min(2).max(120),
  senderEmail: z.string().email(),
  senderPhone: z.string().max(50).optional().nullable(),
  message: z.string().min(10).max(5000),
});

async function listAgenciesWithFallback(): Promise<{
  items: typeof agencySeedData;
  source: AgencySource;
  fallbackReason?: string;
}> {
  const logAgencyFallback = (fallbackReason: string) => {
    if (loggedAgencyFallbackReasons.has(fallbackReason)) {
      return;
    }

    loggedAgencyFallbackReasons.add(fallbackReason);
    console.warn(`[Agencies] ${fallbackReason}, using bundled agency seed data`);
  };

  const db = await getDb();
  if (!db) {
    const fallbackReason = "Database not available";
    logAgencyFallback(fallbackReason);
    return { items: agencySeedData, source: "fallback", fallbackReason };
  }

  const result = await db.select().from(agencies);
  if (result.length === 0) {
    const fallbackReason = "Agencies table is empty";
    logAgencyFallback(fallbackReason);
    return { items: agencySeedData, source: "fallback", fallbackReason };
  }

  return { items: result as typeof agencySeedData, source: "database" };
}

async function getAgencyByIdWithFallback(id: string) {
  const db = await getDb();
  if (!db) {
    return agencySeedData.find((agency) => agency.id === id) ?? null;
  }

  const result = await db
    .select()
    .from(agencies)
    .where(eq(agencies.id, id))
    .limit(1);

  if (result.length > 0) {
    return result[0];
  }

  return agencySeedData.find((agency) => agency.id === id) ?? null;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  agencies: router({
    list: publicProcedure.query(async () => {
      return await listAgenciesWithFallback();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getAgencyByIdWithFallback(input.id);
      }),
    submitInquiry: publicProcedure
      .input(inquiryInputSchema)
      .mutation(async ({ input }) => {
        const recipientEmail = input.recruiterEmail || input.agencyEmail;
        if (!recipientEmail) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No contact email is available for this agency.",
          });
        }

        const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
          `Job Inquiry - ${input.agencyName}`
        )}&body=${encodeURIComponent(
          [
            `Name: ${input.senderName}`,
            `Email: ${input.senderEmail}`,
            `Phone: ${input.senderPhone || "Not provided"}`,
            "",
            "Message:",
            input.message,
          ].join("\n")
        )}`;

        const shouldNotifyOwner = Boolean(ENV.forgeApiUrl && ENV.forgeApiKey);
        const notifiedOwner = shouldNotifyOwner
          ? await notifyOwner({
              title: `New agency inquiry for ${input.agencyName}`,
              content: [
                `Agency ID: ${input.agencyId}`,
                `Agency: ${input.agencyName}`,
                `Recipient: ${recipientEmail}`,
                `Recruiter: ${input.recruiterName || "N/A"}`,
                `Sender: ${input.senderName}`,
                `Sender email: ${input.senderEmail}`,
                `Sender phone: ${input.senderPhone || "Not provided"}`,
                "",
                input.message,
              ].join("\n"),
            })
          : false;

        return {
          success: true,
          notifiedOwner,
          recipientEmail,
          mailtoUrl,
        } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
