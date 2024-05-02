"use server";

import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/server-actions/safe-actions";
import { endOfMonth, startOfMonth } from "date-fns";
import { z } from "zod";

export const getNoteCalendar = authAction(
  z.object({
    month: z.date(),
  }),
  async (input, context) => {
    const monthStart = startOfMonth(input.month);
    const monthEnd = endOfMonth(input.month);

    const notes = await prisma.note.findMany({
      where: {
        userId: context.user.id,
        date: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
      include: {
        informations: true,
      },
    });

    const summaries = await prisma.summary.findMany({
      where: {
        userId: context.user.id,
        date: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
    });

    return { notes, summaries };
  },
);
