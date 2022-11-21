import React from 'react'
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next'
import {useRouter} from 'next/router'

import {prisma} from '@server/db/client'
import {trpc} from '@utils/trpc'
import {extractIdFromSlug} from '@utils/literal'

import PlainLayout from 'layouts/plain'
import GlassContainerLayout from 'layouts/glass-container'
import {ButtonFilled} from '@components/button'
import {MdDelete as DeleteIcon} from 'react-icons/md'

import {type ArticleType} from '@type/article'
type ArticleSimplifiedType = Omit<ArticleType, 'createdAt' | 'updatedAt'>

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

const ArticleDetailsPage = ({
	article,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	const router = useRouter()

	const {mutate} = trpc.article.deleteArticle.useMutation({
		onError: (err) => alert(err.message),
		onSuccess: () => router.push('/article'),
	})

	return (
		<div className='space-y-8'>
			<h1 className='text-3xl text-gray-50'>{article.title}</h1>
			<p className='text-white'>{article.content}</p>
			<div>
				<ButtonFilled
					onClick={() => mutate({id: article.id})}
					className='bg-gray-200 text-red-500 hover:bg-red-500 hover:text-gray-200'
				>
					Delete <DeleteIcon />
				</ButtonFilled>
			</div>
		</div>
	)
}

export default ArticleDetailsPage

ArticleDetailsPage.getLayout = (page: React.ReactElement) => (
	<PlainLayout>
		<GlassContainerLayout>{page}</GlassContainerLayout>
	</PlainLayout>
)
