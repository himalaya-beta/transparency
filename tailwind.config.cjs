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
			animation: {
				gradient: 'gradient 7s ease-in-out infinite',
				'ping-delay': 'ping-delay 3s cubic-bezier(0, 0, 0.2, 1) infinite',
			},
			keyframes: {
				gradient: {
					'14.25%': {
						'background-position': 'left top',
					},
					'28.5%': {
						'background-position': 'center bottom',
					},
					'42.75%': {
						'background-position': 'center top',
					},
					'57%': {
						'background-position': 'right bottom',
					},
					'71.25%': {
						'background-position': 'left center',
					},
					'85.5%': {
						'background-position': 'right center',
					},
					'100%': {
						'background-position': 'left top',
					},
				},
				'ping-delay': {
					'18.75%, 100%': {
						transform: 'scale(2)',
						opacity: 0,
					},
				},
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
