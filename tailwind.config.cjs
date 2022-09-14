/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				heading: ['Poppins', 'sans-serif'],
				body: ['Inter', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
