/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        regular: ['Lato-Regular'],
        bold: ['Lato-Bold'],
        black: ['Lato-Black'],
        italic: ['Lato-Italic'],
        light: ['Lato-Light'],
      },
      colors: {
        screen: '#FCFCFC',
        primary: '#326FD1',
        text: '#37565E',
        gray: '#808080',
        error: '#DC2626', // Red for errors
        success: '#059669', // Green for success
        warning: '#D97706', // Amber for warnings
        info: '#2563EB', // Blue for info
        'text-dark': '#04262F',
        'text-light': '#6D8287',
        'light-green': '#E7FCFF',
        'light-blue': 'rgba(50, 111, 209, 0.10)',
        'light-gray': '#E0E0E0',
        'light-red': '#FF6B6B',
        'light-pink': '#EBE3FC',
        'light-border': 'rgba(205, 213, 215, 0.56)',
        'white-pure': '#ffffff',
        'black-pure': '#000000',
        'gray-pure': '#C4C3C9',
        'ghost-white': '#F8F9FA',
        'medium-black': '#333333',
        'slate-gray': '#586069',
        'dark-red': '#CC3300',
        'gray-color': '#757575',
        'star-gold': '#FFD700',
        'star-gray': '#CCCCCC',
        'lighter-gray': '#C2C2C2',
        disabled: '#3B82F6',
        loading: '#F8FAFC',
      },
      zIndex: {
        999: '999',
        max: '9999',
        modal: '1000',
        dropdown: '500',
        tooltip: '400',
      },
    },
  },
  plugins: [
    function ({addUtilities}) {
      const newUtilities = {
        '.text-top': {
          textAlignVertical: 'top',
        },
      };
      addUtilities(newUtilities, ['responsive']);
    },
    function ({addUtilities}) {
      const newUtilities = {
        '.elevation-1': {elevation: 1},
        '.elevation-2': {elevation: 2},
        '.elevation-4': {elevation: 4},
        '.elevation-8': {elevation: 8},
        '.elevation-12': {elevation: 12},
        '.elevation-16': {elevation: 16},
        '.elevation-24': {elevation: 24},
        '.z-999': {zIndex: 999},
      };
      addUtilities(newUtilities);
    },
  ],
  corePlugins: {
    ...require('tailwind-rn/unsupported-core-plugins'),
    margin: true,
    marginLeft: true,
    marginRight: true,
    marginTop: true,
    marginBottom: true,
    space: true,
  },
};
