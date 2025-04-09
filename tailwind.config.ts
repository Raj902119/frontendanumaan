import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['var(--font-kanit)'],
      },
    },
    screens: {
      'aa': '300px', // Custom breakpoint for very small screens
      'ab': '370px', // Custom breakpoint
      'ac': '420px', // Custom breakpoint
      'xs': '480px', // Extra small
      'sm': '640px', // Small
      'md': '778px', // Medium
      'lg': '1026px', // Large
      'xl': '1280px', // Extra-large
      '2xl': '1500px', // 2XL
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config;
