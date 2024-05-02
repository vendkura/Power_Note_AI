import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Typography } from "@/components/ui/typography";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { requiredAuth } from "@/lib/auth/helper";
import { PREMIUM_LIMITATIONS } from "@/lib/premium/premium.constantes";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";
import Link from "next/link";
import { Suspense } from "react";
import { NotesCalendar } from "./calendar/NoteCalendar";
import { getTodayNote } from "./note.query";

export default async function RoutePage(props: PageParams<{}>) {
  const todayNote = await getTodayNote();

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Dashboard</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <div className="gap flex items-start justify-start gap-4 max-lg:flex-col">
          <NotesCalendar startWith="MONDAY" />
          <div className="flex flex-1 flex-col gap-4">
            {todayNote ? (
              <p>TODO : Note Card</p>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Today's note</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    className={buttonVariants({ size: "lg" })}
                    href="/notes/today"
                  >
                    Record a note
                  </Link>
                </CardContent>
              </Card>
            )}
            <Suspense fallback={null}>
              <FreemiumWarning />
            </Suspense>
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
}

const FreemiumWarning = async () => {
  const user = await requiredAuth();

  if (user.plan === "PREMIUM") return;

  const totalNotes = await prisma.note.count({
    where: {
      userId: user.id,
    },
  });

  const limit = PREMIUM_LIMITATIONS.FREE.maxNotes;

  const percentUsed = (totalNotes / limit) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Freemium Warning</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Progress value={percentUsed} />{" "}
          <Typography variant="muted">
            {totalNotes}/{limit}
          </Typography>
        </div>
        <Typography variant="muted">
          As a freemium user, you can only have {limit} notes.
        </Typography>
        <Link href="/upgrade" className={buttonVariants({ size: "sm" })}>
          Upgrade to premium
        </Link>
      </CardContent>
    </Card>
  );
};
