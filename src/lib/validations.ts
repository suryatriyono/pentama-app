import { UserDataType } from "@/types/user";
import { validateAcademicIdentity } from "@/utils/identity-extractor";
import { Expertise, Gender, Position } from "@prisma/client";
import { z } from "zod";

// Avatar file validation schema
const AvatarSchema = z.object({
  name: z.string().optional(),
  size: z.number().max(3 * 1024 * 1024, "File must be less than 3 MB!"),
  type: z.string().refine(
    (val) => ["image/png"].includes(val),
    "Only PNG images are allowed!"
  )
});

export const AuthSchema = z.object({
  username: z.string()
    .nonempty("Username cannot be empty!")
    .toUpperCase()
    .refine(val => {
      const result = validateAcademicIdentity(val);
      return result.valid;
    }, "Username must be NIM or NIP!"),
  password: z.string()
    .min(8, "Minimum password length is 8 characters!")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be strong!"),
});

export const StudentSchema = z.object({
  gender: z.enum([Gender.FEMALE, Gender.MALE], { message: "Unsupported gender!" }),
});

export const LecturerSchema = z.object({
  position: z.enum([Position.LEKTOR, Position.LEKTOR_KEPALA, Position.ASISTEN_AHLI, Position.PROFESOR], { message: "Unsupported Position!" }),
  expertise: z.enum([Expertise.AES, Expertise.NIC], { message: "Unsupported Expertise!" })
})

export const UserSchema = z.object({
  name: z.string().nonempty("Name cannot be empty!").min(3, "Name at leats 3 characters").max(125, "Name up to 125 characters"),
  avatar: z.union([
    z.string().url("Avatar must be valid URLs"),
    AvatarSchema
  ], { message: "Avatar must be valid!" }),
});

// Halper function to choose the righnt schme based on user rola
export const getUserScheme = (userType: UserDataType) => {
  switch (userType) {
    case "student": {
      const studentSchema = z.object({
        ...UserSchema.shape,
        ...StudentSchema.shape
      });
      return studentSchema;
    }
    case "lecturer":
    case "admin":
      const lecturerSchema = z.object({
        ...UserSchema.shape,
        ...LecturerSchema.shape
      });
      return lecturerSchema;
    default:
      return UserSchema;
  }
}





// export const StudentSchema = z.object({
//   faculty: z.string().nonempty("Faculty cannot be empty!"),
//   educationLevel: z.string().nonempty("Education level must not be empty!"),
//   studyProgram: z.string().nonempty("Student program must not be empty!"),
//   batch: z.string()
//     .nonempty("Batch must not be empty!")
//     .regex(/^\d{4}$/, "The format of the class year must be 4 digits (example: 2023)"),
//   researchField: z.enum([Expertise.AES, Expertise.NIC], {
//     message: "Research field must be AES or NIC!"
//   }),
// });

// export const LecturerSchema = z.object({
//   position: z.enum([
//     Position.LEKTOR_KEPALA,
//     Position.PROFESOR,
//     Position.ASISTEN_AHLI,
//     Position.LEKTOR
//   ], {
//     message: "Position must be valid (LEKTOR_KEPALA, PROFESOR, ASISTEN_AHLI, or LEKTOR)!"
//   }),
//   expertise: z.enum([Expertise.AES, Expertise.NIC], {
//     message: "Research field must be AES or NIC!!"
//   }),
// });