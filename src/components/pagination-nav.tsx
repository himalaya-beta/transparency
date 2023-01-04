import React, {type Dispatch} from 'react'
import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'

const PaginationNav = ({
	span: spanP = 3,
	page,
	setPage,
	cursorIds,
	setCursorId,
}: {
	span?: number
	page: number
	setPage: Dispatch<number>
	cursorIds: Array<string | undefined>
	setCursorId: Dispatch<string | undefined>
}) => {
	return (
		<div className='mx-auto flex h-16 w-fit items-center gap-2 transition-all'>
			<button
				onClick={() => {
					setPage(page - 1)
					setCursorId(cursorIds[page - 1])
				}}
				disabled={page === 0}
				className='p-2 transition-transform hover:scale-150 disabled:transform-none disabled:text-gray-400'
			>
				<ChevronDoubleLeftIcon className='h-4 w-4' />
			</button>

			<div className='flex h-12 items-center gap-3'>
				{cursorIds.map((id, i) => {
					const span = spanP + 1
					const isFirst = i === 0
					const isActive = i === page
					const isLast = i === cursorIds.length - 1

					const label = i + 1
					const key = `page_button_${id}`

					const onClick = () => {
						setPage(i)
						setCursorId(cursorIds[i])
					}

					return (
						<React.Fragment key={key}>
							{isFirst && !isActive && (
								<>
									<PageButton
										key={`${key}_first`}
										label={page >= 1 + span ? 'first' : label}
										isActive={isActive}
										onClick={onClick}
									/>
									{page >= 1 + span && (
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
					setPage(page + 1)
					setCursorId(cursorIds[page + 1])
				}}
				disabled={page === cursorIds.length - 1}
				className='p-2 transition-transform hover:scale-125 disabled:transform-none disabled:text-gray-400'
			>
				<ChevronDoubleRightIcon className='h-4 w-4' />
			</button>
		</div>
	)
}

const PageButton = ({
	isActive,
	onClick,
	label,
}: {
	isActive: boolean
	onClick: () => void
	label: string | number
}) => {
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
