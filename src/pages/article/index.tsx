import {MdCreate as Create} from 'react-icons/md'

import {ButtonOutlined} from '@components/button'
import QueryWrapper from '@components/query-wrapper'

import {trpc} from '@utils/trpc'

import Link from 'next/link'
import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {ErrorMessage} from '@hookform/error-message'

import {capFirstChar} from '@utils/literal'

import {
	createArticleInputSchema,
	type ArticleType,
	type CreateArticleInputType,
} from '@type/article'
import PlainLayout from 'layouts/plain'
import GlassContainerLayout from 'layouts/glass-container'

export default function ArticlePage() {
	const articlesQuery = trpc.article.getArticles.useQuery()

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

ArticlePage.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<PlainLayout>
			<GlassContainerLayout>{page}</GlassContainerLayout>
		</PlainLayout>
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

type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	name: keyof CreateArticleInputType
}

const CreateArticleForm = () => {
	const {
		register,
		reset,
		handleSubmit,
		formState: {errors},
	} = useForm<CreateArticleInputType>({
		mode: 'onTouched',
		resolver: zodResolver(createArticleInputSchema),
	})

	const {mutate} = trpc.article.createArticle.useMutation({
		onError: (error) => {
			alert(JSON.stringify(error.message))
		},
		onSuccess: (data) => {
			alert(JSON.stringify(data))
			reset()
		},
	})

	const onSubmit: SubmitHandler<CreateArticleInputType> = async (data) => {
		mutate(data)
	}

	const Input = ({name, ...props}: InputProps) => {
		return (
			<div className='flex flex-col'>
				<label htmlFor={name} className='text-gray-50'>
					{capFirstChar(name)}
				</label>
				<textarea
					id={name}
					className='rounded py-2 px-4 outline-violet-500'
					{...register(name)}
					{...props}
				/>
				<ErrorMessage
					name={name}
					errors={errors}
					render={({message}) => (
						<small className='font-medium text-red-500'>{message}</small>
					)}
				/>
			</div>
		)
	}

	return (
		<div className='grid grid-cols-4'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='col-span-full flex flex-col gap-4 md:col-span-2'
			>
				<Input name='title' />
				<Input name='content' rows={5} />
				<ButtonOutlined className='w-fit text-gray-200' type='submit'>
					Create <Create className='text-lg text-white' />
				</ButtonOutlined>
			</form>
		</div>
	)
}
