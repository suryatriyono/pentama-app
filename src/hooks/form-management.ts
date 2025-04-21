"use client";
import { useUnified } from "@/components/contexts/UnifiedContext";
import { useCallback, useReducer } from "react";
import { ZodError, ZodObject } from "zod";

export type FormValue = string | File | null;
type FormData = Record<string, FormValue>;
type FilePreview = Record<string, string>;


// Action type for Reducer
type FormAction =
  | { type: "UPDATE_FIELD"; name: string; value: FormValue }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "CLEAR_ERRORS"; field?: string }
  | { type: "RESET_FORM" }
  | { type: "SET_FILE_PREVIEW"; name: string; preview: string };

type FormState = {
  initialData: FormData;
  formData: FormData;
  errors: Record<string, string>;
  filePreviews: FilePreview;
}
const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      reject(new Error("Not an image file"))
    }
  })
}

// Reducer function
const formReducer = (
  state: FormState,
  action: FormAction
): FormState => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.name]: action.value
        }
      };
    case "SET_FILE_PREVIEW":
      return {
        ...state,
        filePreviews: {
          ...state.filePreviews,
          [action.name]: action.preview
        }
      }
    case "SET_ERRORS":
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.errors
        }
      }
    case "CLEAR_ERRORS":
      if (action.field) {
        const { [action.field]: _, ...remainingErrors } = state.errors;
        return { ...state, errors: remainingErrors };
      }

      return { ...state, errors: {} };
    case "RESET_FORM":
      return {
        ...state,
        formData: {...state.initialData},
        errors: {},
        filePreviews: {}
      };
    default:
      return state;
  }
};

export const useFormManagement = (initialData: FormData = {}) => {
  const { user } = useUnified();
  const [state, dispatch] = useReducer(formReducer, {
    initialData: {...initialData},
    formData: {...initialData},
    filePreviews: {},
    errors: {}
  });

  const handleFilePreview = useCallback((name: string, value: File) => {
    createFilePreview(value)
      .then(preview => {
        dispatch({
          type: "SET_FILE_PREVIEW",
          name,
          preview
        });
      })
  }, []);

  const updateField = useCallback((name: string, value: FormValue) => {
    dispatch({
      type: "UPDATE_FIELD",
      name,
      value
    });

    // Remove error for updated filed
    dispatch({
      type: "CLEAR_ERRORS",
      field: name
    });

    // Handle file preview if nedded
    if (value instanceof File && value.type.startsWith("image/")) {
      handleFilePreview(name, value);
    } else if(value === null || value === "") {
      // If the value is deleted, delete the preview
      dispatch({
        type: "SET_FILE_PREVIEW",
        name,
        preview: ""
      });
    }
  }, [handleFilePreview]);

  const validatePasswordMatch = useCallback(() => {
    const { password, confirmPassword } = state.formData;

    const isPasswodMismatch =
      typeof password === "string" &&
      typeof confirmPassword === "string" &&
      password &&
      confirmPassword &&
      password !== confirmPassword;

    if (isPasswodMismatch) {
      dispatch({
        type: "SET_ERRORS",
        errors: {
          confirmPassword: "Password Mismacth!"
        }
      });
      return false;
    }
    return true;
  }, [state.formData]);

  const validateForm = useCallback((
    schema: ZodObject<any>,
    validatePassword: boolean = false
  ) => {
    try {

      // Validate Zod schema
      schema.parse(state.formData);

      if (validatePassword && !validatePasswordMatch()) {
        return false;
      }

      // Clear all erros if validation successfully
      dispatch({ type: "CLEAR_ERRORS" });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMap = error.flatten().fieldErrors;
        const formattedErrors: Record<string, string> = {};

        Object.entries(errorMap).forEach(([name, errMsgs]) => {
          if (errMsgs && errMsgs.length > 0) {
            formattedErrors[name] = errMsgs[0];
          }
        });

        // Set error from validation
        dispatch({
          type: "SET_ERRORS",
          errors: formattedErrors
        })
      }
    }
  }, [state.formData, validatePasswordMatch]);

  // Halper function to get data form user data or from data
  const getFormData = useCallback((
    key: string,
    options?: {
      priority?: "user" | "form",
      source?: "user" | "form" | "both",
      defaultValue?: string
    }
  ) => {
    // Extract options with defaults
    const {
      priority = "user",
      source = "both",
      defaultValue = ""
    } = options || {};

    // Helper function to safety type
    const safeGetValue = (obj: any, key: string): string | null => {
      if (!obj || typeof obj !== "object") {
        return null;
      }

      // Check if key is undefined or null 
      if (key === undefined || key === null) {
        return null;
      }

      // Handle dot nitatuib for nested properties
      const keys = key.split(".");
      let current = obj;

      // Traverse the object following the keys
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (current === null || current === undefined || typeof current !== "object" || !(key in current)) {
          return null;
        }

        current = current[key];

        // If we've reached the end of our keys
        if (i === keys.length - 1) {
          return current !== null && current !== undefined ? String(current) : null;
        }
      }

      if (obj && typeof obj === "object" && key in obj) {
        const value = obj[key];
        return value !== null && value !== undefined ? String(value) : null;
      }

      return null
    }

    // Define the data sources to check based on priority and source
    const checkUserFirst = priority === "form";
    const firstSource = checkUserFirst ? user.data : state.formData;
    const secondSource = checkUserFirst ? state.formData : user.data;

    // Check sources base on configuration
    if (source === "both" || source === (checkUserFirst ? "user" : "form")) {
      const valueFromFirst = safeGetValue(firstSource, key);
      if (valueFromFirst !== null && valueFromFirst.trim() !== "") return valueFromFirst;
    }

    if (source === "both" || source === (checkUserFirst ? "form" : "user")) {
      const valueFromSecond = safeGetValue(secondSource, key);
      if (valueFromSecond !== null && valueFromSecond.trim() !== "") return valueFromSecond;
    }
    // Default fallback
    return defaultValue;
  }, [user.data, state.formData]);


  // Convert formData state to FormData object for API requests
  const createFormDataFromState = useCallback(() => {
    const formDataObj = new FormData();
    Object.entries(state.formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataObj.append(key, value);
      }
    });
    return formDataObj;
  }, [state.formData]);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" })
  }, []);

  return {
    formData: state.formData,
    errors: state.errors,
    filePreviews: state.filePreviews,
    updateField,
    validateForm,
    resetForm,
    getFormData,
    createFormDataFromState
  }
};
