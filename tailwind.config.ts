import type { Config } from 'tailwindcss';

const config: Config = {
   content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   theme: {
      colors: {
         purple: '#5D1EC2',
         lightPurple: '#F2EBFF',
         grey: '#8D8896',
         lightGrey: '#EAEAEC',
         lighterGrey: '#F4F5F8',
         lightestGrey: '#F1F1F4',
         lightGreyBorder: '#DFDDE3',
         yellow: '#FFFBDB',
         darkYellow: '#A37A00',
         green: '#00A600',
         lightGreen: '#E7FFFB',
         aqua: '#008970',
         lightAqua: '#1BE9C4',
         black: '#000',
         white: '#fff',
         red: '#DC0000',
         pink: '#FFE4E4',
         transparent: '#00000000',
      },
      screens: {
         '4xl': '1600px',
         '3xl': { max: '1535px' },

         '2xl': { max: '1400px' },
         xl: { max: '1279px' },

         lg: { max: '1023px' },

         md: { max: '767px' },

         sm: { max: '639px' },
         xs: { max: '575px' },
         dxs: { max: '500px' },
         '2xs': { max: '400px' },
      },
      extend: {
         backgroundImage: {
            'custom-gradient':
               'linear-gradient(180deg, #915BE9 0%, #38048B 100%)',
         },
         boxShadow: {
            custom: '0px 12px 16px 0px rgba(0, 0, 0, 0.10)',
         },
      },
   },
   plugins: [],
};
export default config;
