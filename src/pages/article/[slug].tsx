import React from 'react'
import {useRouter} from 'next/router'
import {
	type GetStaticPaths,
	type GetStaticProps,
	type InferGetStaticPropsType,
} from 'next'

import {prisma} from '@server/db/client'
import {trpc} from '@utils/trpc'
import {extractIdFromSlug} from '@server/utils/route'

import PlainLayout from 'layouts/nav-top'
import GlassContainerLayout from 'layouts/glass-container'
import Button from '@components/button'
import {
	MdDelete as DeleteIcon,
	MdUpdate as UpdateIcon,
	MdCreate as CreateIcon,
	MdCancel as CancelIcon,
} from 'react-icons/md'

import {
	UpdateArticleSchema,
	type UpdateArticleType,
	type ArticleType,
} from '@type/article'

import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import FormWrapper from '@components/form-wrapper'
import TextAreaInput from '@components/textarea-input'
import {useAutoAnimate} from '@formkit/auto-animate/react'

export const getStaticProps: GetStaticProps<{
	article: ArticleType
}> = async ({params}) => {
	if (!params?.slug) return {notFound: true}

	const id = extractIdFromSlug(params.slug as string)

	const article = await prisma.article.findUnique({
		where: {id},
		include: {author: {select: {name: true, image: true}}},
	})

	if (!article) return {notFound: true}

	return {
		props: {
			article,
		},
		revalidate: true,
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

const ArticleDetailsPage = ({
	article,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter()
	const [isEdit, setIsEdit] = React.useState(false)

	const {mutate: deleteArticle, isLoading: isDeleteLoading} =
		trpc.article.delete.useMutation({
			onError: (err) => alert(err.message),
			onSuccess: () => router.push('/article'),
		})

	const {mutate: updateArticle, isLoading: isUpdateLoading} =
		trpc.article.update.useMutation({
			onError: (err) => alert(err.message),
			onSuccess: () => {
				router.push('/article')
			},
		})

	const defaultValues = {
		id: article.id,
		title: article.title,
		content: article.content,
		authorId: article.authorId,
	}

	const methods = useForm<UpdateArticleType>({
		resolver: zodResolver(UpdateArticleSchema),
		defaultValues,
	})

	const onValidSubmit: SubmitHandler<UpdateArticleType> = (data) => {
		updateArticle(data)
	}

	const onCancel = () => {
		methods.reset()
		setIsEdit(false)
	}

	const [toggleAnimation] = useAutoAnimate<HTMLDivElement>()

	return (
		<div className='space-y-8' ref={toggleAnimation}>
			{isEdit ? (
				<FormWrapper
					methods={methods}
					onValidSubmit={onValidSubmit}
					className='col-span-full flex flex-col gap-4 md:col-span-2'
				>
					<TextAreaInput name='title' />
					<TextAreaInput name='content' rows={5} />

					<div className='flex gap-4'>
						<Button
							type='submit'
							variant='outlined'
							isLoading={isUpdateLoading}
							className='w-fit text-gray-200'
						>
							Update <CreateIcon className='text-lg text-white' />
						</Button>
						<Button
							variant='outlined'
							type='reset'
							className='w-fit text-gray-200'
							onClick={() => onCancel()}
						>
							Cancel <CancelIcon className='text-lg text-white' />
						</Button>
					</div>
				</FormWrapper>
			) : (
				<>
					<h1 className='text-3xl text-gray-50'>{article.title}</h1>
					<p className='text-white'>{article.content}</p>
					<div className='flex gap-4'>
						<Button
							variant='filled'
							isLoading={isDeleteLoading}
							onClick={() => deleteArticle(defaultValues)}
							className='bg-gray-200 text-red-500 hover:bg-red-500 hover:text-gray-200'
						>
							Delete <DeleteIcon />
						</Button>
						<Button
							variant='filled'
							onClick={() => setIsEdit(true)}
							className='bg-gray-200 text-violet-500 hover:bg-violet-500 hover:text-gray-200'
						>
							Update <UpdateIcon />
						</Button>
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
