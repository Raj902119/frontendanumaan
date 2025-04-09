import { InputFieldProps } from "./types";

export const InputField = ({ label, type = "text", id }: InputFieldProps) => (
  <div className="flex flex-col w-[446px] min-w-[240px]">
    <label htmlFor={id} className="pl-2 aa:text-base sm:text-xl font-medium">{label}</label>
    <input
      type={type}
      id={id}
      className="aa:h-[30px] sm:h-[59px] bg-white rounded-md border border-zinc-300"
      aria-label={label}
    />
  </div>
);
