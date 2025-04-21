import { validateAcademicIdentity } from "@/utils/identity-extractor";
import { Assessment, AssessmentStatus, AssessorRole, FinalProjectStage, FinalProjectStatus, Prisma, Role } from "@prisma/client";
import { Session } from "next-auth";

// Contants
export enum ProgressKey {
  CompleteProfile = "completeProfile",
  CanAccessResult = "canAccessResult",
  CanAccessFinal = "canAccessFinal"
};

// Progress percentages for detailed tracking
export enum ProgressPercentage {
  ProfileIncomplete = 0,
  ProfilePartial = 50,
  ProfileComplete = 100,

  ProposalNotStarted = 0,
  ProposalInProgress = 25,
  ProposalSubmitted = 50,
  ProposalReviewed = 75,
  ProposalCompleted = 100,

  ResultNotStarted = 0,
  ResultInProgress = 25,
  ResultSubmitted = 50,
  ResultReviewed = 75,
  ResultCompleted = 100,

  FinalNotStarted = 0,
  FinalInProgress = 25,
  FinalSubmitted = 50,
  FinalReviewed = 75,
  FinalCompleted = 100
}

// Progress type with percentage
export type DetailedProgress = {
  isComplete: boolean;
  percentage: number;
};

// Enhanced Progress type with percentages
export type ProgressWithPercentage = {
  [ProgressKey.CompleteProfile]: DetailedProgress;
  [ProgressKey.CanAccessResult]: DetailedProgress;
  [ProgressKey.CanAccessFinal]: DetailedProgress;
};

export type Progress = Record<ProgressKey, boolean>;

export const DEFAULT_PROGRESS: Progress = {
  [ProgressKey.CompleteProfile]: false,
  [ProgressKey.CanAccessResult]: false,
  [ProgressKey.CanAccessFinal]: false
};

export const DEFAULT_DETAILED_PROGRESS: ProgressWithPercentage = {
  [ProgressKey.CompleteProfile]: { isComplete: false, percentage: ProgressPercentage.ProfileIncomplete },
  [ProgressKey.CanAccessResult]: { isComplete: false, percentage: ProgressPercentage.ProposalNotStarted },
  [ProgressKey.CanAccessFinal]: { isComplete: false, percentage: ProgressPercentage.ResultNotStarted }
};

// Base user data selections cummon to all user
export const baseUserSelections = {
  id: true,
  username: true,
  name: true,
  gender: true,
  role: true,
  avatarUrl: true
}

// Configuration for Prisma selection
export const studentDataConfig = {
  select: {
    ...baseUserSelections,
    isAdmin: true,
    student: {
      include: {
        finalProject: {
          include: {
            assessments: true,
            assessors: true
          }
        }
      }
    }
  }
} satisfies Prisma.UserDefaultArgs;

export const lecturerDataConfig = {
  select: {
    ...baseUserSelections,
    isAdmin: true,
    lecturer: {
      include: {
        assessments: true
      }
    }
  }
} satisfies Prisma.UserDefaultArgs;

export type StudentData = Prisma.UserGetPayload<typeof studentDataConfig>;
export type LecturerData = Prisma.UserGetPayload<typeof lecturerDataConfig>;

export type UserData = StudentData | LecturerData | null;

export type Student = {
  type: "student"
  data: StudentData,
  progress: Progress,
  detailedProgress: ProgressWithPercentage
}

export type Lecturer = {
  type: "lecturer"
  data: LecturerData,
  progress: Progress,
  detailedProgress: ProgressWithPercentage
}

export type Unknown = {
  type: "unknown",
  data: null,
  progress: Progress,
  detailedProgress: ProgressWithPercentage
};

export type User = Student | Lecturer | Unknown;

export const DEFAULT_USER: User = {
  type: "unknown",
  data: null,
  progress: DEFAULT_PROGRESS,
  detailedProgress: DEFAULT_DETAILED_PROGRESS
}

// Type guard for student data
export const isStudentData = (data: UserData): data is StudentData => {
  if (!data) return false;
  const { valid, type } = validateAcademicIdentity(data.username);
  return valid && type === "NIM";
}

// Type guard for student data
export const isLecturerData = (data: UserData): data is LecturerData => {
  if (!data) return false;
  const { valid, type } = validateAcademicIdentity(data.username);
  return valid && type === "NIP";
}

// Guard function to check identity user data
export type UserDataType = "student" | "lecturer" | "admin" | "unknown";

