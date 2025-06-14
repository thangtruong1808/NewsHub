"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "../userSchema";

interface NameFieldsProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
}

export default function NameFields({ register, errors }: NameFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="firstname" className="block text-sm font-medium">
          First Name <span className="text-xs">(*)</span>
        </label>
        <input
          type="text"
          id="firstname"
          {...register("firstname")}
          placeholder="Enter first name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
        />
        {errors.firstname && (
          <p className="mt-1 text-sm text-red-600">
            {errors.firstname.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lastname" className="block text-sm font-medium">
          Last Name <span className="text-xs">(*)</span>
        </label>
        <input
          type="text"
          id="lastname"
          {...register("lastname")}
          placeholder="Enter last name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
        />
        {errors.lastname && (
          <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>
        )}
      </div>
    </>
  );
}
