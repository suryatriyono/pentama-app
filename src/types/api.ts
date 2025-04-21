import { Progress, ProgressWithPercentage } from "./user";

// Base API Response Type
type ApiRespone<T = any> = {
  ok: boolean;
  message: string;
  data?: T;
  progress?: Progress;
  detailedProgress?: ProgressWithPercentage;
  successType?: SuccessType;
  errorType?: ErrorType;
  error?: string;
};

// ======= SUCCESS TYPES & MESSAGES ========
export enum SuccessType {
  // General success types
  RETRIEVED = "RETRIEVED",
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",

  // Auth specific success types
  AUTH_LOGIN = "AUTH_LOGIN",
  AUTH_LOGOUT = "AUTH_LOGOUT",
  AUTH_REGISTER = "AUTH_REGISTER",
  AUTH_PASSWORD_RESET = "AUTH_PASSWORD_RESET",

  USER_PROFILE_CREATED = "USER_PROFILE_CREATED",

  // Student specific success types
  STUDENT_PROFILE_CREATED = "STUDENT_PROFILE_CREATED",
  STUDENT_PROFILE_UPDATED = "STUDENT_PROFILE_UPDATED",
  STUDENT_PROFILE_RETRIEVED = "STUDENT_PROFILE_RETRIEVED",

  // Thesis specific success types
  THESIS_SUBMITTED = "THESIS_SUBMITTED",
  THESIS_APPROVED = "THESIS_APPROVED",
  THESIS_STAGE_ADVANCED = "THESIS_STAGE_ADVANCED",

  // File handling success types
  FILE_UPLOADED = "FILE_UPLOADED",
  FILE_DOWNLOADED = "FILE_DOWNLOADED",
}

// Success message by domain
export const AUTH_SUCCESS_MESSAGES: Record<Extract<SuccessType
  , SuccessType.AUTH_LOGIN |
  SuccessType.AUTH_LOGOUT |
  SuccessType.AUTH_REGISTER |
  SuccessType.AUTH_PASSWORD_RESET
>, string> = {
  [SuccessType.AUTH_LOGIN]: "Login berhasil",
  [SuccessType.AUTH_LOGOUT]: "Logout berhasil",
  [SuccessType.AUTH_REGISTER]: "Pendaftaran berhasil",
  [SuccessType.AUTH_PASSWORD_RESET]: "Reset password berhasil",
};

export const STUDENT_SUCCESS_MESSAGES: Record<Extract<SuccessType,
  SuccessType.STUDENT_PROFILE_CREATED |
  SuccessType.STUDENT_PROFILE_UPDATED |
  SuccessType.STUDENT_PROFILE_RETRIEVED>, string> = {
  [SuccessType.STUDENT_PROFILE_CREATED]: "Student profile created successfully",
  [SuccessType.STUDENT_PROFILE_UPDATED]: "Student profile updated successfully",
  [SuccessType.STUDENT_PROFILE_RETRIEVED]: "Student profile retrieved successfully"
};

export const USER_SUCCESS_MESSAGES: Record<Extract<SuccessType,
  SuccessType.USER_PROFILE_CREATED>, string> = {
  [SuccessType.USER_PROFILE_CREATED]: "User Profile created successfully"
};

export const THESIS_SUCCESS_MESSAGES: Record<Extract<SuccessType,
  SuccessType.THESIS_SUBMITTED |
  SuccessType.THESIS_APPROVED |
  SuccessType.THESIS_STAGE_ADVANCED>, string> = {
  [SuccessType.THESIS_SUBMITTED]: "Thesis submitted successfully",
  [SuccessType.THESIS_APPROVED]: "Thesis approved successfully",
  [SuccessType.THESIS_STAGE_ADVANCED]: "Thesis advanced to next stage successfully"
};

export const FILE_SUCCESS_MESSAGES: Record<Extract<SuccessType,
  SuccessType.FILE_UPLOADED |
  SuccessType.FILE_DOWNLOADED>, string> = {
  [SuccessType.FILE_UPLOADED]: "File uploaded successfully",
  [SuccessType.FILE_DOWNLOADED]: "File downloaded successfully"
};

export const GENERAL_SUCCESS_MESSAGES: Record<Extract<SuccessType,
  SuccessType.RETRIEVED |
  SuccessType.CREATED |
  SuccessType.UPDATED |
  SuccessType.DELETED>, string> = {
  [SuccessType.RETRIEVED]: "Data retrieved successfully",
  [SuccessType.CREATED]: "Data created successfully",
  [SuccessType.UPDATED]: "Data updated successfully",
  [SuccessType.DELETED]: "Data deleted successfully"
};

// Combine all success messages
export const SUCCESS_MESSAGES: Record<SuccessType, string> = {
  ...GENERAL_SUCCESS_MESSAGES,
  ...AUTH_SUCCESS_MESSAGES,
  ...USER_SUCCESS_MESSAGES,
  ...STUDENT_SUCCESS_MESSAGES,
  ...THESIS_SUCCESS_MESSAGES,
  ...FILE_SUCCESS_MESSAGES
};

// ======= ERROR TYPES & MESSAGES =======

export enum ErrorType {
  // Auth errors
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  INVALID_DATA = "INVALID_DATA",
  PASSWORD_MISMATCH = "PASSWORD_MISMATCH",
  USER_EXISTS = "USER_EXISTS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",

