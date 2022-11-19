import React from 'react'
import {type DefaultErrorShape} from '@trpc/server'
import {type DefaultErrorData} from '@trpc/server/dist/error/formatter'

type ErrorType = {
	message: string
	data?: DefaultErrorData | null
	shape?: DefaultErrorShape | null | null
}

type Props<T> = {
	isLoading: boolean
	isError: boolean
	data?: T
	error: ErrorType | null
	children: (entry: T) => JSX.Element
}

const QueryWrapper = <T,>({
	isLoading,
	isError,
	data,
	error,
	children,
}: Props<T>) => {
	if (isLoading) {
		return <Loading />
	} else if (isError) {
		return <Error error={error} />
	} else if (data) {
		return (Array.isArray(data) && data.length === 0) || data === null ? (
			<Empty />
		) : (
			children(data)
		)
	}
	return <React.Fragment />
}

const Loading = () => (
	<div>
		<p>Loading...</p>
	</div>
)

const Error = ({error}: {error: ErrorType | null}) => (
	<div>
		<p>
			[{error?.data?.httpStatus}] {error?.data?.code} at {error?.data?.path}
		</p>
		<pre>{error?.message}</pre>
	</div>
)

const Empty = () => (
	<div>
		<p>There is not data</p>
	</div>
)

export default QueryWrapper
