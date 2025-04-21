"use client";
import { FormValue, useFormManagement } from "@/hooks/form-management";
import { useProgressUpdater } from "@/lib/progressUpdater";
import { getUserScheme } from "@/lib/validations";
import { LecturerData, ProgressKey, whoYouAre } from "@/types/user";
import ModernAlert from "@/utils/modern-alert";
import { Expertise, Gender, Position } from "@prisma/client";
import { motion, Variants } from "framer-motion";
import { BookIcon, BookOpen, Building2Icon, Edit, Feather, GraduationCapIcon, Save, School2Icon, Upload, User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { FaUserGraduate } from "react-icons/fa6";
import { GiShieldOpposition } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { useUnified } from "./contexts/UnifiedContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { GlassmorphismButton, LevitatingNeonButton } from "./ui/pentama-button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

type ProfileInfo = {
  key: string;
  label: string;
  value: string;
  icon: React.ReactNode;
};

type FormField = {
  type: "text" | "email" | "password" | "select";
  icon: React.ReactNode;
  name: string;
  label: string;
  value: string;
  updateField: (name: string, value: FormValue) => void;
  errors: Record<string, string>;
  placeholder?: string;
  readOnly?: boolean;
  options?: { value: string, label: string, hidden?: boolean }[];
}

// From filed component
const FormField = (
  {
    type,
    name,
    label,
    icon,
    value,
    options,
    placeholder,
    readOnly,
    updateField,
    errors
  }: FormField
) => {
  switch (type) {
    case "text":
    case "email":
    case "password":
      return (
        <div key={name} className="py-2.5 space-y-1">
          <Label htmlFor={name} className={`text-sm font-medium ${errors[`${name}`] ? "text-red-500" : "text-indigo-50"}`}>
            {label}
            <span className={`font-extrabold ${value ? "text-green-500" : "text-red-500"}`}>
              *{errors[`${name}`] || ""}
            </span>
          </Label>
          <div className="relative">
            {icon && (
              <div className="absolute left-3 top-3 text-indigo-50 ">
                {icon}
              </div>
            )}
            <Input
              id={name}
              name={name}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={(e) => updateField(name, e.target.value)}
              readOnly={readOnly}
              className={`${icon ? "pl-10 flex-initial" : ""} ${readOnly ? "border-purple-600 cursor-not-allowed" : "border-purple-400"} text-white placeholder:text-white `}
            />
          </div>
        </div>
      );
    case "select": {
      if (!options) {
        return <>Options Not Found</>
      }

      return (
        <div key={name} className="space-y-1 py-2.5 w-full">
          <Label htmlFor={name} className={`text-sm font-medium ${errors[`${name}`] ? "text-red-500" : "text-indigo-50"}`}>
            {label}
            <span className={`font-extrabold ${value && !errors[`${name}`] ? "text-green-500" : "text-red-500"}`}>
              *{errors[`${name}`] || ""}
            </span>
          </Label>
          <div className="relative">
            {icon && (
              <div className="absolute left-3 top-3 text-indigo-50 ">
                {icon}
              </div>
            )}
            <Select
              key={name}
              name={name}
              disabled={readOnly}
              value={value}
              defaultValue={value}
              onValueChange={(e) => updateField(name, e)}
            >
              <SelectTrigger className={
                `w-full text-white 
                ${icon ? "pl-10" : ""} 
                ${readOnly ? "border-purple-600" : "border-purple-400"}`}
              >
                <SelectValue placeholder={placeholder || "Please select"} />
              </SelectTrigger>
              <SelectContent className="bg-purple-950/80 border-0 text-white">
                <SelectGroup>
                  <SelectLabel>{placeholder}</SelectLabel>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value} hidden={option.hidden}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div >
      );
    }
    default:
      <></>
  }
};


