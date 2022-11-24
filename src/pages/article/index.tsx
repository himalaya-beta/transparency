import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'

import {trpc} from '@utils/trpc'

import PlainLayout from 'layouts/nav-top'
import GlassContainerLayout from 'layouts/glass-container'
import QueryWrapper from '@components/query-wrapper'
import {
	MdCreate as CreateIcon,
	//  MdStar as StarIcon
} from 'react-icons/md'

import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import FormWrapper from '@components/form-wrapper'
import TextAreaInput from '@components/textarea-input'
import Button from '@components/button'

import {
	CreateArticleSchema,
	type CreateArticleType,
	type ArticleType,
} from '@type/article'

export default function ArticlePage() {
	const articlesQuery = trpc.article.fetchAll.useQuery()

	return (
		<div className='space-y-8'>
			<h1 className='text-3xl text-gray-50'>Articles</h1>
			<QueryWrapper {...articlesQuery}>
				{(articles) => (
					<div className='grid grid-cols-6 gap-4'>
						{articles.map((article) => (
							<Card key={article.id} {...article} />
						))}
					</div>
				)}
			</QueryWrapper>
			<CreateArticleForm refetchList={articlesQuery.refetch} />
		</div>
	)
}

const Card = ({slug, title, content, createdAt, author}: ArticleType) => {
	return (
		<Link
			href={`./article/${slug}`}
			className={`hover:glass relative col-span-full max-h-96 overflow-hidden rounded rounded-br-3xl rounded-tl-2xl border-2 border-white/25 bg-white/10 p-6 pt-0 duration-100 md:col-span-3 lg:col-span-2`}
		>
			{author.image && (
				<div className='absolute top-0 left-0'>
					<div className='flex rounded-br-xl bg-black bg-opacity-20 shadow'>
						<div className='flex w-16 items-center justify-center'>
							{/* <StarIcon className='text-sm text-yellow-300' /> */}
						</div>
						<div className='py-0.5 px-4 text-sm text-white'>
							<time className='text-sm text-gray-200'>
								{dayjs(createdAt).format('MMM D, YYYY')}
							</time>
						</div>
					</div>
					<div className='h-16 w-16 rounded-br-xl bg-black bg-opacity-20 shadow-xl'>
						<Image
							className='rounded-tl-lg rounded-br-xl'
							src={author.image}
							alt='author picture'
							width={96}
							height={96}
						/>
					</div>
				</div>
			)}
			<div className='mt-7 min-h-[3.5rem] w-full text-xl text-gray-50'>
				<div className='float-left mr-2 h-12 w-12' />
				<h2 className='line-clamp-2'>{title}</h2>
			</div>

			<p className='mt-6 text-gray-200 line-clamp-6'>{content}</p>
		</Link>
	)
}

const CreateArticleForm = ({refetchList}: {refetchList: () => void}) => {
	const methods = useForm<CreateArticleType>({
		mode: 'onTouched',
		resolver: zodResolver(CreateArticleSchema),
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

	const onValidSubmit: SubmitHandler<CreateArticleType> = (data) => {
		mutate(data)
	}

	return (
		<div className='grid grid-cols-6'>
			<FormWrapper
				methods={methods}
				onValidSubmit={onValidSubmit}
				className='col-span-full flex flex-col gap-4 lg:col-span-4'
			>
				<TextAreaInput name='title' />
				<TextAreaInput name='content' rows={5} />
				<Button
					type='submit'
					variant='outlined'
					isLoading={isLoading}
					className='w-fit text-gray-200'
				>
					Create <CreateIcon className='text-lg text-white' />
				</Button>
			</FormWrapper>
		</div>
	)
}

ArticlePage.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<PlainLayout>
			<GlassContainerLayout>{page}</GlassContainerLayout>
		</PlainLayout>
	)
}
