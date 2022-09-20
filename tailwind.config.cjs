/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				heading: ['Poppins', 'sans-serif'],
				body: ['Inter', 'sans-serif'],
			},
			animation: {
				gradient: 'gradient 4s ease-in-out infinite',
			},
			keyframes: {
				gradient: {
					'0%': {
						backgroundPosition: '0% 0%',
					},
					'50%': {
						backgroundPosition: '100% 0%',
					},
					'100%': {
						backgroundPosition: '0% 0%',
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
