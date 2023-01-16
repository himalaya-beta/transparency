import React from 'react'
import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'

import {
	type FetchNextPageOptions,
	type UseInfiniteQueryResult,
} from '@tanstack/react-query'
import {atom, useAtom, useAtomValue} from 'jotai'
import {focusAtom} from 'jotai-optics'

type Props = {
	name: string
	setPage: React.Dispatch<React.SetStateAction<number>>
	hasNextPage: boolean | undefined
	fetchNextPage: (
		options?: FetchNextPageOptions
	) => Promise<UseInfiniteQueryResult>
}

type PaginationObject = {
	pages: Array<number>
	pageActive: number
}

const initParams = {
	pages: [1],
	pageActive: 1,
}

const paginationAtom = atom<Record<string, PaginationObject>>({
	policy: initParams,
	community: initParams,
})
const PaginationNav: React.FC<Props> = (props) => {
	const {hasNextPage, fetchNextPage, name} = props

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

	// Prefetching
	// React.useEffect(() => {
	// 	if (hasNextPage && page === lastPage) {
	// 		fetchNextPage()
	// 		setPages([...pages, page + 1])
	// 	}
	// }, [hasNextPage, page, lastPage, fetchNextPage, setPages, pages])

	return (
		<div className='mx-auto flex h-16 w-fit items-center gap-2 transition-all'>
			<button
				onClick={() => {
					setPage(page - 1)
					props.setPage(page - 1)
				}}
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

					const onClick = () => {
						setPage(i)
						props.setPage(i)
					}

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
										<span key={`${key}_dot_left`} className='text-light-body'>
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
										<span key={`${key}_dot_left`} className='text-light-body'>
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
				onClick={() => {
					if (hasNextPage && page === lastPage) {
						fetchNextPage()
						setPages([...pages, page + 1])
					}
					setPage(page + 1)
					props.setPage(page + 1)
				}}
				disabled={!hasNextPage && page === lastPage}
				className='p-2 text-white transition-transform hover:scale-125 disabled:transform-none disabled:text-gray-500'
			>
				<ChevronDoubleRightIcon className='h-4 w-4' />
			</button>
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

export default PaginationNav
