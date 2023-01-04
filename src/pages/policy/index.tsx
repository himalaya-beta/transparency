/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/no-useless-undefined */
import React, {ChangeEvent} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

import {trpc} from 'utils/trpc'
import {slugify} from 'utils/literal'
import debounce from 'utils/debounce'

import NavbarLayout from 'layouts/navbar'
import MetaHead from 'components/meta-head'
import QueryWrapper from 'components/query-wrapper'
import {TriangleSymbol} from 'components/ornaments'
import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	PuzzlePieceIcon,
} from '@heroicons/react/24/outline'

import {type AppType} from 'types/app'

const DATA_PER_PAGE = 1

export default function PolicyPage() {
	const [cursorIds, setCursorIds] = React.useState<Array<string | undefined>>([
		undefined,
	])
	const [page, setPage] = React.useState(0)

	const [query, setQuery] = React.useState<string | undefined>(undefined)
	const queryMod = query === '' ? undefined : query

	const appQuery = trpc.app.search.useQuery(
		{query: queryMod, cursorId: cursorIds[page], dataPerPage: DATA_PER_PAGE},
		{keepPreviousData: true, staleTime: 60_000}
	)

	React.useEffect(() => {
		const {data, isPreviousData} = appQuery

		if (!isPreviousData && data?.length === DATA_PER_PAGE) {
			const cursor = data[data.length - 1]
			setCursorIds([...cursorIds, cursor?.id])
		}
	}, [appQuery.isPreviousData])

	React.useEffect(() => {
		const {data, isInitialLoading} = appQuery

		if (!isInitialLoading && data) {
			const cursor = data[data.length - 1]
			setCursorIds([...cursorIds, cursor?.id])
		}
	}, [appQuery.isInitialLoading])

	const delayedQuery = debounce((query: string | undefined) => {
		setQuery(query)
	}, 350)

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		delayedQuery(e.target.value === '' ? undefined : e.target.value)
	}

	return (
		<>
			<MetaHead
				title='App Policy'
				description='Search for app policy'
				imageUrl={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/images/articles.jpg`}
			/>
			<main className='container mx-auto max-w-screen-lg space-y-8 px-5 pt-8 md:px-8'>
				<div className='space-y-2'>
					<h1 className='text-2xl'>Search for app policy</h1>
					<div className='grid grid-cols-2 gap-4'>
						<input
							className='col-span-full h-10 p-2 placeholder:font-body placeholder:text-sm placeholder:italic md:col-span-1'
							onChange={onChange}
							placeholder='name, company, keyword...'
						/>
					</div>
				</div>

				<QueryWrapper {...appQuery}>
					{(data) => (
						<div className='grid grid-cols-4 gap-4'>
							{data.map((app) => (
								<Card
									key={app.id}
									{...app}
									className='col-span-full md:col-span-2'
								/>
							))}
						</div>
					)}
				</QueryWrapper>

				<div className='mx-auto flex h-16 w-fit items-center gap-2 transition-all'>
					<button
						onClick={() => setPage(page - 1)}
						disabled={page === 0}
						className='p-2 transition-transform hover:scale-150 disabled:transform-none disabled:text-gray-400'
					>
						<ChevronDoubleLeftIcon className='h-4 w-4' />
					</button>

					<div className='flex h-12 items-center gap-3'>
						{cursorIds.map((id, i) => {
							const span = 3 + 1
							const isFirst = i === 0
							const isActive = i === page
							const isLast = i === cursorIds.length - 1

							const onClick = () => setPage(i)
							const label = i + 1
							const key = `page_button_${id}`

							return (
								<React.Fragment key={key}>
									{isFirst && !isActive && (
										<>
											<PageButton
												key={`${key}_first`}
												label={page >= 2 + span ? 'first' : label}
												isActive={isActive}
												onClick={onClick}
											/>
											{page >= 2 + span && (
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
											{i > page + span + 1 && (
												<span
													key={`${key}_dot_left`}
													className='text-light-body'
												>
													...
												</span>
											)}
											<PageButton
												key={`${key}_last`}
												label={i > page + span + 1 ? 'last' : label}
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
						onClick={() => setPage(page + 1)}
						disabled={page === cursorIds.length - 1}
						className='p-2 transition-transform hover:scale-125 disabled:transform-none disabled:text-gray-400'
					>
						<ChevronDoubleRightIcon className='h-4 w-4' />
					</button>
				</div>
			</main>
		</>
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

const Card = ({
	id,
	name,
	company,
	about,
	updatedAt,
	className,
}: Omit<AppType, 'AppCriteria'> & {className?: string}) => {
	const logo = ''
	return (
		<Link
			href={`./policy/${slugify(name, id)}`}
			className={`hover:shadow-bg-light min-h-48 relative flex max-h-60 flex-col overflow-hidden rounded rounded-br-3xl rounded-tl-2xl border-2 border-light-head/25 bg-light-head bg-opacity-20 p-6 pb-4 duration-100 hover:bg-opacity-30 hover:shadow-lg ${className}`}
		>
			<div className='absolute top-0 left-0'>
				<div className='flex rounded-br-xl bg-dark-bg/30 shadow'>
					<div className='flex w-16 items-center justify-center'>
						{/* <StarIcon className='text-sm text-yellow-300' /> */}
					</div>
					<div className='py-0.5 px-4 text-sm text-light-head'>
						<time className='font-body text-sm italic'>
							{dayjs(updatedAt).format('MMM D, YYYY')}
						</time>
					</div>
				</div>
				<div className='flex h-14 w-16 items-center justify-center rounded-br-xl bg-light-bg/50 shadow-xl'>
					{logo ? (
						<Image
							className='h-full w-full rounded-tl-lg rounded-br-xl object-cover'
							src={logo}
							alt='author picture'
							width={72}
							height={72}
						/>
					) : (
						<PuzzlePieceIcon className='-mt-0.5 -ml-0.5 h-9 w-9 text-gray-700' />
					)}
				</div>
			</div>
			<div className='mt-1 h-fit w-full text-xl text-light-head'>
				<div className='float-left mr-2 h-12 w-12' />
				<h2 className=''>{name}</h2>
				<div className='mt-0.5 flex h-1 items-center gap-2'>
					<div className='h-[1px] w-auto grow rounded-full bg-brand-500/50' />
					<TriangleSymbol className='' />
				</div>
				<p className='float-right mr-5 text-sm italic'>{company}</p>
			</div>

			<p className='h-full overflow-hidden pt-4 text-right indent-12 leading-5 text-light-body'>
				{about}
			</p>
		</Link>
	)
}

PolicyPage.getLayout = (page: React.ReactElement) => (
	<NavbarLayout>{page}</NavbarLayout>
)