export const whoYouAre = (data: UserData): UserDataType => {
  if (isLecturerData(data) && data.isAdmin) return "admin";
  if (isStudentData(data)) return "student";
  if (isLecturerData(data)) return "lecturer";
  return "unknown";
}

// Check that all require basic data has been filled in for the user 
const defaultDataComplete = { isComplete: false, percentage: 0 };

const baseDataComplete = (data: any, requiredFields: string[]): { isComplete: boolean, percentage: number } => {
  if (!data) return defaultDataComplete;

  const filledFields = requiredFields.filter(field => {
    const value = data[field];
    return value !== undefined && value !== null && value !== "";
  });

  const percentage = Math.round((filledFields.length / requiredFields.length) * 100);
  const isComplete = percentage === 100;

  return { isComplete, percentage };
};

// Halper function to check assessment status for a specific stage
type FinalProject = Prisma.FinalProjectGetPayload<{
  include: {
    assessments: true,
    assessors: true
  }
}>;
const checkStageAssessments = (finalProject: FinalProject, stage: FinalProjectStage): {
  isComplete: boolean,
  percentage: number,
} => {
  if (!finalProject) {
    return { isComplete: false, percentage: ProgressPercentage.ProposalNotStarted };
  }

  // Function to check if stage is at least at the given level
  const isAtOrPastStage = (currentStage: FinalProjectStage, targetStage: FinalProjectStage): boolean => {
    const stageOrder = [
      FinalProjectStage.PROPOSAL,
      FinalProjectStage.RESULT,
      FinalProjectStage.FINAL,
      FinalProjectStage.COMPLETED
    ];

    const currentIndex = stageOrder.indexOf(currentStage);
    const targetIndex = stageOrder.indexOf(targetStage);

    return currentIndex >= targetIndex;
  }

  // Check if we've reached or passed this stage
  if (
    (stage === FinalProjectStage.PROPOSAL && !isAtOrPastStage(finalProject.stage, FinalProjectStage.PROPOSAL)) ||
    (stage === FinalProjectStage.RESULT && !isAtOrPastStage(finalProject.stage, FinalProjectStage.RESULT)) ||
    (stage === FinalProjectStage.FINAL && !isAtOrPastStage(finalProject.stage, FinalProjectStage.RESULT))
  ) {
    // Haven't reached this stage yet
    return {
      isComplete: false,
      percentage: stage === FinalProjectStage.PROPOSAL
        ? ProgressPercentage.ProposalNotStarted
        : stage === FinalProjectStage.RESULT
          ? ProgressPercentage.ResultNotStarted
          : ProgressPercentage.FinalNotStarted
    }
  }

  // Filter assessments for this stage 
  const stageAssessments = finalProject.assessments.filter(
    (assessment: Assessment) => assessment.stage === stage
  ) || [];

  // Determine if we have all require assessors and their assessments
  const requiredAssessorRoles = [AssessorRole.SUPERVISOR_1, AssessorRole.SUPERVISOR_2, AssessorRole.EXAMINER_1, AssessorRole.EXAMINER_2];
  const assessorsPresent = finalProject.assessors.length >= requiredAssessorRoles.length || false;

  // Count submitted assessments for this stage 
  const submittedAssessments = stageAssessments.filter(
    (assessment: Assessment) => assessment.status === AssessmentStatus.SUBMITTED
  ).length;

  // Calculate percentage based on status adn number of assessments
  let percentage = ProgressPercentage.ProposalNotStarted;

  if (stage === FinalProjectStage.PROPOSAL) {
    if (finalProject.status === FinalProjectStatus.DRAFT) {
      percentage = ProgressPercentage.ProposalInProgress;
    } else if (finalProject.status === FinalProjectStatus.SUBMITTED) {
      percentage = ProgressPercentage.ProposalSubmitted;
    } else if (submittedAssessments > 0 && submittedAssessments < requiredAssessorRoles.length) {
      percentage = ProgressPercentage.ProposalReviewed;
    } else if (
      submittedAssessments >= requiredAssessorRoles.length ||
      finalProject.status === FinalProjectStatus.PASSED ||
      finalProject.stage !== FinalProjectStage.PROPOSAL
    ) {
      percentage = ProgressPercentage.ProfileComplete;
    }
  } else if (stage === FinalProjectStage.RESULT) {
    if (finalProject.status === FinalProjectStatus.DRAFT) {
      percentage = ProgressPercentage.ResultInProgress;
    } else if (finalProject.status === FinalProjectStatus.SUBMITTED) {
      percentage = ProgressPercentage.ResultSubmitted;
    } else if (submittedAssessments > 0 && submittedAssessments < requiredAssessorRoles.length) {
      percentage = ProgressPercentage.ResultReviewed;
    } else if (
      submittedAssessments >= requiredAssessorRoles.length ||
      finalProject.status === FinalProjectStatus.PASSED ||
      finalProject.stage !== FinalProjectStage.RESULT
    ) {
      percentage = ProgressPercentage.ResultCompleted;
    }
  } else {
    if (finalProject.status === FinalProjectStatus.DRAFT) {
      percentage = ProgressPercentage.FinalInProgress;
    } else if (finalProject.status === FinalProjectStatus.SUBMITTED) {
      percentage = ProgressPercentage.FinalSubmitted;
    } else if (submittedAssessments > 0 && submittedAssessments < requiredAssessorRoles.length) {
      percentage = ProgressPercentage.FinalReviewed;
    } else if (
      submittedAssessments >= requiredAssessorRoles.length ||
      finalProject.status === FinalProjectStatus.PASSED ||
      finalProject.stage === FinalProjectStage.COMPLETED
    ) {
      percentage = ProgressPercentage.FinalCompleted;
    }
  }

  // Stage is complete if all assessments are submitted or if we've moved past this stage
  const isComplete = (
    (stage === FinalProjectStage.PROPOSAL &&
      (finalProject.stage !== FinalProjectStage.PROPOSAL ||
        (submittedAssessments >= requiredAssessorRoles.length && finalProject.status === FinalProjectStatus.PASSED))) ||
    (stage === FinalProjectStage.RESULT &&
      (finalProject.stage !== FinalProjectStage.RESULT ||
        (submittedAssessments >= requiredAssessorRoles.length && finalProject.status === FinalProjectStatus.PASSED))) ||
    (stage === FinalProjectStage.FINAL &&
      finalProject.stage === FinalProjectStage.COMPLETED)
  );

  return { isComplete, percentage }
};

