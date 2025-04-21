import { getUserData } from "@/services/user";
import { calculateDetailedProgress, calculateProgress, Progress, ProgressWithPercentage } from "@/types/user";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
/**
 * Hook for updated user progress
*/

export const useProgressUpdater = () => {
  const { data: session, update } = useSession();

  /**
   * Function to updated session progress data in based on data from server
  */
  const updateSession = async (progress: Progress, detailedProgress?: ProgressWithPercentage) => {
    try {
      console.log(detailedProgress);
      // If detailed progress is not provided, only update regular progress
      if (detailedProgress) {
        const updatedSession = await update({
          ...session,
          user: {
            ...session?.user,
            progress,
            detailedProgress
          }
        });
        return updatedSession;
      }

      const updatedSession = await update({
        ...session,
        user: {
          ...session?.user,
          progress
        }
      });

      return updatedSession;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Function to recalculate and updated progress
   * Use after get new data from server
  */
  const recalculateAndUpdateProgress = async (id: string, role: Role) => {
    try {
      const newProgress = await calculateUserProgress(id, role);
      const newDetailedProgress = await calculateDetailedUserProgress(id, role);

      await updateSession(newProgress, newDetailedProgress);

      return {
        progress: newProgress,
        detailedProgress: newDetailedProgress
      }
    } catch (error) {
      console.error("Error recalculating progress:", error);
      throw error;
    }
  }

  return {
    updateSession,
    recalculateAndUpdateProgress
  }
};

/**
* Function for use in API Routes
* Calclated and return progress based on user ID  
*/

export const calculateUserProgress = async (userId: string, role: Role) => {
  const userData = await getUserData(userId, role);
  return calculateProgress(userData);
};

/**
 * Function for use in API Routes
 * Calculates and returns detailed progress based on user ID
 */
export const calculateDetailedUserProgress = async (userId: string, role: Role) => {
  const userData = await getUserData(userId, role);
  return calculateDetailedProgress(userData, role);
};