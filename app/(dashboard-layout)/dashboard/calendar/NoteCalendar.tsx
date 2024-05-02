"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { getNoteCalendar } from "./note-calendar.query";

type NotesCalendarProps = {
  startWith: "MONDAY" | "SUNDAY";
};

const fetchMonth = async (month: Date) => {
  const { data, serverError } = await getNoteCalendar({
    month: month,
  });

  if (!data || serverError) {
    throw new Error("Failed to fetch notes");
  }

  const { notes, summaries } = data;

  const difference = new Date().getTimezoneOffset() / -60;

  notes.forEach((note) => {
    note.date = new Date(note.date);
    note.date.setHours(note.date.getHours() + difference);
  });

  summaries.forEach((summary) => {
    summary.date = new Date(summary.date);
    summary.date.setHours(summary.date.getHours() + difference);
  });

  return {
    notes,
    summaries,
  };
};

export const NotesCalendar: React.FC<NotesCalendarProps> = ({ startWith }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [displayedKey, setDisplayedKey] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notes", "calendar", currentMonth],
    queryFn: async () => fetchMonth(currentMonth),
  });

  const notes = data?.notes;
  const summaries = data?.summaries;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate =
    startWith === "MONDAY"
      ? startOfWeek(monthStart, { weekStartsOn: 1 })
      : startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const daysOfMonth = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const dayLabels =
    startWith === "MONDAY"
      ? ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const notesKeys = Array.from(
    new Set(
      notes?.flatMap((note) => note.informations.map((i) => i.name)) ?? [],
    ),
  );

  const prefetchMonth = async (month: Date) => {
    await queryClient.prefetchQuery({
      queryKey: ["notes", "calendar", month],
      queryFn: async () => fetchMonth(currentMonth),
    });
  };

  return (
    <Card className="max-w-lg">
      <CardHeader className="mb-4 flex flex-row items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setCurrentMonth((curr) => subMonths(curr, 1))}
          onMouseEnter={() => {
            prefetchMonth(subMonths(currentMonth, 1));
          }}
        >
          Previous
        </Button>
        <h2 className="text-lg font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        {notesKeys.length > 0 ? (
          <Select value={displayedKey ?? ""} onValueChange={setDisplayedKey}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Content"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {notesKeys.map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setCurrentMonth((curr) => addMonths(curr, 1))}
          onMouseEnter={() => {
            prefetchMonth(addMonths(currentMonth, 1));
          }}
        >
          Next
        </Button>
      </CardHeader>

      <CardContent className="grid w-fit grid-cols-8 gap-2">
        {dayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
        {daysOfMonth.map((day) => {
          // if it's start of a new row
          const isStartOfWeek =
            startWith === "MONDAY"
              ? format(day, "i") === "1"
              : format(day, "i") === "0";

          // Define if the day is an overflow or if it's a day inside the current seelect mobt
          const isInCurrentMonth = day >= monthStart && day <= monthEnd;

          const noteForDay = notes?.find((note) =>
            isSameDay(new Date(note.date), day),
          );

          const today = new Date();
          const isToday = isSameDay(day, today);

          const displayNote = noteForDay?.informations.find(
            (i) => i.name === displayedKey,
          );

          const content = displayNote?.value;
          const type = displayNote?.type;

          const summary = isStartOfWeek
            ? summaries?.find((s) => {
                const noteForDayTime = noteForDay?.date.getTime();
                if (!noteForDayTime) return;

                if (
                  s.date.getTime() > noteForDayTime + 1000 * 60 * 60 ||
                  s.date.getTime() < noteForDayTime - 1000 * 60 * 60
                ) {
                  return true;
                }
              })
            : null;

          return (
            <>
              {isStartOfWeek &&
                (summary ? (
                  <Link
                    href={`/summaries/${summary.id}`}
                    key={day.toString()}
                    className={cn(
                      `size-10  flex items-center justify-center relative lg:size-12 rounded-md border border-border`,
                      {
                        "border-2 border-accent": isToday,
                        "opacity-50": !isInCurrentMonth,
                      },
                      type === "BOOLEAN"
                        ? {
                            "bg-green-500/50": Boolean(content),
                            "bg-red-500/50": !Boolean(content),
                          }
                        : null,
                    )}
                  >
                    P
                  </Link>
                ) : (
                  <div className="size-10"></div>
                ))}
              <Link
                href={`/notes/${noteForDay?.id ?? day.getTime()}`}
                key={day.toString()}
                className={cn(
                  `size-10 block relative lg:size-12 rounded-md border border-border`,
                  {
                    "border-2 border-accent": isToday,
                    "border-primary": noteForDay,
                    "opacity-50": !isInCurrentMonth,
                  },
                  type === "BOOLEAN"
                    ? {
                        "bg-green-500/50": Boolean(content),
                        "bg-red-500/50": !Boolean(content),
                      }
                    : null,
                )}
              >
                <Typography
                  variant="muted"
                  className="absolute right-1 top-0 text-xs"
                >
                  {format(day, "d")}
                </Typography>
                {type === "NUMBER" && (
                  <Typography
                    variant="small"
                    className="absolute bottom-2 left-2"
                  >
                    {content?.toString()}
                  </Typography>
                )}
              </Link>
            </>
          );
        })}
      </CardContent>
    </Card>
  );
};