const ProfileComponent = () => {
  const [editMode, setEditMode] = useState(false);

  const { user } = useUnified();
  const { data: session } = useSession();
  const { updateSession } = useProgressUpdater();

  const profileForm = useMemo(() => {
    if (!user.data) return {};

    const baseForm = {
      name: user.data.name ?? ""
    }

    // Check who that user is?
    const whoUserIt = whoYouAre(user.data);
    switch (whoUserIt) {
      case "student": {
        return ({
          ...baseForm,
          gender: user.data.gender ?? ""
        });
      }
      case "lecturer":
      case "admin": {
        const data = user.data as LecturerData;
        return ({
          ...baseForm,
          position: data.lecturer?.position ?? "",
          expertise: data.lecturer?.expertise ?? "",
        });
      }
      default:
        return {};
    }
  }, [user.data]);

  const { filePreviews, formData, updateField, errors, validateForm, resetForm, getFormData, createFormDataFromState } = useFormManagement(profileForm);

  /**
   * Animation kofiguration
  */
  // Container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Item
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  /**
   * Halper function
  */
  // Halper function to create from field with cosisten structure
  const createField = (
    {
      type,
      name,
      label,
      icon,
      defaultKey,
      value,
      placeholder,
      readOnly,
      options,
    }: Pick<FormField, "type" | "name" | "label" | "icon" | "placeholder" | "options"> & {
      value?: string,
      readOnly?: boolean,
      defaultKey?: string
    },
  ): FormField => ({
    type,
    name,
    label,
    icon,
    value: value ?? getFormData(name, { defaultValue: defaultKey ? getFormData(defaultKey) : "" }),
    updateField,
    errors,
    placeholder,
    readOnly: readOnly ?? !editMode,
    options
  });

  const avatarSrc = useMemo<string>(() => {
    if (filePreviews.avatar) {
      return filePreviews.avatar;
    }


    if (user.data && user.data.avatarUrl) {
      return user.data.avatarUrl;
    }
    return "/assets/img/out.png"
  }, [filePreviews.avatar, user.data]);

  const toggleEditMode = () => {
    if (editMode) resetForm();
    setEditMode(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determine user type for vallidation
    const userType = whoYouAre(user.data);

    // Skip validation if userType is unknown
    if (!userType || !["student", "lecturer", "admin"].includes(userType)) {
      return;
    }

    // Get appropriate schema validation based on user type
    const isCompleteProfile = user.progress.completeProfile && user.detailedProgress[ProgressKey.CompleteProfile].isComplete;
    const validationSchema = getUserScheme(userType);
    const schema = !isCompleteProfile
      ? validationSchema
      : validationSchema.partial();


    // Run validation 
    if (!validateForm(schema)) {
      return;
    }

    // Submit the form data to the API
    try {
      // Get FormData object
      const formDataObj = createFormDataFromState();
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        body: formDataObj,
      });

      const result = await response.json();

      if (result.ok) {
        const allertResult = await ModernAlert.success({
          description: result.message,
          allowOutsideClick: false,
        });

        if (allertResult.isConfirmed) {
          await updateSession(result.progress, result.detailedProgress);
        }

      } else {
        ModernAlert.error({
          description: result.message,
          allowOutsideClick: false,
        });
      }

    } catch (error) {
      ModernAlert.error({
        title: "Something when wrong",
        description: error as string,
        allowOutsideClick: false
      });
    }
  };

  // Profile info configuration
  const profileInfo = useMemo<ProfileInfo[]>(() => {
    if (!session?.user) return [];

    switch (session.user.role) {
      case "STUDENT": {
        return ([
          {
            key: "faculty",
            icon: <Building2Icon size={18} color="white" />,
            label: "Faculty",
            value: getFormData("student.faculty")
          },
          {
            key: "educationLevel",
            icon: <GraduationCapIcon size={18} color="white" />,
            label: "Education Level",
            value: getFormData("student.educationLevel")
          },
          {
            key: "studyProgram",
            icon: <BookIcon size={18} color="white" />,
            label: "Study Program",
            value: getFormData("student.studyProgram")
          },
          {
            key: "batch",
            icon: <School2Icon size={18} color="white" />,
            label: "Batch",
            value: getFormData("student.batch")
          },
          {
            key: "researchField",
            icon: <BookOpen size={18} color="white" />,
            label: "Research Field",
            value: getFormData("student.researchField")
          }

        ]);
      }
      case "LECTURER": {
        return ([
          {
            key: "position",
            icon: <GiShieldOpposition size={18} color="white" />,
            label: "Position",
            value: getFormData("position", { defaultValue: getFormData("lecturer.position") })
          },
          {
            key: "expertise",
            icon: <BookOpen size={18} color="white" />,
            label: "Expertise",
            value: getFormData("expertise", { defaultValue: getFormData("lecturer.expertise") })
          },
          {
            key: "gender",
            icon: <Feather size={18} color="white" />,
            label: "Gender",
            value: getFormData("gender", { defaultValue: "UNKNOWN" })
          }
        ]);
      }
      default:
        return ([]);
    }

  }, [getFormData, formData]);

  // Form fields setup
  const formFields = useMemo<FormField[]>(() => {
    const baseFields = [
      createField({ type: "text", name: "name", label: "Full Name", icon: <User size={18} color="white" />, placeholder: "Enter your full name" }),
      createField({
        name: "gender", type: "select", label: "Gender", icon: <Feather size={18} color="white" />, placeholder: "Select your gender", options: [
          { value: Gender.MALE, label: "Male" },
          { value: Gender.FEMALE, label: "Female" },
          { value: Gender.UNKNOWN, label: "Unknown", hidden: true }
        ]
      }),
    ];

    switch (session?.user.role) {
      case "STUDENT": return (
        [
          createField({ name: "username", type: "text", label: "NIM", icon: <PiStudentBold size={18} color="white" />, placeholder: "Enter your NIM", readOnly: true }),
          ...baseFields,
        ] as FormField[]
      );
      case "LECTURER": return (
        [
          createField({ name: "username", type: "text", label: "NIP", icon: <FaUserGraduate size={18} color="white" />, placeholder: "Enter your NIP", readOnly: true }),
          baseFields[0],
          createField({
            name: "position", type: "select", label: "Position", icon: <GiShieldOpposition size={18} color="white" />, placeholder: "Select your position", options: [
              { value: Position.LEKTOR, label: "Lektor" },
              { value: Position.LEKTOR_KEPALA, label: "Lektor Kepala" },
              { value: Position.ASISTEN_AHLI, label: "Asisten Ahli" },
              { value: Position.PROFESOR, label: "Profesor" },
              { value: Position.UNKNOWN, label: "Unknown", hidden: true }
            ], defaultKey: "lecturer.position"
          }),
          createField({
            name: "expertise", type: "select", label: "Select your expertise", icon: <BookOpen size={18} color="white" />, placeholder: "Expertise", options: [
              { value: Expertise.AES, label: "Applied Enterprise System" },
              { value: Expertise.NIC, label: "Network and Infrastructure Computing" },
              { value: Expertise.UNKNOWN, label: "Unknown", hidden: true }
            ], defaultKey: "lecturer.expertise"
          })
        ]
      );
      default: return (
        [] as FormField[] // Return empty array for other roles
      );
    }
  }, [editMode, formData, errors]);

  /** 
  * Caculate and Rendering components
  */
  // Profile info
  const renderProfileInfo = useMemo(() => {
    return (
      profileInfo.map((info) => (
        <div className="flex items-start" key={info.key}>
          <div className="bg-linear-to-b/oklch from-indigo-600 to bg-purple-600/1 shadow-sm shadow-purple-600 inset-shadow-2xs inset-shadow-purple-600 text-primary rounded-full p-2 mr-3">
            {info.icon}
          </div>
          <div>
            <p className="rounded-full px-1.5 text-sm text-indigo-50 uppercase font-medium shadow-2xs shadow-purple-600">{info.label}</p>
            <p className="font-medium">{info.value}</p>
          </div>
        </div>
      ))
    );
  }, [profileInfo]);

  // Profile form
  const renderForm = useMemo(() => {
    return (
      <Card className="p-6 flex flex-1 bg-transparent border-none inset-shadow-2xs inset-shadow-purple-600 border-0 shadow-md shadow-purple-600 text-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}
          >
            <h3 className="text-lg font-semibold mb-4"></h3>
            <div className="grid grid-cols-1 gap-4">
              <form id="profile-form" onSubmit={async (e) => await handleSubmit(e)}>
                {formFields.map(field => (
                  <FormField
                    key={field.name}
                    {...field}
                  />
                ))}
              </form>
            </div>
          </motion.div>
        </motion.div>
      </Card>
    );
  }, [formFields]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl text-white font-bold tracking-tight">Profile</h1>
          <p className="text-indigo-50 md:mb-5">
            Manage your personal information and account settings
          </p>
        </div>
        {!editMode ? (
          <GlassmorphismButton
            type="button"
            icon={<Edit />}
            onClick={() => toggleEditMode()}
            className="mb-2.5"
          >
            Edit Profile
          </GlassmorphismButton>
        ) : (
          <div className="flex gap-2 md:mb-0 mb-5">
            <GlassmorphismButton
              icon={<X />}
              className="flex-1 md:flex-initial"
              onClick={() => toggleEditMode()}
            >
              Cancle
            </GlassmorphismButton>
            <LevitatingNeonButton
              form="profile-form"
              type="submit"
              icon={<Save />}
              color="dark_purple"
              className="flex-1 md:flex-initial"
            >
              Save
            </LevitatingNeonButton>
          </div>
        )}
      </div>
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Deatails profile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-none"
        >
          <Card className="p-6 bg-transparent text-white inset-shadow-2xs inset-shadow-purple-600 border-0 shadow-md shadow-purple-600">
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center mb-6"
            >
              <div className="relative h-25 w-25">
                <Avatar className="size-full bg-linear-to-t from-indigo-600 to bg-purple-600">
                  <AvatarImage
                    src={avatarSrc}
                    alt={"avatar"}
                    fetchPriority="high"
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
                {editMode && (
                  <>
                    <input
                      hidden
                      id="avatar"
                      type="file"
                      name="avatar"
                      accept="image/png"
                      onChange={(e) => updateField("avatar", e.target.files?.item(0) as File)}
                    />
                    <motion.label
                      htmlFor="avatar"
                      className="absolute cursor-pointer text-white font-extrabold -right-1.5 bottom-3 rounded-full h-max w-max px-1.5 py-1 bg-purple-800/65 flex items-center justify-center transform transition-all duration-300 inset-shadow-xs inset-shadow-purple-600 border-0 shadow-xs shadow-purple-600"
                    >
                      <motion.span
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`flex flex-initial overflow-hidden gap-1.5 ${errors.avatar ? "text-red-500" : "text-white"}`}
                      >
                        <Upload size={22} />
                        {errors.avatar || ""}
                      </motion.span>
                    </motion.label>
                  </>
                )}
              </div>
              <h2 className="text-xl font-semibold shadow-purple-600 shadow-2xs">{getFormData("name") || getFormData("username")}</h2>
              <p className="uppercase font-bold text-sm">{getFormData("name") ? getFormData("username") : session?.user.id}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-4">
              {renderProfileInfo}
            </motion.div>
          </Card>
        </motion.div>
        {/* Profile form */}
        <div className="flex-1">
          {renderForm}
        </div>
      </div>
    </div>
  )
}

export default ProfileComponent