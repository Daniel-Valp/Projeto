"use client";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
};

export const CustomNumberField = ({ name, label, placeholder }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-1">
      <label className="block font-medium">{label}</label>
      <input
        type="number"
        placeholder={placeholder}
        {...register(name, {
          valueAsNumber: true, // 👈 CONVERSÃO AUTOMÁTICA
        })}
        className="w-full p-2 border rounded"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">
          {(errors as any)[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};
