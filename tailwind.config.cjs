/** @type {import('tailwindcss').Config} */
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
		function ({addVariant}) {
			addVariant('child', '& > *')
			addVariant('child-hover', '& > *:hover')
		},
	],
}
