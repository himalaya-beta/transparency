import React from 'react'
import {type DefaultErrorShape} from '@trpc/server'
import {type DefaultErrorData} from '@trpc/server/dist/error/formatter'
import {type UseTRPCQueryResult} from '@trpc/react-query/shared'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import {
	ArchiveBoxIcon,
	ArrowPathIcon,
	ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

type ErrorType = {
	message: string
	data?: DefaultErrorData | null
	shape?: DefaultErrorShape | null
}

type Props<T> = UseTRPCQueryResult<T, ErrorType> & {
	children: (data: T | never[]) => JSX.Element
	Loading?: JSX.Element
	Empty?: JSX.Element
	Error?: (error: ErrorType) => JSX.Element
}

const QueryWrapper = <T,>({
	isLoading,
	isError,
	isRefetching,
	data,
	error,
	refetch,
	isInitialLoading,
	Loading: CustomLoading,
	Empty: CustomEmpty,
	Error: CustomError,
	children,
}: Props<T>) => {
	const duration = 350
	const [containerRef] = useAutoAnimate<HTMLDivElement>({duration})
	const [listRef] = useAutoAnimate<HTMLDivElement>({duration})

	React.useEffect(() => {
		// TODO: Find a better way to handle animation after redirect
		const timer = setTimeout(() => {
			if (!isInitialLoading) {
				refetch()
			}
		}, duration)
		return () => clearTimeout(timer)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div ref={containerRef}>
			{isLoading && !isRefetching ? (
				<LoadingPlaceholder CustomLoading={CustomLoading} />
			) : isError ? (
				<ErrorPlaceholder
					error={error}
					CustomError={CustomError}
					refetch={refetch}
				/>
			) : (Array.isArray(data) && data.length === 0) || data === null ? (
				<EmptyPlaceholder CustomEmpty={CustomEmpty} />
			) : (
				<React.Fragment />
			)}
			<div className={children([]).props.className} ref={listRef}>
				{data && children(data).props.children}
			</div>
		</div>
	)
}

export const LoadingPlaceholder = ({
	CustomLoading,
	label,
}: {
	label?: string
	CustomLoading?: JSX.Element
}) => {
	return (
		CustomLoading ?? (
			<div className='flex h-96 w-full flex-col items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10'>
				<ArrowPathIcon className='w-12 animate-spin text-light-head' />
				<p>Loading {label ?? 'data'}...</p>
			</div>
		)
	)
}

export const ErrorPlaceholder = ({
	error,
	CustomError,
	refetch,
}: {
	error: ErrorType
	CustomError?: (error: ErrorType) => JSX.Element
	refetch: () => void
}) => {
	return CustomError ? (
		CustomError(error)
	) : (
		<div className='flex min-h-fit w-full flex-col items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 p-8'>
			<div className='relative'>
				<ExclamationTriangleIcon className='absolute w-12 animate-ping text-light-head' />
				<ExclamationTriangleIcon className='w-12 text-light-head' />
			</div>
			<div className='rounded bg-dark-bg/20 px-4 py-2'>
				{error.data && (
					<p>
						[{error.data.httpStatus}] {error.data.code} at {error.data.path}
					</p>
				)}
				<pre className='text-xs'>{error.message}</pre>
			</div>
			<button
				onClick={() => refetch()}
				className='rounded border px-3 py-1 text-light-head'
			>
				Retry
			</button>
		</div>
	)
}

export const EmptyPlaceholder = ({
	CustomEmpty,
	label,
}: {
	label?: string
	CustomEmpty?: JSX.Element
}) => {
	return (
		CustomEmpty ?? (
			<div className='flex h-96 w-full flex-col items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10'>
				<ArchiveBoxIcon className='w-12 text-light-head' />
				<p>There is no {label ?? 'data'} yet</p>
			</div>
		)
	)
}

export default QueryWrapper
