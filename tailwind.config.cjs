/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

// import plugin from 'tailwindcss/plugin'

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        '2xl': '1440px',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        rainbow:
          'linear-gradient(-45deg,#84cc16,#10b981,#06b6d4,#6366f1,#a855f7,#ec4899,#f43f5e)',
      },
      backgroundSize: {
        'zoom-in': '600% 600%',
      },
      boxShadow: {
        glowing: `
					inset 0 0 50px #fff,      /* inner white */
					inset 20px 0 80px #f0f,   /* inner left magenta short */
					inset -20px 0 80px #0ff,  /* inner right cyan short */
					inset 20px 0 300px #f0f,  /* inner left magenta broad */
					inset -20px 0 300px #0ff, /* inner right cyan broad */
					0 0 50px #fff,            /* outer white */
					-10px 0 80px #f0f,        /* outer left magenta */
					10px 0 80px #0ff;         /* outer right cyan */
				`,
      },
      colors: {
        light: {
          bg: colors.slate[50],
          head: colors.slate[100],
          body: colors.slate[200],
        },
        dark: {
          bg: colors.slate[900],
          head: colors.slate[800],
          body: colors.slate[700],
        },
        primary: {
          lightest: colors.violet[300],
          lighter: colors.violet[400],
          normal: colors.violet[500],
          darker: colors.violet[700],
          darkest: colors.violet[900],
        },
        secondary: {
          lightest: colors.fuchsia[300],
          lighter: colors.fuchsia[400],
          normal: colors.fuchsia[500],
          darker: colors.fuchsia[700],
          darkest: colors.fuchsia[900],
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),

    plugin(function ({addUtilities, addVariant, matchUtilities, theme}) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')

      addUtilities({
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.move-back': {
          transform: 'translate3d(-1rem,-0.5rem,-2rem)',
        },
        '.move-forth': {
          transform: 'translate3d(1rem,0.5rem,2rem)',
        },
        '.move-back-lg': {
          transform: 'translate3d(-2rem,-1rem,-4rem)',
        },
        '.move-forth-lg': {
          transform: 'translate3d(2rem,1rem,4rem)',
        },
      })

      matchUtilities(
        {
          'translate-z': (value) => ({
            transform: `translateZ(${value})`,
          }),
        },
        {values: theme('translate')}
      )
    }),
  ],
}
