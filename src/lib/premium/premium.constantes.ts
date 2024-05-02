import type { UserPlan } from "@prisma/client";

export const PREMIUM_LIMITATIONS: Record<UserPlan, { maxNotes: number }> = {
  FREE: {
    maxNotes: 10,
  },
  PREMIUM: {
    maxNotes: Infinity,
  },
};
