"use client";

import { useFormManagement } from "@/hooks/form-management";
import { ERROR_MESSAGES } from "@/types/api";
import { validateAcademicIdentity } from "@/utils/identity-extractor";
import ModernAlert from "@/utils/modern-alert";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { z } from "zod";
import { useLoading } from "../contexts/UnifiedContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type DynamicInput = {
  name: string;
  label: string;
  type: "text" | "select" | "email" | "password";
  placeholder?: string;
  options?: { value: string, label: string }[];
  validation?: z.ZodTypeAny
}

export default function Auth() {
  const router = useRouter();
  const pathname = usePathname();
  const isRegister = pathname === "/register";
  const { handleNavigate } = useLoading();

  const { formData, errors, updateField, validateForm, createFormDataFromState } = useFormManagement({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const dynamicInputs = useMemo<DynamicInput[]>(() => {
    const baseInpunts = [
      {
        name: "username",
        label: "Username",
        type: "text",
        placeholder: "Enter your username",
        validation: z.string()
          .nonempty("Username cannot be empty!")
          .refine(val => {
            const result = validateAcademicIdentity(val);
            console.log(result)
            return result.valid;
          }, "Username must be NIM or NIP!")
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        validation: z.string()
          .min(8, "Password at least 8 characters")
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must be strong!")
      }
    ] as DynamicInput[]
    return isRegister
      ? [
        ...baseInpunts,
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          placeholder: "••••••••",
          validation: z.string().nonempty("Confrim password cannot be empty!")
        }
      ]
      : baseInpunts;
  }, [isRegister]);

  const renderInputs = () => {
    return dynamicInputs.map((input) => {
      switch (input.type) {
        case "text":
        case "password":
        case "email":
          return (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              key={input.name}
              className="space-y-2"
            >
              <Label>
                {input.label}
                <span className="text-red-500 font-extrabold">
                  *{errors[input.name] ? errors[input.name] : ""}
                </span>

              </Label>
              <Input
                type={input.type}
                value={formData[input.name] as string}
                placeholder={input.placeholder}
                onChange={(e) => updateField(input.name, e.target.value)}
                className="bg-white/20 border-white/20 text-white placeholder:text-white/50 w-full"
              />
            </motion.div>
          );
        case "select":
          if (!input.options) return <>Options not defined</>;

          return (
            <motion.div
              className="space-y-2 flex flex-col w-full"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              key={input.name}
            >
              <Label className="text-white">
                {input.label}
                <span className="text-red-500 font-extrabold">
                  *{errors[input.name] ? errors[input.name] : ""}
                </span>
              </Label>
              <Select
                value={formData[input.name] as string || ""}
                onValueChange={(e) => updateField(input.name, e)}
              >
                <SelectTrigger className="bg-white/20 border-white/20 text-white w-full">
                  <SelectValue placeholder={input.placeholder || "Please select"} />
                </SelectTrigger>
                <SelectContent position="popper">
                  {input.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          );
        default:
          return <>Type not support</>;
      }
    });
  }

  const validationSchema = useMemo(() => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    dynamicInputs.forEach((input) => {
      schemaFields[input.name] = input.validation || z.string();
    });

    return z.object(schemaFields);
  }, [dynamicInputs]);

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(validationSchema, isRegister)) return;

    if (isRegister) {
      try {
        // Create FormData object
      const formDataObj = createFormDataFromState();
        const response = await fetch("/api/auth/register", {
          method: "POST",
          body: formDataObj
        });

        const result = await response.json();

        if (result.ok) {
          const allertResult = await ModernAlert.success({
            description: result.message,
            allowOutsideClick: false,
          });

          if (allertResult.isConfirmed) {
            router.push("/login");
          }
        } else {
          ModernAlert.error({
            description: result.message,
            allowOutsideClick: false,
          });
        }
      } catch (error) {
        console.log(error);
        ModernAlert.error({
          title: "Something when wrong",
          description: error as string,
          allowOutsideClick: false
        });
      }
    } else {
      try {
        const result = await signIn("credentials", {
          username: formData.username,
          password: formData.password,
          redirect: false
        });

        if (!result) {
          ModernAlert.error({
            title: ERROR_MESSAGES.SOMETHING_WRONG,
            description: "Please try again a moment🧠.....",
            allowOutsideClick: false
          });
          return;
        }

        if (result.error && result.code) {
          ModernAlert.error({
            title: "LogIn Vaild!",
            description: result?.code,
            allowOutsideClick: false
          });
          return;
        }
        
        router.push("/");
        return;
      } catch (error) {
        ModernAlert.error({
          title: ERROR_MESSAGES.SOMETHING_WRONG,
          description: "Please try again a moment🧠.....",
          allowOutsideClick: false
        });
      }
    }

  }

  const cubes = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 80,
    duration: 15 + Math.random() * 30,
    delay: Math.random() * 5
  }));


  return (
    <div className="w-full min-h-screen bg-linear-to-br/oklch from-black to-purple-950 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      {cubes.map((cube) => (
        <motion.div
          key={cube.id}
          className="absolute rounded-2xl bg-white/25 backdrop-blur-sm"
          style={{
            width: cube.size,
            height: cube.size
          }}
          animate={{
            x: [`${cube.x}vw`, `${(cube.x + 20) % 100}vw`, `${cube.x}vw`],
            y: [`${cube.y}vh`, `${(cube.y + 30) % 100}vh`, `${cube.y}vh`],
            rotate: [0, 180, 360],
            opacity: [1, 0.8, 0.5],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: cube.duration,
            delay: cube.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Main content container */}
      <div className="container max-w-5xl mx-auto px-4 z-10 flex flex-col items-center md:flex-row">
        <motion.div
          className="bg-white/10 shadow-xl backdrop-blur-xl text-white  rounded-2xl p-8 mb-10 md:mb-0 sm:w-md lg:w-xl"
        >
          <div className="">
            <motion.h1
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isRegister ? "Create Account" : "Welcome Back"}
            </motion.h1>
            <motion.p
              className="text-white/80 font-montserrat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {isRegister
                ? "Join our academic management system"
                : "Sign in to access your account"
              }
            </motion.p>
          </div>
          <form onSubmit={async (e) => await handelSubmit(e)} className="space-y-6">
            <AnimatePresence mode="sync">
              {renderInputs()}
            </AnimatePresence>
            <Button
              type="submit"
              className="w-full bg-white text-indigo-600 hover:bg-white/90"
            >
              {isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 text-center text-white/80">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <Link href="/login" onClick={() => handleNavigate("/login")} className="text-white font-medium underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <Link href="/register" onClick={() => handleNavigate("/register")} className="text-white font-medium underline underline-offset-2">
                  Create account
                </Link>
              </p>
            )}
          </div>
        </motion.div>
        <motion.div
          className="w-full md:w-1/2 md:pl-10 hidden md:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative h-[400px] w-full"
            initial={{ y: 20 }}
            animate={{ y: [20, -20, 20] }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          >
            <Image
              src={isRegister
                ? "/assets/img/student.png"
                : "/assets/img/student.png"
              }
              alt={isRegister ? "Register illustration" : "Login illustration"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </motion.div>

          <motion.div
            className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-white mb-2">
              {isRegister ? "Join Our Academic Community" : "Access Your Academic Portal"}
            </h3>
            <p className="text-white/80 font-montserrat">
              {isRegister
                ? "Create an account to manage your academic journey from proposal to final defense seamlessly."
                : "Sign in to track your progress, submit papers, and connect with supervisors."}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}