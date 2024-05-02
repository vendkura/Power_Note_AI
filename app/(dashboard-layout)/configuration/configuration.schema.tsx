import { ConfigurationType as PrismaConfigurationType  } from "@prisma/client";
import { z } from "zod";

export const ConfigurationSchema = z.object({
   type: z.nativeEnum(PrismaConfigurationType),
   name: z.string(),
   description: z.string().optional().nullable(),
   id: z.string().optional().nullable(),
});

export const ConfigurationsSchema =  z.array(ConfigurationSchema);

export type ConfigurationFormType = z.infer<typeof ConfigurationSchema>;