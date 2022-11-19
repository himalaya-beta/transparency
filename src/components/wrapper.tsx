import React from 'react'

// TODO: How can we get the types (Example) automatically
type Example = {
	id: string
	title: string
	content: string
}

type Props = {
	isLoading: boolean
	isError: boolean
	data: Example[] | undefined
	children: (entry: Example) => JSX.Element
}

const QueryWrapper = ({isLoading, isError, data, children}: Props) => {
	if (isLoading) return <p>Loading ...</p>
	else if (isError) return <p>Error</p>
	else if (data) {
		return data.length === 0 ? (
			<p>Empty</p>
		) : (
			<>
				{data.map((entry) =>
					React.cloneElement(children(entry), {key: entry.id})
				)}
			</>
		)
	}
	return <></>
}

export default QueryWrapper