// Specific progress calculation for students
const calculateStudentProgress = (data: StudentData): ProgressWithPercentage => {
  // Check basic profile completeness
  const userRequiredFields = ["username", "name", "gender", "avatarUrl"];
  const studentRequiredFields = ["faculty", "educationLevel", "studyProgram", "batch", "researchField"];

  const userProfileStatus = baseDataComplete(data, userRequiredFields);
  const studentProfileStatus = data.student ? baseDataComplete(data.student, studentRequiredFields) : defaultDataComplete;

  // Calculate overall profile completeness
  const totalFields = userRequiredFields.length + studentRequiredFields.length;
  const filledUserFields = userProfileStatus.isComplete ? userRequiredFields.length : Math.floor((userProfileStatus.percentage / 100) * userRequiredFields.length);
  const filledStudentFields = studentProfileStatus.isComplete ? studentRequiredFields.length : Math.floor((studentProfileStatus.percentage / 100) * studentRequiredFields.length);

  const profilePercentage = Math.round(((filledUserFields + filledStudentFields) / totalFields) * 100);
  const profileComplete = { isComplete: userProfileStatus.isComplete && studentProfileStatus.isComplete, percentage: profilePercentage };

  // Check if final project exist
  const finalProject = data.student?.finalProject;

  // Check proposal stage
  const proposalStatus = finalProject ? checkStageAssessments(finalProject, FinalProjectStage.PROPOSAL) : defaultDataComplete;

  // Check result stage
  const resultStatus = finalProject ? checkStageAssessments(finalProject, FinalProjectStage.RESULT) : defaultDataComplete;

  // Check final stage
  const finalStatus = finalProject ? checkStageAssessments(finalProject, FinalProjectStage.FINAL) : defaultDataComplete;

  // Determine if they can access result and final stages
  const canAccessResult = {
    isComplete: proposalStatus.isComplete,
    percentage: proposalStatus.percentage
  }

  const canAccessFinal = {
    isComplete: proposalStatus.isComplete && resultStatus.isComplete,
    percentage: resultStatus.isComplete ? resultStatus.percentage : proposalStatus.percentage
  }

  return {
    [ProgressKey.CompleteProfile]: profileComplete,
    [ProgressKey.CanAccessResult]: canAccessResult,
    [ProgressKey.CanAccessFinal]: canAccessFinal
  }
};

