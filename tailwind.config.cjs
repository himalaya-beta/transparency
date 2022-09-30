/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin')
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
		},
	},
	plugins: [
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
