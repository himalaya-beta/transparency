/* eslint-disable unicorn/no-useless-undefined */
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

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
import Modal from 'components/modal'
import FormWrapper from 'components/form-wrapper'
import TextAreaInput from 'components/textarea-input'
import {Button} from 'components/button'
// import {IconButton} from 'components/button'
import {SectionSeparator, TriangleSymbol} from 'components/ornaments'
import {PencilIcon} from '@heroicons/react/24/solid'
// import {PlusIcon} from '@heroicons/react/24/outline'

import {type SubmitHandler} from 'react-hook-form'
import {
	articleCreateSchema,
	type ArticleCreateType,
	type ArticleType,
} from 'types/article'
import {Dialog} from '@headlessui/react'

const PER_PAGE = 9

export default function ArticlePage() {
	const [isOpen, setIsOpen] = React.useState(false)
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

	const methods = useForm<ArticleCreateType>({
		mode: 'onTouched',
		resolver: zodResolver(articleCreateSchema),
	})

	const {mutate: create, isLoading: isCreateLoading} =
		trpc.article.create.useMutation({
			onError: (error) => {
				let message = error.message
				if (error.data?.code === 'UNAUTHORIZED') {
					message = 'You have to logged in to create article.'
				}
				alert(message)
			},
			onSuccess: () => {
				refetch()
				methods.reset()
				setIsOpen(false)
			},
		})

	const onValidSubmit: SubmitHandler<ArticleCreateType> = (data) => {
		create(data)
	}

	return (
		<>
			<MetaHead
				title='Community Blog'
				description='Place where every member share their thought'
				imageUrl={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/images/articles.jpg`}
			/>
			<main className='container mx-auto max-w-screen-lg space-y-8 px-5 pt-8 md:px-8'>
				<div className='space-y-2'>
					<div className='flex gap-2'>
						<h1 className='text-2xl'>Community Blog</h1>
						{/* <IconButton onClick={() => void setIsOpen(true)}>
							<PlusIcon className='w-6 text-brand-600' />
						</IconButton> */}
					</div>
					<input
						className='h-10 w-full flex-1 rounded rounded-tl-lg rounded-br-2xl bg-gradient-to-br from-white via-brand-100 to-brand-300 py-2 px-3 placeholder:font-body placeholder:text-sm placeholder:italic md:w-2/3'
						onChange={(e) => void setSearchQuery(e.target.value)}
						placeholder='by title or content...'
					/>
				</div>

				<DivAnimate>
					{isLoading ? (
						<LoadingPlaceholder label='app policies' />
					) : isError ? (
						<ErrorPlaceholder error={error} refetch={refetch} />
					) : data.pages[0]?.items.length === 0 ? (
						<EmptyPlaceholder label='app policy' />
					) : (
						<DataInfiniteWrapper
							name='community'
							className='grid grid-cols-6 gap-4'
							{...paginationProps}
						>
							{(item) => (
								<Card
									key={item.id}
									className='col-span-full md:col-span-3 lg:col-span-2'
									{...item}
								/>
							)}
						</DataInfiniteWrapper>
					)}
				</DivAnimate>

				<Modal
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					className='max-w-screen-md'
				>
					<div className='border-6 container max-w-screen-lg space-y-2 rounded-lg border-light-bg/40 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 py-6 px-8'>
						<SectionSeparator>
							<Dialog.Title as='h2'>Create new</Dialog.Title>
						</SectionSeparator>
						<div className=''>
							<FormWrapper
								methods={methods}
								onValidSubmit={onValidSubmit}
								className='flex flex-col gap-4'
							>
								<TextAreaInput<ArticleCreateType> name='title' rows={2} />
								<TextAreaInput<ArticleCreateType> name='content' rows={8} />
								<Button
									type='submit'
									variant='outlined'
									isLoading={isCreateLoading}
								>
									Create <PencilIcon className='h-4 w-4' />
								</Button>
							</FormWrapper>
						</div>
					</div>
				</Modal>
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
				<h2>{truncate(title, 55)}</h2>
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

ArticlePage.getLayout = function getLayout(page: React.ReactElement) {
	return <NavbarLayout>{page}</NavbarLayout>
}
