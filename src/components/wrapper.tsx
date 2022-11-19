import React from 'react'

type Props<T> = {
	isLoading: boolean
	isError: boolean
	data: T | undefined
	children: (entry: T) => JSX.Element
}

const QueryWrapper = <T,>({isLoading, isError, data, children}: Props<T>) => {
	if (isLoading) return <p>Loading ...</p>
	else if (isError) return <p>Error</p>
	else if (data) {
		return (Array.isArray(data) && data.length === 0) || data === null ? (
			<p>Empty</p>
		) : (
			children(data)
		)
	}
	return <React.Fragment />
}

export default QueryWrapper
