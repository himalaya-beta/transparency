import React from 'react'
import {shallow} from 'zustand/shallow'
import {useAutoAnimate} from '@formkit/auto-animate/react'

import useDeviceDetect from 'utils/hooks/use-device-detect'
import {usePagination} from 'utils/hooks/use-store'
import {isArrayIdentic} from 'utils/array'

import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'

import {
	type FetchNextPageOptions,
	type UseInfiniteQueryResult,
	type InfiniteData,
} from '@tanstack/react-query'
import {type PagesAvailable} from 'utils/hooks/use-store'

type Props<T> = {
	name: PagesAvailable
	keys?: Array<string>
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

const DataInfiniteWrapper = <T,>({
	name,
	keys = [],
	hasNextPage,
	fetchNextPage,
	data,
	className = '',
	children,
}: Props<T>) => {
	const device = useDeviceDetect()

	// -------------------------------- STORE -------------------------------- //
	const initParams = usePagination((state) => state.initParams)
	const addPage = usePagination((state) => state.addPage)
	const setPage = usePagination((state) => state.setPageActive)
	const {pages, pageActive} = usePagination((state) => {
		const current = state[name].find((item) => isArrayIdentic(item.keys, keys))
		return {
			pages: current?.pages ?? [1],
			pageActive: current?.pageActive ?? 1,
		}
	}, shallow)
	const pageLast = pages.length

	const refStoreInit = React.useRef(false)
	React.useEffect(() => {
		if (refStoreInit.current) {
			initParams(name, keys)
		} else {
			setPage(name, keys, 1)
			refStoreInit.current = true
		}
	}, [keys, name, initParams, setPage])

	// ----------------------------- Prefetching ----------------------------- //
	const refInit = React.useRef(false)
	React.useEffect(() => {
		if (refInit.current) {
			if (hasNextPage && pageActive === pageLast) {
				fetchNextPage()
				addPage(name, keys)
			}
		} else {
			refInit.current = true
		}
	}, [addPage, fetchNextPage, hasNextPage, keys, name, pageActive, pageLast])

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
					if (i + 1 !== pageActive && !device.isPhone) return
					if (i + 1 !== pageActive + 1 || pageActive === pageLast)
						return items.map((item) => children(item))
				})}
			</div>

			{device.isPhone ? (
				<>
					{pageActive !== pageLast && (
						<div className='flex justify-center'>
							<button
								onClick={() => setPage(name, keys, pageActive + 1)}
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
						onClick={() => setPage(name, keys, pageActive - 1)}
						disabled={pageActive === 1}
						className='p-2 text-white transition-transform hover:scale-150 disabled:transform-none disabled:text-gray-500'
					>
						<ChevronDoubleLeftIcon className='h-4 w-4 ' />
					</button>

					<div className='flex h-12 items-center gap-3'>
						{pages.map((i) => {
							const span = 3 + 1
							const isFirst = i === 1
							const isActive = i === pageActive
							const isLast = i === pages.length

							const label = i
							const key = `page_button_${i}`

							const onClick = () => setPage(name, keys, i)

							return (
								<React.Fragment key={key}>
									{isFirst && !isActive && (
										<>
											<PageButton
												key={`${key}_first`}
												label={pageActive >= 1 + span + 1 ? 'first' : label}
												isActive={isActive}
												onClick={onClick}
											/>
											{pageActive >= 1 + span + 1 && (
												<span
													key={`${key}_dot_left`}
													className='text-light-body'
												>
													...
												</span>
											)}
										</>
									)}

									{i < pageActive && i > pageActive - span && !isFirst && (
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

									{i > pageActive && i < pageActive + span && !isLast && (
										<PageButton
											key={`${key}_right_${i}`}
											label={label}
											isActive={isActive}
											onClick={onClick}
										/>
									)}

									{isLast && !isActive && (
										<>
											{i > pageActive + span && (
												<span
													key={`${key}_dot_left`}
													className='text-light-body'
												>
													...
												</span>
											)}
											<PageButton
												key={`${key}_last`}
												label={i > pageActive + span ? 'last' : label}
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
						onClick={() => setPage(name, keys, pageActive + 1)}
						disabled={!hasNextPage && pageActive === pageLast}
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

export default DataInfiniteWrapper
