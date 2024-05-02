"use client";

import { formatDate } from "date-fns";
import { useIsClient } from "usehooks-ts";

export type RenderDateProps = {
  date: Date;
};

/**
 * Render Date in Client Component to have to correct date format
 * @returns
 */
export const RenderDate = (props: RenderDateProps) => {
  const isClient = useIsClient();

  if (!isClient) return;

  return formatDate(props.date, "yyyy-MM-dd");
};
