import React from 'react'
import {atom, useAtom, useAtomValue} from 'jotai'
import {focusAtom} from 'jotai-optics'
import {useAutoAnimate} from '@formkit/auto-animate/react'

import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'

import useDeviceDetect from 'utils/hooks/use-device-detect'

import {
	type FetchNextPageOptions,
	type UseInfiniteQueryResult,
	type InfiniteData,
} from '@tanstack/react-query'

type PaginationObject = {
	pages: Array<number>
	pageActive: number
}
const initialParams = {
	pages: [1],
	pageActive: 1,
}
const initialValues = {
	policy: initialParams,
	community: initialParams,
}
const paginationAtom = atom<Record<string, PaginationObject>>(initialValues)

type Props<T> = {
	name: keyof typeof initialValues
	hasNextPage: boolean | undefined
	fetchNextPage: (
		options?: FetchNextPageOptions
	) => Promise<UseInfiniteQueryResult>
	data:
		| InfiniteData<{
				items: T[]
				nextCursor: string | undefined
		  }>
		| undefined
	className?: string
	children: (item: T) => JSX.Element
}

const DataPaginated = <T,>({
	name,
	hasNextPage,
	fetchNextPage,
	data,
	className = '',
	children,
}: Props<T>) => {
	const device = useDeviceDetect()

	// -------------------------------- ATOMS -------------------------------- //
	const currentPaginationAtom = React.useMemo(
		() => focusAtom(paginationAtom, (optic) => optic.prop(name)),
		[name]
	)
	const pagesAtom = React.useMemo(
		() => focusAtom(currentPaginationAtom, (optic) => optic.prop('pages')),
		[currentPaginationAtom]
	)
	const pageAtom = React.useMemo(
		() => focusAtom(currentPaginationAtom, (optic) => optic.prop('pageActive')),
		[currentPaginationAtom]
	)
	const lastPageAtom = React.useMemo(
		() => atom((get) => get(currentPaginationAtom).pages.length),
		[currentPaginationAtom]
	)
	const [pages, setPages] = useAtom(pagesAtom)
	const [page, setPage] = useAtom(pageAtom)
	const lastPage = useAtomValue(lastPageAtom)

	// ----------------------------- Prefetching ----------------------------- //
	React.useEffect(() => {
		if (hasNextPage && page === lastPage) {
			fetchNextPage()
			setPages([...pages, page + 1])
		}
	}, [hasNextPage, page, lastPage, fetchNextPage, setPages, pages])

	// ------------------------------ Animation ------------------------------ //
	const [refAnimate, enableAnimations] = useAutoAnimate<HTMLDivElement>()
	React.useEffect(() => {
		if (device.isPhone) {
			enableAnimations(false)
		} else {
			enableAnimations(true)
		}
	}, [device.isPhone, enableAnimations])

	return (
		<div className='space-y-4 md:space-y-6'>
			<div className={className} ref={refAnimate}>
				{data?.pages.map(({items}, i) => {
					if (i + 1 !== page && !device.isPhone) return
					if (i + 1 !== page + 1 || page === lastPage)
						return items.map((item) => children(item))
				})}
			</div>

			{device.isPhone ? (
				<>
					{page !== lastPage && (
						<div className='flex justify-center'>
							<button
								onClick={() => setPage(page + 1)}
								className='rounded-lg bg-white/20 px-4 py-2'
							>
								Load more ..
							</button>
						</div>
					)}
				</>
			) : (
				<div className='mx-auto flex h-16 w-fit items-center gap-2 transition-all'>
					<button
						onClick={() => void setPage(page - 1)}
						disabled={page === 1}
						className='p-2 text-white transition-transform hover:scale-150 disabled:transform-none disabled:text-gray-500'
					>
						<ChevronDoubleLeftIcon className='h-4 w-4 ' />
					</button>

					<div className='flex h-12 items-center gap-3'>
						{pages.map((i) => {
							const span = 3 + 1
							const isFirst = i === 1
							const isActive = i === page
							const isLast = i === pages.length

							const label = i
							const key = `page_button_${i}`

							const onClick = () => void setPage(i)

							return (
								<React.Fragment key={key}>
									{isFirst && !isActive && (
										<>
											<PageButton
												key={`${key}_first`}
												label={page >= 1 + span + 1 ? 'first' : label}
												isActive={isActive}
												onClick={onClick}
											/>
											{page >= 1 + span + 1 && (
												<span
													key={`${key}_dot_left`}
													className='text-light-body'
												>
													...
												</span>
											)}
										</>
									)}

									{i < page && i > page - span && !isFirst && (
										<PageButton
											key={`${key}_left_${i}`}
											label={label}
											isActive={isActive}
											onClick={onClick}
										/>
									)}

									{isActive && (
										<PageButton
											key={`${key}_active`}
											label={label}
											isActive={isActive}
											onClick={onClick}
										/>
									)}

									{i > page && i < page + span && !isLast && (
										<PageButton
											key={`${key}_right_${i}`}
											label={label}
											isActive={isActive}
											onClick={onClick}
										/>
									)}

									{isLast && !isActive && (
										<>
											{i > page + span && (
												<span
													key={`${key}_dot_left`}
													className='text-light-body'
												>
													...
												</span>
											)}
											<PageButton
												key={`${key}_last`}
												label={i > page + span ? 'last' : label}
												isActive={isActive}
												onClick={onClick}
											/>
										</>
									)}
								</React.Fragment>
							)
						})}
					</div>

					<button
						onClick={() => void setPage(page + 1)}
						disabled={!hasNextPage && page === lastPage}
						className='p-2 text-white transition-transform hover:scale-125 disabled:transform-none disabled:text-gray-500'
					>
						<ChevronDoubleRightIcon className='h-4 w-4' />
					</button>
				</div>
			)}
		</div>
	)
}

type ButtonProps = {
	isActive: boolean
	onClick: () => void
	label: string | number
}

const PageButton: React.FC<ButtonProps> = ({isActive, onClick, label}) => {
	return (
		<button
			onClick={onClick}
			disabled={isActive}
			className={`
				h-8 transition-all disabled:scale-125
				${typeof label === 'number' ? 'hover:scale-150' : 'text-sm hover:scale-125'}
				${isActive ? '-mt-0.5 font-heading text-xl font-bold' : ''}
			`}
		>
			{label}
		</button>
	)
}

export default DataPaginated
