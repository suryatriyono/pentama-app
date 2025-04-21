import { auth } from "@/lib/auth";
import { deleteFile, extractPathFromUrl, saveFile } from "@/lib/localFileStorage";
import { prisma } from "@/lib/prisma";
import { calculateDetailedUserProgress, calculateUserProgress } from "@/lib/progressUpdater";
import { getUserScheme } from "@/lib/validations";
import { getUserData } from "@/services/user";
import { createErrorResponse, createSuccessResponse, ErrorType, SuccessType } from "@/types/api";
import { ProgressKey } from "@/types/user";
import { formDataToObject } from "@/utils/identity-extractor";
import { Expertise, Gender, Position } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        createErrorResponse({
          errorType: ErrorType.UNAUTHORIZED,
          message: "You must be logged in to update your profile"
        }),
        { status: 401 }
      );
    }

    const { id, role, detailedProgress, progress } = session.user;

    if (!id) {
      return NextResponse.json(createErrorResponse({
        errorType: ErrorType.INVALID_DATA,
        message: "User ID is required"
      }));
    }

    const formData = await request.formData();

    // Get user to determine role type and current avatar
    const user = await getUserData(id, role);

    if (!user) {
      return NextResponse.json(
        createErrorResponse({
          errorType: ErrorType.NOT_FOUND,
          message: "User not found"
        }),
        { status: 404 }
      );
    }

    // Determine uer type for validation
    const userType = role === "STUDENT" ? "student" : role === "LECTURER" ? "lecturer" : "unknown";

    // Get aprropriate validation schema based on user type
    const isCompleteProfile = progress.completeProfile && detailedProgress[ProgressKey.CompleteProfile].isComplete;
    const validationSchema = getUserScheme(userType);
    const schema = !isCompleteProfile
      ? validationSchema
      : validationSchema.partial()
  
    // Create a data object from formData for validation
    const formDataObj = formDataToObject(formData);

    // Validate the data
    const { success, data, error } = schema.safeParse(formDataObj);

    if (!success || !data) {
      return NextResponse.json(
        createErrorResponse({
          errorType: ErrorType.VALIDATION_ERROR,
          message: error.errors[0].message
        })
      )
    }

    // Handle avatar file upload
    let avatarUrl: string | null = null;
    const { avatar: avatarFile, ...restData } = formDataObj;

    if (avatarFile instanceof File) {
      const arryBuffer = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arryBuffer);

      // Save file locally
      avatarUrl = await saveFile(buffer, avatarFile.name);

      // Delet old avatar if it exists
      if (user.avatarUrl) {
        try {
          const oldAvatarPath = extractPathFromUrl(user.avatarUrl);
          if (oldAvatarPath) {
            await deleteFile(oldAvatarPath);
          }
        } catch (error) {
          console.error("Failed to delete old avatar:", error);
          // Continue with the update even if delete fails
        }
      }
    } else if (typeof avatarFile === "string") {
      // If a string URL is provided, use it directly
      avatarUrl = avatarFile;
    }

    // Prepare user data for update based on userType
    // Common user data that applies to all roles
    const commonUserData = {
      name: String(restData.name),
      ...(restData.gender as Gender ? { gender: restData.gender } : {}),
      ...(avatarUrl !== null ? { avatarUrl } : {})
    }


    // Start transaction tu update relevat data
    const result = await prisma.$transaction(async (tx) => {
      // Update common user data
      const userUpdate = await tx.user.update({
        where: { id },
        data: commonUserData
      });

      // Update role-specific data
      if (userType === "lecturer") {
        // Check if lecturer profile exists
        const existingLecturer = await tx.lecturer.findUnique({
          where: { userId: id }
        });

        if (existingLecturer) {
          // Update lecturer profile
          await tx.lecturer.update({
            where: { userId: id },
            data: {
              position: restData.position as Position,
              expertise: restData.expertise as Expertise
            }
          });
        } else {
          // Create new lecturer profile
          await tx.lecturer.create({
            data: {
              userId: id,
              position: restData.position as Position,
              expertise: restData.expertise as Expertise
            }
          });
        }
      }

      return userUpdate;
    });

    // Calculate updated progress
    const updatedProgress = await calculateUserProgress(id, role);
    const updatedDetailedProgress = await calculateDetailedUserProgress(id, role);

    return NextResponse.json(
      createSuccessResponse({
        successType: SuccessType.UPDATED,
        data: result,
        progress: updatedProgress,
        detailedProgress: updatedDetailedProgress
      })
    );

  } catch (error) {
    return NextResponse.json(
      createErrorResponse({
        errorType: ErrorType.SERVER_ERROR,
        message: error instanceof Error ? error.message : undefined
      })
    );
  }
}