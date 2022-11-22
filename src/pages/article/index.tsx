import Link from 'next/link'

import {trpc} from '@utils/trpc'

import PlainLayout from 'layouts/plain'
import GlassContainerLayout from 'layouts/glass-container'
import QueryWrapper from '@components/query-wrapper'

import {ArticleType} from '@type/article'

import {
	useForm,
	type SubmitHandler,
	type SubmitErrorHandler,
} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import FormWrapper from '@components/form'
import TextAreaInput from '@components/textarea-input'
import Button from '@components/button'
import {MdCreate as Create} from 'react-icons/md'

import {CreateArticleSchema, type CreateArticleType} from '@type/article'

export default function ArticlePage() {
	const articlesQuery = trpc.article.fetchAll.useQuery()

	return (
		<div className='space-y-8'>
			<h1 className='text-3xl text-gray-50'>Articles</h1>
			<QueryWrapper {...articlesQuery}>
				{(articles) => (
					<div className='grid grid-cols-3 gap-4'>
						{articles.map((article) => (
							<Card key={article.id} {...article} />
						))}
					</div>
				)}
			</QueryWrapper>
			<CreateArticleForm />
		</div>
	)
}

const Card = ({slug, title, content}: ArticleType) => {
	return (
		<Link
			href={`./article/${slug}`}
			className={`hover:glass max-h-72 space-y-4 rounded-lg border-2 border-white/25 bg-white/10 p-6 transition-colors`}
		>
			<h2 className='text-xl text-gray-50'>{title}</h2>
			<p className='text-gray-200 line-clamp-6'>{content}</p>
		</Link>
	)
}
const onInvalid: SubmitErrorHandler<CreateArticleType> = (data) => {
	console.log(data)
}

const CreateArticleForm = () => {
	const methods = useForm<CreateArticleType>({
		mode: 'onTouched',
		resolver: zodResolver(CreateArticleSchema),
	})

	const {mutate} = trpc.article.create.useMutation({
		onError: (error) => {
			alert(JSON.stringify(error.message))
		},
		onSuccess: () => {
			methods.reset()
		},
	})

	const onValid: SubmitHandler<CreateArticleType> = (data) => {
		mutate(data)
	}

	return (
		<div className='grid grid-cols-4'>
			<FormWrapper
				methods={methods}
				onValid={onValid}
				onInvalid={onInvalid}
				className='col-span-full flex flex-col gap-4 md:col-span-2'
			>
				<TextAreaInput name='title' />
				<TextAreaInput name='content' rows={5} />
				<Button
					type='submit'
					variant='outlined'
					className='w-fit text-gray-200'
				>
					Create <Create className='text-lg text-white' />
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
