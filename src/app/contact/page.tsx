import { InputField } from "../../components/contact/InputField";
import { FileUploadBox } from "../../components/contact/FileUploadBox";

const inputFields = [
  { label: "Your name", id: "name" },
  { label: "Email", id: "email", type: "email" },
  { label: "Subject", id: "subject" },
  { label: "Phone Number", id: "phone", type: "tel" },
  { label: "User ID", id: "userId" }
];

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center bg-slate-100 md:px-4 aa:px-2">
      <img
        src="/contact.svg"
        alt="Contact form header"
        className="mt-8 w-full max-w-[1279px] aspect-[3.77] aa:rounded-[5px] sm:rounded-[32px]"
      />
      
      <h1 className="aa:mt-2 sm:mt-7 aa:text-base sm:text-4xl font-extrabold text-neutral-700">
        Contact Us
      </h1>
      
      <p className="aa:mt-2 sm:mt-4 aa:w-[300px] sm:w-[641px] aa:text-xs sm:text-2xl text-center text-zinc-600">
        Reach out to us for any inquiries or support. We're here to help with all your needs!
      </p>
      
      <form className="flex flex-wrap aa:gap-4 sm:gap-8 justify-center aa:mt-2 sm:mt-7 w-full max-w-[1130px] aa:text-base sm:text-xl">
        {inputFields.map((field) => (
          <InputField key={field.id} {...field} />
        ))}
        
        <div className="md:mt-16 aa:mt-0 sm:mt-4 w-full max-w-[992px]">
          <div className="flex gap-5 max-md:flex-col">
            <div className="w-6/12 max-md:w-full">
              <button
                type="button"
                className="flex justify-center items-center w-full h-[180px] bg-white rounded-xl border border-zinc-300"
              >
                <div className="flex gap-2 w-[190px]">
                  <img
                    src="/takess.svg"
                    alt=""
                    className="w-6 aspect-square"
                  />
                  <span>Take Screenshot</span>
                </div>
              </button>
            </div>
            
            <div className="w-6/12 max-md:w-full">
              <FileUploadBox
                icon="/uploadfiles.svg"
                title="Upload files (max 6)"
                subtitle="Click to add or drag & drop files."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-4 aa:mt-4 aa:mb-4 mt-14 mb-14 w-1/2 max-w-[300px] text-xl md:max-w-[400px] md:text-2xl lg:max-w-[462px] lg:text-3xl text-white bg-black rounded-xl"
        >
          Send
        </button>
      </form>
    </div>
  );
}