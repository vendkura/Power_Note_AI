import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Typography } from "@/components/ui/typography";
import { AuthButton } from "@/features/auth/AuthButton";
import { SignInButton } from "@/features/auth/SignInButton";
import { UserDropdown } from "@/features/auth/UserDropdown";
import { ContactFeedbackPopover } from "@/features/contact/feedback/ContactFeedbackPopover";
import { ContactSupportDialog } from "@/features/contact/support/ContactSupportDialog";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { auth } from "@/lib/auth/helper";
import { getPremiumLimitation } from "@/lib/premium/getPremiumLimitation";
import { SiteConfig } from "@/site-config";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type PropsWithChildren } from "react";
import { DesktopVerticalMenu } from "../../src/features/navigation/DesktopVerticalMenu";
import { MobileDropdownMenu } from "../../src/features/navigation/MobileDropdownMenu";
import { DASHBOARD_LINKS } from "./dashboard-links";

export const DashboardNavigation = async (props: PropsWithChildren) => {
  const user = await auth();
  return (
    <div className="flex h-full flex-col lg:flex-row lg:overflow-hidden">
      {/* Desktop ONLY Navigation bar */}
      <div className="flex size-full max-w-[240px] flex-col border-r border-border px-2 py-4 max-lg:hidden">
        <div className="flex items-center gap-2">
          <Image
            src={SiteConfig.appIcon}
            alt="app logo"
            width={24}
            height={24}
          />
          <Link href="/" className="text-base font-bold">
            {SiteConfig.title}
          </Link>
        </div>
        <div className="h-10" />
        <DesktopVerticalMenu links={DASHBOARD_LINKS} />
        <div className="flex-1" />
        <div className="flex flex-col gap-2">
          <Suspense fallback={null}>
            <FreemiumWarning />
          </Suspense>
          {user ? (
            <UserDropdown>
              <Button variant="outline" size="sm">
                <Avatar className="mr-2 size-6">
                  <AvatarFallback>
                    {user.email ? user.email.slice(0, 2) : "??"}
                  </AvatarFallback>
                  {user.image && <AvatarImage src={user.image} />}
                </Avatar>
                <span className="max-lg:hidden">{user.name}</span>
              </Button>
            </UserDropdown>
          ) : null}
        </div>
      </div>
      {/* Main container */}
      <div className="flex-1">
        {/* Header */}
        <header className="w-full border-b bg-background max-lg:sticky max-lg:top-0 max-lg:z-40">
          <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <div className="flex items-center gap-2 lg:hidden">
              <Image
                src={SiteConfig.appIcon}
                alt="app logo"
                width={32}
                height={32}
              />
              <Link href="/" className="text-base font-bold">
                {SiteConfig.title}
              </Link>
            </div>

            <div className="flex flex-1 items-center justify-end space-x-4">
              {/* Mobile header */}
              <nav className="flex items-center space-x-1 lg:hidden">
                <AuthButton />
                <ThemeToggle />
                <MobileDropdownMenu links={DASHBOARD_LINKS} />
              </nav>
              {/* Desktop header */}
              <nav className="flex items-center space-x-1 max-lg:hidden">
                <ContactFeedbackPopover>
                  <Button variant="outline" size="sm">
                    Feedback
                  </Button>
                </ContactFeedbackPopover>
                <ThemeToggle />
              </nav>
            </div>
          </div>
        </header>

        {/* Content of the page */}
        <main className="h-full py-4 lg:max-h-[calc(100vh_-_64px)] lg:flex-1 lg:overflow-auto lg:py-8">
          {user ? (
            props.children
          ) : (
            <Layout>
              <LayoutHeader>
                <LayoutTitle>
                  Sorry, you need to be authenticated to access this resource.
                </LayoutTitle>
              </LayoutHeader>
              <LayoutContent className="flex gap-4">
                <SignInButton />
                <ContactSupportDialog>
                  <Button variant="secondary" size="sm">
                    Contact support
                  </Button>
                </ContactSupportDialog>
              </LayoutContent>
            </Layout>
          )}
        </main>
      </div>
    </div>
  );
};

const FreemiumWarning = async () => {
  const paymentInfo = await getPremiumLimitation();

  if (paymentInfo.remainingNotes >= 10) {
    return null;
  }

  return (
    <Card className="flex flex-col gap-2 p-2">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} />
        <Typography variant="small">
          You have {paymentInfo.remainingNotes} notes left.
        </Typography>
      </div>
      <Progress value={paymentInfo.percentUsed} />
    </Card>
  );
};
