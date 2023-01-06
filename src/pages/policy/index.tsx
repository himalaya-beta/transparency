/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/no-useless-undefined */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

import {trpc} from 'utils/trpc'
import {slugify} from 'utils/literal'

import NavbarLayout from 'layouts/navbar'
import MetaHead from 'components/meta-head'
import PaginationNav from 'components/pagination-nav'
import {TriangleSymbol} from 'components/ornaments'
import {PuzzlePieceIcon} from '@heroicons/react/24/outline'

import {type AppType} from 'types/app'
import {useDebounceState} from 'utils/hooks/use-debounce'
import DivAnimate from 'components/div-animate'

const PER_PAGE = 8

export default function PolicyPage() {
	const [page, setPage] = React.useState(1)
	const [searchQuery, setSearchQuery] = useDebounceState<string | undefined>(
		undefined,
		350
	)

	const appQuery = trpc.app.search.useInfiniteQuery(
		{query: searchQuery, dataPerPage: PER_PAGE},
		{
			staleTime: 60_000,
			refetchOnWindowFocus: false,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	)
	const {hasNextPage, fetchNextPage, data} = appQuery

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value === '' ? undefined : e.target.value)
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

				{/* TODO: modify query wrapper & use it */}
				{/* TODO: load more on mobile */}
				<DivAnimate>
					{data?.pages.map(({items, nextCursor}, i) => {
						if (i + 1 !== page) return
						return (
							<div
								key={`section_${nextCursor}`}
								className='grid grid-cols-4 gap-4'
							>
								{items.map((item) => (
									<Card
										key={item.id}
										className='col-span-full md:col-span-2'
										{...item}
									/>
								))}
							</div>
						)
					})}
				</DivAnimate>

				<PaginationNav {...{page, setPage, hasNextPage, fetchNextPage}} />
			</main>
		</>
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

			<p className='h-full pt-4 text-right indent-12 leading-5 text-light-body line-clamp-4 md:line-clamp-3 '>
				{about}
			</p>
		</Link>
	)
}

PolicyPage.getLayout = (page: React.ReactElement) => (
	<NavbarLayout>{page}</NavbarLayout>
)
