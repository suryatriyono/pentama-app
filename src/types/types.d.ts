import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { Progress, ProgressWithPercentage } from "./user";

declare module "next-auth" {
  interface Session {
    user: {
      progress: Progress
      detailedProgress: ProgressWithPercentage
    } & DefaultSession["user"]
  }
  
  interface User {
    username: string;
    role: Role;
  }
}