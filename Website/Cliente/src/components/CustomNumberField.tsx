"use client";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  inputClassName?: string;
  style?: React.CSSProperties;
};

export const CustomNumberField = ({
  name,
  label,
  placeholder,
  inputClassName,
  style,
}: Props) => {
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
          valueAsNumber: true,
        })}
        className={`w-full p-2 border rounded ${inputClassName || ""}`}
        style={style}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">
          {(errors as any)[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};
