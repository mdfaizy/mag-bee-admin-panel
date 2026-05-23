"use client";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { createRole } from "@/services/authService";

import { roleSchema, RoleFormValues } from "@/validations/Schema";



export default function RoleCreate() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
  });
  const onSubmit = async (data: RoleFormValues) => {
    try {
      await dispatch(
        createRole({
          name: data.name,
          description: data.description,
          router,
        }) as any
      );
    } catch {
      toast.error("Failed to create role");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-8 mb-8">
        <h1 className="text-center font-semibold uppercase mb-6 text-lg">
          Create Role
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">

            {/* ROLE NAME */}
            <div>
              <Label>
                Name <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="Enter role name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <Label>
                Description <span className="text-error-500">*</span>
              </Label>
              <TextArea
                placeholder="Describe the role responsibilities"
                {...register("description")}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              // disabled={!isValid || isSubmitting}
              className={`
                  w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition cursor-pointer
                  ${
                // !isValid || isSubmitting
                // ? "bg-gray-400 cursor-not-allowed"
                "bg-brand-500 hover:bg-brand-600"
                }
                `}
            >
              {isSubmitting ? "Creating..." : "Create Role"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
