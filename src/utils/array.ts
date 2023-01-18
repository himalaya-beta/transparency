export const isArrayIdentic = (a: string[], b: string[]) => {
	if (a.length === b.length) {
		for (const [i, element] of a.entries()) {
			if (element !== b[i]) {
				return false
			}
		}
		return true
	} else {
		return false
	}
}
