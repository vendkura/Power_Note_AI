"use server"

import { authAction } from "@/lib/server-actions/safe-actions"

export const updateConfigurations = authAction;