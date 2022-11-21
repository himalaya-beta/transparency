import React from 'react'
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next'
import {useRouter} from 'next/router'

import {prisma} from '@server/db/client'
import {trpc} from '@utils/trpc'
import {capFirstChar, extractIdFromSlug} from '@utils/literal'

import PlainLayout from 'layouts/plain'
import GlassContainerLayout from 'layouts/glass-container'
import {ButtonFilled, ButtonOutlined} from '@components/button'
import {
	MdDelete as DeleteIcon,
	MdUpdate as UpdateIcon,
	MdCreate as CreateIcon,
	MdCancel as CancelIcon,
} from 'react-icons/md'

import {
	updateArticleInputSchema,
	type UpdateArticleInputType,
	type ArticleType,
} from '@type/article'
type ArticleSimplifiedType = Omit<ArticleType, 'createdAt' | 'updatedAt'>

import {SubmitErrorHandler, useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {ErrorMessage} from '@hookform/error-message'

type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	name: keyof UpdateArticleInputType
}

export const getStaticProps: GetStaticProps<{
	article: ArticleSimplifiedType
}> = async ({params}) => {
	if (!params?.slug) return {notFound: true}

	const id = extractIdFromSlug(params.slug as string)

	const article = await prisma.article.findUnique({
		where: {id},
		select: {
			id: true,
			slug: true,
			title: true,
			content: true,
		},
	})

	if (!article) return {notFound: true}

	return {
		props: {
			article,
			// cannot send date on json :(
		},
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const articles = await prisma.article.findMany({select: {slug: true}})
	const articleSlugs = articles.map(({slug}) => ({params: {slug}}))

	return {
		paths: articleSlugs,
		fallback: 'blocking',
	}
}

const onInvalid: SubmitErrorHandler<UpdateArticleInputType> = (error) => {
	console.log(error)
}

const ArticleDetailsPage = ({
	article,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter()
	const [isEdit, setIsEdit] = React.useState(false)

	const {mutate: deleteArticle} = trpc.article.deleteArticle.useMutation({
		onError: (err) => alert(err.message),
		onSuccess: () => router.push('/article'),
	})

	const {mutate: updateArticle} = trpc.article.updateArticle.useMutation({
		onError: (err) => alert(err.message),
		onSuccess: () => setIsEdit(false),
	})

	const defaultValues = {
		id: article.id,
		title: article.title,
		content: article.content,
	}

	const {
		register,
		reset,
		handleSubmit,
		formState: {errors},
	} = useForm<UpdateArticleInputType>({
		resolver: zodResolver(updateArticleInputSchema),
		defaultValues,
	})

	const onValid: SubmitHandler<UpdateArticleInputType> = (data) => {
		updateArticle(data)
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
		<div className='space-y-8'>
			{isEdit ? (
				<form
					onSubmit={handleSubmit(onValid, onInvalid)}
					className='col-span-full flex flex-col gap-4 md:col-span-2'
				>
					<Input name='title' />
					<Input name='content' rows={5} />
					<div className='flex gap-4'>
						<ButtonOutlined className='w-fit text-gray-200'>
							Update <CreateIcon className='text-lg text-white' />
						</ButtonOutlined>
						<ButtonOutlined
							className='w-fit text-gray-200'
							onClick={() => {
								reset()
								setIsEdit(false)
							}}
						>
							Cancel <CancelIcon className='text-lg text-white' />
						</ButtonOutlined>
					</div>
				</form>
			) : (
				<>
					<h1 className='text-3xl text-gray-50'>{article.title}</h1>
					<p className='text-white'>{article.content}</p>
					<div className='flex gap-4'>
						<ButtonFilled
							onClick={() => deleteArticle({id: article.id})}
							className='bg-gray-200 text-red-500 hover:bg-red-500 hover:text-gray-200'
						>
							Delete <DeleteIcon />
						</ButtonFilled>
						<ButtonFilled
							onClick={() => setIsEdit(true)}
							className='bg-gray-200 text-violet-500 hover:bg-violet-500 hover:text-gray-200'
						>
							Update <UpdateIcon />
						</ButtonFilled>
					</div>
				</>
			)}
		</div>
	)
}

export default ArticleDetailsPage

ArticleDetailsPage.getLayout = (page: React.ReactElement) => (
	<PlainLayout>
		<GlassContainerLayout>{page}</GlassContainerLayout>
	</PlainLayout>
)
