import { StickyNote } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

export type LogoSvgProps = ComponentPropsWithoutRef<"svg"> & { size?: number };

export const LogoSvg = ({ size = 32, ...props }: LogoSvgProps) => {
  return <StickyNote size={size} {...props} />;
};
