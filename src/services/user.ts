import { hashPassword } from "@/helpers/encryption";
import { prisma } from "@/lib/prisma";
import { AuthSchema } from "@/lib/validations";
import { baseUserSelections, LecturerData, lecturerDataConfig, StudentData, studentDataConfig } from "@/types/user";
import { ParseNim, ParseNip, validateAcademicIdentity } from "@/utils/identity-extractor";
import { Expertise, Gender, Position, Role } from "@prisma/client";


/**
 * Type for processed registration data
*/
export type ProcessedRegistrationData = {
  // User data
  userData: {
    username: string;
    password: string;
    role: Role,
    name?: string,
    gender: Gender,
    isAdmin?: boolean,
    avatarUrl?: string
  };
  // Student data (if username is NIM)
  studentData?: {
    faculty: string;
    educationLevel: string;
    studyProgram: string;
    batch: string;
    researchField?: Expertise;
  } | null;
  // Lecturer data (if username is NIP)
  lecturerData?: {
    position: Position;
    expertise: Expertise;
  } | null;
};

/**
 * Process registration data and extract information from NIM/NIP
 * @param formData Data from form reistration
 * @returns Object containing user data and student/lecturer data
 */
export const processRegistrationData = async (formData: FormData): Promise<ProcessedRegistrationData> => {
  // Retrive username (NIM/NIP) and password from FormData
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Base validation with AuthSchema
  const { data, success, error } = AuthSchema.safeParse({ username, password });

  if (!success) {
    throw new Error(error.errors[0].message);
  }

  // Validate and extraction academic data
  const { details, valid, type: identity } = validateAcademicIdentity(data.username);

  if (!valid) {
    throw new Error("Invalid academic identity");
  }

  const passHash = await hashPassword(data.password);

  // Default user data
  const userData = {
    username: data.username.toLocaleUpperCase(),
    password: passHash,
    gender: Gender.UNKNOWN,
    role: identity === "NIM"
      ? Role.STUDENT
      : identity === "NIP"
        ? Role.LECTURER
        : Role.UNKNOWN
  } as ProcessedRegistrationData["userData"]

  let studentData: ProcessedRegistrationData["studentData"] = null;
  let lecturerData: ProcessedRegistrationData["lecturerData"] = null;

  // Fill in data based on identity
  if (identity === "NIM" && details) {
    const { faculty, educationLevel, programStudy: studyProgram, entryYear: batch } = details as ParseNim;
    studentData = {
      faculty,
      educationLevel,
      studyProgram,
      batch,
    }
  } else if (identity === "NIP" && details) {
    const { gender } = details as ParseNip;
    userData.gender = gender; // Overide the defautt gender with parsed NIP data
    lecturerData = {
      expertise: Expertise.UNKNOWN,
      position: Position.UNKNOWN
    }
  }

  return {
    userData,
    studentData,
    lecturerData,
  }
}

/**
 * Function to fetch data based on user role
*/
export const getUserData = async (id: string, userRole: Role): Promise<StudentData | LecturerData> => {
  switch (userRole) {
    case "STUDENT":
      const studentData = await prisma.user.findUnique({
        where: { id },
        ...studentDataConfig
      });

      if (!studentData) throw new Error(`Student with userId ${id} not found!`);

      return studentData;
    case "LECTURER":
      const lecturerData = await prisma.user.findUnique({
        where: { id },
        ...lecturerDataConfig
      });

      if (!lecturerData) throw new Error(`Lecturer with userId ${id} not found!`);

      return lecturerData;
    default:
      throw new Error(`Unsupported user role: ${userRole}`);
  }
};

/**
  * Function to check complite profile base on user role
*/
export const checkUserProfile = async (id: string): Promise<{
  complete: boolean,
  data?: any,
  error?: string
}> => {
  // Helper for validating non-empty values with proper type checking
  const isNonEmptyString = (value: unknown): boolean => {
    // Null or Undefined check
    if (value === null || value === undefined) return false;

    // Enum check (they are always valid if they not exist)
    if (typeof value === "string" &&
      (
        Object.values(Expertise).includes(value as Expertise) ||
        Object.values(Position).includes(value as Position)
      )
    ) {
      return true;
    }

    // String check with trim
    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    // Other types - convert to string
    return String(value).trim().length > 0;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        ...baseUserSelections,
        student: {
          select: {
            faculty: true,
            educationLevel: true,
            studyProgram: true,
            batch: true,
            researchField: true,
          }
        },
        lecturer: {
          select: {
            expertise: true,
            position: true,
          }
        }
      }
    });

    // Validate user data
    if (!user) {
      return { complete: false, error: `User with id ${id} not found` };
    }

    // Check student complete
    if (user.student) {
      const student = user.student;
      const isCompleted = [
        student.faculty, student.educationLevel, student.studyProgram,
        student.batch, student.researchField
      ].every(isNonEmptyString);

      return { complete: isCompleted, data: student };
    }

    // Check lectuer complete
    if (user.lecturer) {
      const lecturer = user.lecturer;
      const isCompleted = [
        lecturer.expertise, lecturer.position
      ].every(isNonEmptyString);

      return { complete: isCompleted, data: lecturer };
    }

    // No profile found
    return { complete: false, error: "No profile found" };
  } catch (error) {
    return {
      complete: false,
      error: error instanceof Error ? error.message : "Unknown error checking profile"
    };
  }
}