/* eslint-disable unicorn/no-useless-undefined */
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'

import {trpc} from 'utils/trpc'
import {slugify, truncate} from 'utils/literal'
import {useDebounceState} from 'utils/hooks/use-debounce'

import NavbarLayout from 'layouts/navbar'
import MetaHead from 'components/meta-head'
import DivAnimate from 'components/div-animate'
import {
	EmptyPlaceholder,
	ErrorPlaceholder,
	LoadingPlaceholder,
} from 'components/query-wrapper'
import DataInfiniteWrapper from 'components/query-infinite-wrapper'
import {TriangleSymbol} from 'components/ornaments'

import {type ArticleType} from 'types/article'

const PER_PAGE = 9

export default function ArticlePage() {
	const [searchQuery, setSearchQuery] = useDebounceState<string>('', 350)

	const {error, refetch, data, hasNextPage, fetchNextPage, isError, isLoading} =
		trpc.article.fetchAll.useInfiniteQuery(
			{dataPerPage: PER_PAGE, query: searchQuery},
			{
				staleTime: 60_000,
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			}
		)
	const paginationProps = {data, hasNextPage, fetchNextPage}

	return (
		<>
			<MetaHead
				title='Community Blog'
				description='Place where every member share their thought'
				imageUrl={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/images/articles.jpg`}
			/>
			<main className='container space-y-8 px-5 pt-8 md:px-8'>
				<div className='mx-auto max-w-screen-lg space-y-2'>
					<div className='flex gap-2'>
						<h1 className='text-2xl'>Community Blog</h1>
						{/* <IconButton onClick={() => void setIsOpen(true)}>
							<PlusIcon className='w-6 text-brand-600' />
						</IconButton> */}
					</div>
					<input
						className='h-10 w-full flex-1 rounded rounded-tl-lg rounded-br-2xl bg-gradient-to-br from-white via-brand-100 to-brand-300 py-2 px-3 placeholder:font-body placeholder:text-sm placeholder:italic md:w-1/2'
						onChange={(e) => void setSearchQuery(e.target.value)}
						placeholder='search by title or content...'
					/>
				</div>

				<DivAnimate className='mx-auto max-w-screen-lg '>
					{isLoading ? (
						<LoadingPlaceholder label='app policies' />
					) : isError ? (
						<ErrorPlaceholder error={error} refetch={refetch} />
					) : data.pages[0]?.items.length === 0 ? (
						<EmptyPlaceholder label='app policy' />
					) : (
						<DataInfiniteWrapper
							name='community'
							className='grid grid-cols-6 gap-y-4 gap-x-6'
							{...paginationProps}
						>
							{(item) => (
								<Card
									key={item.id}
									className='col-span-full md:col-span-3 lg:col-span-3'
									{...item}
								/>
							)}
						</DataInfiniteWrapper>
					)}
				</DivAnimate>
			</main>
		</>
	)
}

const Card = ({
	id,
	title,
	contentHighlight,
	updatedAt,
	author,
	className,
}: ArticleType & {className?: string}) => {
	return (
		<Link
			href={`./community/${slugify(title, id)}`}
			className={`min-h-48 relative flex h-fit max-h-64 flex-col overflow-hidden rounded rounded-br-3xl rounded-tl-2xl border border-light-head/25 bg-gradient-to-br from-light-bg/30 to-light-bg/5 p-6 shadow-lg transition-all duration-100 hover:scale-105 hover:from-light-bg/40 hover:shadow-light-bg/25 ${className}`}
		>
			<div className='absolute top-0 left-0'>
				<div className='flex rounded-br-2xl bg-dark-bg/30'>
					<div className='flex w-16 items-center justify-center'>
						{/* <StarIcon className='text-sm text-yellow-300' /> */}
					</div>
					<div className='py-0.5 px-4 text-sm text-light-head'>
						<time className='font-body text-sm italic'>
							{dayjs(updatedAt).format('MMM D, YYYY')}
						</time>
					</div>
				</div>
				{author.image && (
					<div className='h-16 w-16 rounded-br-xl bg-dark-bg/30 shadow-xl'>
						<Image
							className='h-full w-full rounded-tl-lg rounded-br-xl object-cover'
							src={author.image}
							alt='author picture'
							width={72}
							height={72}
						/>
					</div>
				)}
			</div>
			<div className='mt-2 h-fit w-full text-xl text-light-head lg:mt-1'>
				<div className='float-left mr-2 h-12 w-12' />
				<h2>{truncate(title, 64)}</h2>
				<div className='mt-0.5 flex h-1 items-center gap-2'>
					<div className='h-[1px] w-auto grow rounded-full bg-brand-500/50' />
					<TriangleSymbol className='' />
				</div>
				<p className='float-right mr-5 text-sm italic'>by {author.name}</p>
			</div>

			<p className='pt-3 text-right indent-12 leading-5 text-light-body line-clamp-3'>
				{contentHighlight}
			</p>
		</Link>
	)
}

ArticlePage.getLayout = function getLayout(page: React.ReactElement) {
	return <NavbarLayout>{page}</NavbarLayout>
}
