import React from 'react'
import {type DefaultErrorShape} from '@trpc/server'
import {type DefaultErrorData} from '@trpc/server/dist/error/formatter'
import {type UseTRPCQueryResult} from '@trpc/react-query/shared'

type ErrorType = {
	message: string
	data?: DefaultErrorData | null
	shape?: DefaultErrorShape | null
}

type Props<T> = UseTRPCQueryResult<T, ErrorType> & {
	children: (data: T) => JSX.Element
	Loading?: JSX.Element
	Empty?: JSX.Element
	Error?: (error: ErrorType) => JSX.Element
}

const QueryWrapper = <T,>({
	isLoading,
	isError,
	data,
	error,
	Loading: CustomLoading,
	Empty: CustomEmpty,
	Error: CustomError,
	children,
}: Props<T>) => {
	if (isLoading) {
		return <Loading CustomLoading={CustomLoading} />
	} else if (isError) {
		return <Error error={error} CustomError={CustomError} />
	} else if (data) {
		return (Array.isArray(data) && data.length === 0) || data === null ? (
			<Empty CustomEmpty={CustomEmpty} />
		) : (
			children(data)
		)
	}
	return <React.Fragment />
}

const Loading = ({CustomLoading}: {CustomLoading?: JSX.Element}) =>
	CustomLoading ?? (
		<div>
			<p>Loading...</p>
		</div>
	)

const Error = ({
	error,
	CustomError,
}: {
	error: ErrorType
	CustomError?: (error: ErrorType) => JSX.Element
}) =>
	CustomError ? (
		CustomError(error)
	) : (
		<div>
			<p>
				[{error?.data?.httpStatus}] {error?.data?.code} at {error?.data?.path}
			</p>
			<pre>{error?.message}</pre>
		</div>
	)

const Empty = ({CustomEmpty}: {CustomEmpty?: JSX.Element}) =>
	CustomEmpty ?? (
		<div>
			<p>There is not data</p>
		</div>
	)

export default QueryWrapper
