export function capFirstChar(str: string): string {
	return str[0]?.toUpperCase() + str.slice(1)
}

export const slugify = (str: string) => {
	return str
		.normalize('NFD') // split an accented letter in the base letter and the accent
		.replace(/[\u0300-\u036F]/g, '') // remove all previously split accents
		.toLowerCase()
		.trim()
		.replace(/[^\d a-z]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
		.replace(/\s+/g, '-') // separator
}
