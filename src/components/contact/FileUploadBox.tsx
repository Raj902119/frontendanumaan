import { FileUploadProps } from "./types";

export const FileUploadBox = ({ icon, title, subtitle }: FileUploadProps) => (
  <div className="flex flex-col items-center justify-center w-full h-[180px] bg-white rounded-xl border border-zinc-300 text-neutral-700">
    <div className="flex flex-col items-center w-[190px]">
      <img src={icon} alt="" className="w-6 aspect-square" />
      <div className="mt-2.5 aa:text-base sm:text-xl font-medium">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs">{subtitle}</div>
      )}
    </div>
  </div>
);