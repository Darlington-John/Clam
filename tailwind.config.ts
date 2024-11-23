import type { Config } from 'tailwindcss';

const config: Config = {
   darkMode: 'class',
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
         dark: {
            purple: '#38048B',
            darkPurple: '#19181B',
            dimPurple: '#3A363F',
            grey: '#262429',
            lightGrey: '#514D56',
            lightPurple: '#D2B7FC',
            dimGrey: '#C6C2CC',
            darkYellow: '#473500',
            lightYellow: '#FFE273',
            lightGreen: '#6AF26A',
            red: '#520000',
            pink: '#FFC7C7',
         },
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
