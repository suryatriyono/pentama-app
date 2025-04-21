import { prisma } from "@/lib/prisma";
import { processRegistrationData } from "@/services/user";
import { createErrorResponse, createSuccessResponse, ErrorType, SuccessType } from "@/types/api";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const { userData, studentData, lecturerData } = await processRegistrationData(formData);

    // Create user and associated data in database transactions
    const newUser = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: userData
      });

      // Create Student/Lecturer data accroding to role
      if (userData.role === "STUDENT" && studentData) {
        await tx.student.create({
          data: {
            ...studentData,
            userId: user.id
          }
        })
      }

      if (userData.role === "LECTURER" && lecturerData) {
        await tx.lecturer.create({
          data: {
            ...lecturerData,
            userId: user.id
          }
        })
      }

      return user;
    });
    return NextResponse.json(createSuccessResponse({
      successType: SuccessType.AUTH_REGISTER,
      message: "User created successfully",
      data: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    }), {status: 201});

  } catch (error) {
    return NextResponse.json(createErrorResponse({
      errorType: ErrorType.SOMETHING_WRONG,
      message: error instanceof Error ? error.message : undefined
    }), { status: 500 });
  }

}