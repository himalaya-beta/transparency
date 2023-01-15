/* eslint-disable unicorn/no-useless-undefined */
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {trpc} from 'utils/trpc'
import {slugify, truncate} from 'utils/literal'
import useDeviceDetect from 'utils/hooks/use-device-detect'

import NavbarLayout from 'layouts/navbar'
import MetaHead from 'components/meta-head'
import {
	EmptyPlaceholder,
	ErrorPlaceholder,
	LoadingPlaceholder,
} from 'components/query-wrapper'
import PaginationNav from 'components/pagination-nav'
import DivAnimate from 'components/div-animate'
import FormWrapper from 'components/form-wrapper'
import TextAreaInput from 'components/textarea-input'
import {Button} from 'components/button'
import {SectionSeparator, TriangleSymbol} from 'components/ornaments'
import {PencilIcon} from '@heroicons/react/24/solid'

import {type SubmitHandler} from 'react-hook-form'
import {
	articleCreateSchema,
	type ArticleCreateType,
	type ArticleType,
} from 'types/article'

const PER_PAGE = 9

export default function ArticlePage() {
	const [page, setPage] = React.useState(1)

	const {error, refetch, data, hasNextPage, fetchNextPage, isError, isLoading} =
		trpc.article.fetchAll.useInfiniteQuery(
			{dataPerPage: PER_PAGE},
			{
				refetchOnWindowFocus: false,
				staleTime: 60_000,
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			}
		)

	const device = useDeviceDetect()

	return (
		<>
			<MetaHead
				title='Community Blog'
				description='Place where every member share their thought'
				imageUrl={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/images/articles.jpg`}
			/>
			<main className='container mx-auto max-w-screen-lg space-y-8 px-5 pt-8 md:px-8'>
				<h1 className='text-2xl'>Community Blog</h1>

				<DivAnimate>
					{isLoading ? (
						<LoadingPlaceholder label='app policies' />
					) : isError ? (
						<ErrorPlaceholder error={error} refetch={refetch} />
					) : data.pages[0]?.items.length === 0 ? (
						<EmptyPlaceholder label='app policy' />
					) : (
						<React.Fragment>
							{device.isPhone ? (
								<DivAnimate className='space-y-4'>
									{data.pages.map(({items}) =>
										items.map((item) => <Card key={item.id} {...item} />)
									)}

									{hasNextPage && (
										<div className='flex justify-center'>
											<button
												onClick={() => fetchNextPage()}
												className='rounded-lg bg-white/20 px-4 py-2'
											>
												Load more ..
											</button>
										</div>
									)}
								</DivAnimate>
							) : (
								<DivAnimate>
									{data.pages.map(({items, nextCursor}, i) => {
										if (i + 1 !== page) return
										return (
											<DivAnimate
												className='grid grid-cols-6 gap-4'
												key={`section_md_${nextCursor}`}
											>
												{items.map((item) => (
													<Card
														key={item.id}
														{...item}
														className='col-span-full md:col-span-3 lg:col-span-2'
													/>
												))}
											</DivAnimate>
										)
									})}
									<PaginationNav
										{...{page, setPage, hasNextPage, fetchNextPage}}
									/>
								</DivAnimate>
							)}
						</React.Fragment>
					)}
				</DivAnimate>

				<CreateArticleForm refetchList={refetch} />
			</main>
		</>
	)
}

const Card = ({
	id,
	title,
	content,
	updatedAt,
	author,
	className,
}: ArticleType & {className?: string}) => {
	return (
		<Link
			href={`./community/${slugify(title, id)}`}
			className={`min-h-48 relative flex max-h-64 flex-col overflow-hidden rounded rounded-br-3xl rounded-tl-2xl border border-light-head/25 bg-gradient-to-br from-light-bg/30 to-light-bg/5 p-6 shadow-lg transition-all duration-100 hover:scale-105 hover:from-light-bg/40 hover:shadow-light-bg/25 ${className}`}
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
					<div className='h-14 w-16 rounded-br-xl bg-dark-bg/30 shadow-xl'>
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
			<div className='mt-1 h-fit w-full text-xl text-light-head'>
				<div className='float-left mr-2 h-12 w-12' />
				<h2>{truncate(title, 58)}</h2>
				<div className='mt-0.5 flex h-1 items-center gap-2'>
					<div className='h-[1px] w-auto grow rounded-full bg-brand-500/50' />
					<TriangleSymbol className='' />
				</div>
				<p className='float-right mr-5 text-sm italic'>by {author.name}</p>
			</div>

			<p className='pt-3 text-right indent-12 leading-5 text-light-body line-clamp-5'>
				{content}
			</p>
		</Link>
	)
}

const CreateArticleForm = ({refetchList}: {refetchList: () => void}) => {
	const methods = useForm<ArticleCreateType>({
		mode: 'onTouched',
		resolver: zodResolver(articleCreateSchema),
	})

	const {mutate, isLoading} = trpc.article.create.useMutation({
		onError: (error) => {
			let message = error.message
			if (error.data?.code === 'UNAUTHORIZED') {
				message = 'You have to logged in to create article.'
			}
			alert(message)
		},
		onSuccess: () => {
			refetchList()
			methods.reset()
		},
	})

	const onValidSubmit: SubmitHandler<ArticleCreateType> = (data) => {
		mutate(data)
	}

	return (
		<div className='space-y-2'>
			<SectionSeparator>Create new</SectionSeparator>
			<div className='mx-auto lg:w-3/4 '>
				<FormWrapper
					methods={methods}
					onValidSubmit={onValidSubmit}
					className='flex flex-col gap-4'
				>
					<TextAreaInput<ArticleCreateType>
						name='title'
						inputClassName='h-[5.4em] md:h-[4em] lg:h-[2.5em]'
					/>
					<TextAreaInput<ArticleCreateType>
						name='content'
						inputClassName='h-[16em] md:h-[12.8em] lg:h-[10em]'
					/>
					<Button type='submit' variant='outlined' isLoading={isLoading}>
						Create <PencilIcon className='h-4 w-4' />
					</Button>
				</FormWrapper>
			</div>
		</div>
	)
}

ArticlePage.getLayout = function getLayout(page: React.ReactElement) {
	return <NavbarLayout>{page}</NavbarLayout>
}
