"use client";

import DashboardComponent from "@/components/Dashboard";
import Landing from "@/components/landing/Landing";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";


export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) return <Landing />;

  if (session.user.role === Role.LECTURER || session.user.role === Role.STUDENT) {
    return <DashboardComponent />;
  }

  return <Landing />;
}