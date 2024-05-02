import { auth } from "../auth/helper";
import { prisma } from "../prisma";

export const getPremiumLimitation = async () => {
  const user = await auth();

  if (!user) {
    return {
      maxNotes: 0,
      remainingNotes: 0,
      percentUsed: 100,
    };
  }

  if (user.plan === "PREMIUM")
    return { maxNotes: Infinity, remainingNotes: Infinity, percentUsed: 0 };

  const totalNotes = await prisma.note.count({
    where: {
      userId: user.id,
    },
  });

  return {
    maxNotes: 10,
    remainingNotes: 10 - totalNotes,
    percentUsed: (totalNotes / 10) * 100,
  };
};
