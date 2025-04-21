import { auth } from "@/lib/auth";
import { getUserData } from "@/services/user";
import { createErrorResponse, createSuccessResponse, ErrorType, SuccessType } from "@/types/api";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user.id || !Object.values(Role).includes(session.user.role)) {
      return NextResponse.json(
        createErrorResponse({
          errorType: ErrorType.UNAUTHORIZED
        }), { status: 401 }
      )
    }

    const user = await getUserData(session.user.id, session.user.role);

    return NextResponse.json(
      createSuccessResponse({
        successType: SuccessType.RETRIEVED,
        data: user
      })
    )

  } catch (error) {
    /**
    * Check if it's a "not found" error 
    */
    if (error instanceof Error &&
      (error.message.includes("not found") ||
        error.message.includes("Unsupported user role"))) {
      return NextResponse.json(
        createErrorResponse({
          errorType: ErrorType.NOT_FOUND,
          message: error.message
        }), { status: 404 }
      )
    }
    return NextResponse.json(createErrorResponse({
      errorType: ErrorType.SERVER_ERROR
    }), { status: 500 });
  }
}
