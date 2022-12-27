import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {trpc} from 'utils/trpc'
import NavbarLayout from 'layouts/navbar'
import MetaHead from 'components/meta-head'
import {SectionSeparator, TriangleSymbol} from 'components/ornaments'
import {PencilIcon} from '@heroicons/react/24/solid'

import {
	articleCreateSchema,
	type ArticleCreateType,
	type ArticleType,
} from 'types/article'
import QueryWrapper from 'components/query-wrapper'

import FormWrapper from 'components/form-wrapper'
import TextAreaInput from 'components/textarea-input'
import {Button} from 'components/button'

export default function ArticlePage() {
	const articlesQuery = trpc.article.fetchAll.useQuery(undefined, {
		refetchOnMount: false,
	})

	return (
		<>
			<MetaHead
				title='Articles (example) | Create T3 App'
				description='Example on how to build full stack app using extended T3 stack'
				imageUrl={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/images/articles.jpg`}
			/>
			<main className='container mx-auto max-w-screen-lg space-y-8 px-8 pb-10 pt-6 md:pb-8'>
				<h1 className='text-2xl'>Community Blog</h1>
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
			</main>
		</>
	)
}

const Card = ({slug, title, content, createdAt, author}: ArticleType) => {
	return (
		<Link
			href={`./community/${slug}`}
			className={`hover:shadow-bg-light relative col-span-full flex h-72 flex-col overflow-hidden rounded rounded-br-3xl rounded-tl-2xl border-2 border-light-head/25 bg-light-head bg-opacity-20 p-6 pb-4 duration-100 hover:bg-opacity-30 hover:shadow-lg md:col-span-3 lg:col-span-2`}
		>
			<div className='absolute top-0 left-0'>
				<div className='flex rounded-br-xl bg-dark-bg/30 shadow'>
					<div className='flex w-16 items-center justify-center'>
						{/* <StarIcon className='text-sm text-yellow-300' /> */}
					</div>
					<div className='py-0.5 px-4 text-sm text-light-head'>
						<time className='font-body text-sm italic'>
							{dayjs(createdAt).format('MMM D, YYYY')}
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
				{author.image && <div className='float-left mr-2 h-12 w-12' />}
				<h2 className=''>{title}</h2>
				<div className='mt-0.5 flex h-1 items-center gap-2'>
					<div className='h-[1px] w-auto grow rounded-full bg-brand-500/50' />
					<TriangleSymbol className='' />
				</div>
			</div>

			<p className='h-full overflow-hidden pt-4 text-right indent-12 leading-5 text-light-body'>
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
			<SectionSeparator>Create new article</SectionSeparator>
			<div className='mx-auto lg:w-3/4 '>
				<FormWrapper
					methods={methods}
					onValidSubmit={onValidSubmit}
					className='flex flex-col gap-4'
				>
					<TextAreaInput<ArticleCreateType>
						name='title'
						className='h-[5.4em] md:h-[4em] lg:h-[2.5em]'
					/>
					<TextAreaInput<ArticleCreateType>
						name='content'
						className='h-[16em] md:h-[12.8em] lg:h-[10em]'
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