// Specific progress calculations for lectures
const calculateLecturerProgress = (data: LecturerData): ProgressWithPercentage => {
  // Check user profile completeness
  const userRequiredFields = ["username", "name", "gender", "avatarUrl"];
  const lecturerRequiredFields = ["position", "expertise"];

  const userProfileStatus = baseDataComplete(data, userRequiredFields);
  const lecturerProfileStatus = data.lecturer ? baseDataComplete(data.lecturer, lecturerRequiredFields) : defaultDataComplete;

  // Calculate overall profile completeness
  const totalFields = userRequiredFields.length + lecturerRequiredFields.length;
  const filledUserFields = userProfileStatus.isComplete ? userRequiredFields.length : Math.floor((userProfileStatus.percentage / 100) * userRequiredFields.length);
  const filledLecturerFields = lecturerProfileStatus.isComplete ? lecturerRequiredFields.length : Math.floor((lecturerProfileStatus.percentage / 100) * lecturerRequiredFields.length);

  const profilePercentage = Math.round(((filledUserFields + filledLecturerFields) / totalFields) * 100);
  const profileComplete = {
    isComplete: userProfileStatus.isComplete && lecturerProfileStatus.isComplete,
    percentage: profilePercentage
  };

  // For lecturers, if profile is complete, they can access everything
  // otherwise, access is directly proportional to profile completion
  return {
    [ProgressKey.CompleteProfile]: profileComplete,
    [ProgressKey.CanAccessResult]: profileComplete, // Same as profile completeness
    [ProgressKey.CanAccessFinal]: profileComplete   // Same as profile completeness
  };
};

// Main function to calculate progress based on user data
export const calculateDetailedProgress = (userData: UserData, role?: Role): ProgressWithPercentage => {
  if (!userData) return DEFAULT_DETAILED_PROGRESS;

  if (!role) {
    if (isStudentData(userData)) {
      return calculateStudentProgress(userData);
    } else if (isLecturerData(userData)) {
      return calculateLecturerProgress(userData);
    } else {
      return DEFAULT_DETAILED_PROGRESS;
    }
  }

  switch (role) {
    case "STUDENT":
      return calculateStudentProgress(userData as StudentData);
    case "LECTURER":
      return calculateLecturerProgress(userData as LecturerData);
    default:
      return DEFAULT_DETAILED_PROGRESS;
  }
};

// Convert detailed progress to simple boolean progress for backward companility
export const calculateProgress = (userData: UserData, role?: Role): Progress => {
  const detailedProgress = calculateDetailedProgress(userData, role);
  return {
    [ProgressKey.CompleteProfile]: detailedProgress[ProgressKey.CompleteProfile].isComplete,
    [ProgressKey.CanAccessResult]: detailedProgress[ProgressKey.CanAccessResult].isComplete,
    [ProgressKey.CanAccessFinal]: detailedProgress[ProgressKey.CanAccessFinal].isComplete
  };

};

// Helper to get progress on user session data
export const getProgressFromSession = (session: Session): Progress => {
  if (!session.user) return DEFAULT_PROGRESS;

  // Use progress from session if available
  if (session.user.progress) {
    return session.user.progress;
  }

  // Fallback default progress
  return DEFAULT_PROGRESS;
};

// Helper to get detailed progress from session
export const getDetailedProgressFromSession = (session: Session): ProgressWithPercentage => {
  if (!session.user) {
    return DEFAULT_DETAILED_PROGRESS;
  }

  // Use detailed progress from session if available
  if (session.user.detailedProgress) {
    return session.user.detailedProgress;
  }

  // Try to convert regular progress to detailed if available
  if (session.user.progress) {
    return {
      [ProgressKey.CompleteProfile]: { 
        isComplete: session.user.progress[ProgressKey.CompleteProfile],
        percentage: session.user.progress[ProgressKey.CompleteProfile] ? 100 : 0
      },
      [ProgressKey.CanAccessResult]: { 
        isComplete: session.user.progress[ProgressKey.CanAccessResult],
        percentage: session.user.progress[ProgressKey.CanAccessResult] ? 100 : 0
      },
      [ProgressKey.CanAccessFinal]: { 
        isComplete: session.user.progress[ProgressKey.CanAccessFinal],
        percentage: session.user.progress[ProgressKey.CanAccessFinal] ? 100 : 0
      }
    };
  }

  // Fallback to default
  return DEFAULT_DETAILED_PROGRESS;
};