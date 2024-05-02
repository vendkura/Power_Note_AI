import { requiredAuth } from "@/lib/auth/helper";
import { getTodayDate } from "@/lib/note-utils/date";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const getTodayNote = async () => {
  const user = await requiredAuth();
  const note = await prisma.note.findFirst({
    where: {
      date: getTodayDate(),
      userId: user.id,
    },
    include: {
      informations: true,
    },
  });

  return note;
};

export type NoteType = NonNullable<
  Prisma.PromiseReturnType<typeof getTodayNote>
>;

export const getNote = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  const date = new Date(Number(id));
  const isValidDate = !isNaN(date.getTime());

  const note = await prisma.note.findFirst({
    where: {
      OR: [
        {
          id: id,
        },
        isValidDate
          ? {
              date,
            }
          : {},
      ],
      userId,
    },
    include: {
      informations: true,
    },
  });

  return note;
};