  // Student errors
  PROFILE_INCOMPLETE = "PROFILE_INCOMPLETE",
  PROFILE_COMPLETE = "PROFILE_COMPLETE",
  THESIS_NOT_FOUND = "THESIS_NOT_FOUND",
  INVALID_STAGE_TRANSITION = "INVALID_STAGE_TRANSITION",
  PREREQUISITE_NOT_MET = "PREREQUISITE_NOT_MET",

  // File errors
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  FILE_UPLOAD_FAILED = "FILE_UPLOAD_FAILED",

  // Shared errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND",
  SOMETHING_WRONG = "SOMETHING_WRONG",

  DATABASE_ERROR = "DATABASE_ERROR"
}

export const AUTH_ERROR_MESSAGES: Record<Extract<ErrorType,
  ErrorType.INVALID_CREDENTIALS |
  ErrorType.INVALID_DATA |
  ErrorType.PASSWORD_MISMATCH |
  ErrorType.USER_EXISTS |
  ErrorType.USER_NOT_FOUND |
  ErrorType.UNAUTHORIZED>, string> = {
  [ErrorType.INVALID_CREDENTIALS]: "Invalid credentials",
  [ErrorType.PASSWORD_MISMATCH]: "Password mismatch",
  [ErrorType.USER_EXISTS]: "User already exists",
  [ErrorType.USER_NOT_FOUND]: "User not found",
  [ErrorType.UNAUTHORIZED]: "You are not authorized",
  [ErrorType.INVALID_DATA]: "Invalid data"
};

export const STUDENT_ERROR_MESSAGES: Record<Extract<ErrorType,
  ErrorType.PROFILE_INCOMPLETE |
  ErrorType.PROFILE_COMPLETE |
  ErrorType.THESIS_NOT_FOUND |
  ErrorType.INVALID_STAGE_TRANSITION |
  ErrorType.PREREQUISITE_NOT_MET>, string> = {
  [ErrorType.PROFILE_INCOMPLETE]: "Student profile is incomplete",
  [ErrorType.PROFILE_COMPLETE]: "Profile already exists. Use PUT to update.",
  [ErrorType.THESIS_NOT_FOUND]: "Thesis data not found",
  [ErrorType.INVALID_STAGE_TRANSITION]: "Invalid stage transition",
  [ErrorType.PREREQUISITE_NOT_MET]: "Prerequisites not met for this operation"
};

export const FILE_ERROR_MESSAGES: Record<Extract<ErrorType,
  ErrorType.FILE_TOO_LARGE |
  ErrorType.INVALID_FILE_TYPE |
  ErrorType.FILE_UPLOAD_FAILED>, string> = {
  [ErrorType.FILE_TOO_LARGE]: "File size exceeds maximum allowed limit",
  [ErrorType.INVALID_FILE_TYPE]: "Invalid file type",
  [ErrorType.FILE_UPLOAD_FAILED]: "Failed to upload file"
};

export const GENERAL_ERROR_MESSAGES: Record<Extract<ErrorType,
  ErrorType.VALIDATION_ERROR |
  ErrorType.SERVER_ERROR |
  ErrorType.NOT_FOUND |
  ErrorType.DATABASE_ERROR |
  ErrorType.SOMETHING_WRONG>, string> = {
  [ErrorType.VALIDATION_ERROR]: "Validation error",
  [ErrorType.SERVER_ERROR]: "Internal server error",
  [ErrorType.NOT_FOUND]: "Data not found",
  [ErrorType.DATABASE_ERROR]: "Database error",
  [ErrorType.SOMETHING_WRONG]: "Something went wrong"
};

// Combine all error messages
export const ERROR_MESSAGES: Record<ErrorType, string> = {
  ...AUTH_ERROR_MESSAGES,
  ...STUDENT_ERROR_MESSAGES,
  ...FILE_ERROR_MESSAGES,
  ...GENERAL_ERROR_MESSAGES
};

// ======= API RESPONSE FUNCTIONS =======

// function to create success response
export function createSuccessResponse<T>({
  message,
  data,
  progress,
  detailedProgress,
  successType
}: {
  message?: string;
  data?: T;
  progress?: Progress;
  detailedProgress?: ProgressWithPercentage;
  successType: SuccessType;
}): ApiRespone<T> {
  return {
    ok: true,
    message: message || SUCCESS_MESSAGES[successType],
    data,
    progress,
    detailedProgress,
    successType
  }
}

// function to create error response
export function createErrorResponse({
  message,
  data,
  errorType
}: {
  message?: string;
  data?: any;
  errorType: ErrorType;
}): ApiRespone {
  return {
    ok: false,
    message: message || ERROR_MESSAGES[errorType],
    error: ERROR_MESSAGES[errorType],
    data,
    errorType
  }
}

// unified function that can create both success and error responses
export function createApiResponse<T>({
  ok,
  message,
  data,
  successType,
  errorType
}: {
  ok: boolean;
  message?: string;
  data?: T;
  successType?: SuccessType;
  errorType?: ErrorType;
}): ApiRespone<T> {
  if (ok) {
    return createSuccessResponse({
      message,
      data,
      successType: successType || SuccessType.RETRIEVED
    });
  } else {
    return createErrorResponse({
      message,
      data,
      errorType: errorType || ErrorType.SERVER_ERROR
    });
  }
}