/* eslint-disable unicorn/no-useless-undefined */
import React from 'react'

export default function debounce<Args extends unknown[]>(
	fn: (...args: Args) => void,
	delay: number
) {
	let timeoutID: number | undefined

	const debounced = (...args: Args) => {
		clearTimeout(timeoutID)
		timeoutID = window.setTimeout(() => fn(...args), delay)
	}

	return debounced
}

export const useDebounceState = <T>(initial: T, timeout: number) => {
	const [state, setState] = React.useState<T>(initial)

	const setDebounceState = debounce((value: T) => {
		setState(value)
	}, timeout)

	return [state, setDebounceState] as const
}
