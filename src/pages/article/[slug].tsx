import React from 'react'
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/react'
import {
	type GetStaticPaths,
	type GetStaticProps,
	type InferGetStaticPropsType,
} from 'next'

import {prisma} from 'server/db/client'
import {trpc} from 'utils/trpc'
import {extractIdFromSlug} from 'server/utils/route'

import {
	UpdateArticleSchema,
	type UpdateArticleType,
	type ArticleType,
} from 'types/article'

import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import NavbarTopLayout from 'layouts/navbar'
import MetaHead from 'components/meta-head'
import {
	PencilSquareIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'

import FormWrapper from 'components/form-wrapper'
import TextAreaInput from 'components/textarea-input'
import {Button} from 'components/button'

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
		props: {article},
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

	const {status} = useSession()

	return (
		<>
			<MetaHead
				title={article.title}
				description={article.content}
				imageUrl={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/images/articles.jpg`}
			/>
			<main
				className='container mx-auto max-w-screen-md space-y-8 px-6'
				ref={toggleAnimation}
			>
				{isEdit ? (
					<FormWrapper
						methods={methods}
						onValidSubmit={onValidSubmit}
						className='col-span-full flex flex-col gap-4 md:col-span-2'
					>
						<TextAreaInput<UpdateArticleType> name='title' />
						<TextAreaInput<UpdateArticleType> name='content' rows={10} />

						<div className='flex gap-4'>
							<Button
								type='submit'
								variant='filled'
								isLoading={isUpdateLoading}
							>
								Update <PencilSquareIcon className='h-4 w-4' />
							</Button>
							<Button
								variant='outlined'
								type='reset'
								onClick={() => onCancel()}
							>
								Cancel <XMarkIcon className='h-4 w-4' />
							</Button>
						</div>
					</FormWrapper>
				) : (
					<>
						<h1 className='text-3xl'>{article.title}</h1>
						<p className='text-lg '>{article.content}</p>
						{status === 'authenticated' && (
							<div className='flex gap-4'>
								<Button
									variant='filled'
									isLoading={isDeleteLoading}
									onClick={() => deleteArticle(defaultValues)}
									className='bg-light-bg text-red-500 hover:bg-red-500 hover:text-light-body'
								>
									Delete <TrashIcon className='h-4 w-4' />
								</Button>
								<Button
									variant='filled'
									onClick={() => setIsEdit(true)}
									className='bg-light-bg text-violet-500 hover:bg-violet-500 hover:text-light-body'
								>
									Update <PencilSquareIcon className='h-4 w-4' />
								</Button>
							</div>
						)}
					</>
				)}
			</main>
		</>
	)
}

export default ArticleDetailsPage

ArticleDetailsPage.getLayout = (page: React.ReactElement) => (
	<NavbarTopLayout>{page}</NavbarTopLayout>
)
