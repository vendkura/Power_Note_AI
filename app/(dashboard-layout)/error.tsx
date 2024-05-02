"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton } from "@/features/auth/SignInButton";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { useEffect } from "react";

export default function RouteError({ error, reset }: ErrorParams) {
  useEffect(() => {
    // Log the error to an error reporting service
    logger.error(error);
  }, [error]);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>
          You need to be authenticated to access this resource.
        </LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <Card variant="error">
          <CardHeader>
            <CardTitle>
              Sorry, you need to be authenticated to access this resource.
            </CardTitle>
          </CardHeader>
          <CardFooter>
            <Button onClick={reset}>Try again</Button>
            <SignInButton />
          </CardFooter>
        </Card>
      </LayoutContent>
    </Layout>
  );
}
