import { ERROR_MESSAGES } from "@/types/api";
import { DEFAULT_DETAILED_PROGRESS, DEFAULT_PROGRESS, Progress, ProgressWithPercentage } from "@/types/user";
import { Role } from "@prisma/client";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { verifyPassword } from "../helpers/encryption";
import { prisma } from "./prisma";
import { calculateDetailedUserProgress, calculateUserProgress } from "./progressUpdater";
import { AuthSchema } from "./validations";

class InvalidLoginError extends CredentialsSignin {
  code = "Server Error"
  constructor(code: string) {
    super();
    this.code = code;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text"},
        password: { label: "Password", type: "password"}
      },
      authorize: async (credentials) => {
        try {
          // Input validation
          const {username , password } = await AuthSchema.parseAsync(credentials);

          console.log(username);

          // find user by email
          const user = await prisma.user.findUnique({
            where: { username },
          });

          if (!user) {
            throw new InvalidLoginError(ERROR_MESSAGES.USER_NOT_FOUND);
          }

          const isValid = await verifyPassword(password, user.password);

          if (!isValid) {
            throw new InvalidLoginError(ERROR_MESSAGES.PASSWORD_MISMATCH)
          }

          return {
            id: user.id,
            username: user.username,
            role: user.role
          };
        } catch (error) {
          if (error instanceof ZodError) {
            throw new InvalidLoginError(ERROR_MESSAGES.INVALID_DATA)
          }
          throw error;
        }
      }
    })
  ],
  // Custom pages
  pages: {
    signIn: "/login",
    newUser: "/register"
  },
  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every day
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;

        // Calculate progress based on user
        try {
          token.progress = await calculateUserProgress(user.id as string, user.role);
          token.detailedProgress = await calculateDetailedUserProgress(user.id as string, user.role);
        } catch (error) {
          console.error("Error fetching student profile: ", error);
          token.progress = DEFAULT_PROGRESS;
          token.detailedProgress = DEFAULT_DETAILED_PROGRESS;
        }

      }

      if (trigger === "update") {
        if (session.user.progress) {
          token.progress = session.user.progress
        }
        if (session.user.detailedProgress) {
          token.detailedProgress = session.user.detailedProgress;
        }
      }
      return token
    },
    session: async ({ session, token}) => {
      // Efficiently assign token data to session
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          role: token.role as Role,
          progress: token.progress as Progress,
          detailedProgress: token.detailedProgress as ProgressWithPercentage
        }
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
});

