"use client"
import Image from 'next/image';
import { ImageCards } from './ImageCards';
import { useRouter } from 'next/navigation';

const valueCards = [
  {
    title: "Everybody is leader",
    description: "Every individual has the potential to lead and make an impact",
    imageSrc: "/leader.svg",
    alt: "People climbing stairs illustration"
  },
  {
    title: "Beginner's Mind",
    description: "Approaching challenges with curiosity and openness to learn",
    imageSrc: "/brain.svg",
    alt: "Brain silhouette illustration"
  },
  {
    title: "Belief creates magic",
    description: "Faith in possibilities leads to extraordinary outcomes",
    imageSrc: "/belef.svg",
    alt: "Sparkly face profile illustration"
  }
];

export function MissionSection() {
  const router = useRouter();

  const handleTradeNowClick = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[1259px] sm:space-y-12 aa:space-x-3 sm:mt-8 aa:mt-1">
      <Image
        src="/note.svg"
        alt="Mission visual representation"
        width={849}
        height={389}
        className="object-contain rounded-3xl"
      />
      
      <div className="sm:space-y-4 aa:space-y-1 aa:my-4 text-center">
        <h1 className="xl:text-5xl sm:text-4xl tracking-tight">We're on a mission to create</h1>
        <p className="xl:text-6xl sm:text-4xl font-bold tracking-tight">'a marketplace for everyone'</p>
      </div>
      
      <section className="w-full sm:space-y-8 aa:space-x-2">
        <h2 className="sm:text-4xl aa:text-lg aa:font-bold sm:font-semibold text-neutral-700">Our Mission</h2>
        
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-[70%] max-md:w-full">
            <p className="xl:text-2xl sm:text-xl aa:text-sm font-semibold xl:leading-[50px] sm:leading-[30px] text-neutral-400 sm:mt-4 md:mt-10 aa:mt-2">
              At Anumaan, we are and will always be an equal opportunity
              platform. We unite diverse creators with unique skills,
              perspectives, and ideas, empowering them with the support they
              need to thrive and make a meaningful impact on the world.
            </p>
          </div>
          
          <div className="w-[60%] max-md:w-full">
            <img
              src="/mission.svg"
              alt="Visual representation of our mission"
              className="w-full xl:h-[350px] rounded-[29px] sm:h-[275px] aa:h-[175px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-8">
        <h2 className="sm:text-4xl aa:text-lg aa:font-bold sm:font-semibold text-neutral-700">Our Values</h2>
        <ImageCards cards={valueCards} />
      </section>

      <section className="w-full bg-neutral-800 rounded-xl sm:py-16 aa:py-4 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white sm:text-2xl aa:text-base font-medium leading-relaxed mb-8">
            "What value or impact will your opinions bring to drive progress and inspire change?"
          </p>
          
          <button 
            onClick={handleTradeNowClick}
            className="inline-flex items-center sm:px-6 sm:py-3 aa:px-4 aa:py-2 bg-gray-200 rounded-full text-neutral-800 font-medium hover:bg-gray-300 transition-colors"
          >
            Trade Now
            <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
} 