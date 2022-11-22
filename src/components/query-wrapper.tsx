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
	refetch,
	Loading: CustomLoading,
	Empty: CustomEmpty,
	Error: CustomError,
	children,
}: Props<T>) => {
	if (isLoading) {
		return <Loading CustomLoading={CustomLoading} />
	} else if (isError) {
		return <Error error={error} CustomError={CustomError} refetch={refetch} />
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
			<p className='text-gray-200'>Loading...</p>
		</div>
	)

const Error = ({
	error,
	CustomError,
	refetch,
}: {
	error: ErrorType
	CustomError?: (error: ErrorType) => JSX.Element
	refetch: () => void
}) =>
	CustomError ? (
		CustomError(error)
	) : (
		<div>
			{error.data && (
				<p className='text-gray-200'>
					[{error.data.httpStatus}] {error.data.code} at {error.data.path}
				</p>
			)}
			<pre className='text-gray-200'>{error.message}</pre>
			<button
				onClick={() => refetch()}
				className='mt-2 rounded border px-2 text-gray-200'
			>
				Retry
			</button>
		</div>
	)

const Empty = ({CustomEmpty}: {CustomEmpty?: JSX.Element}) =>
	CustomEmpty ?? (
		<div>
			<p className='text-gray-200'>There is not data</p>
		</div>
	)

export default QueryWrapper
