/* eslint-disable unicorn/no-useless-undefined */
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {trpc} from 'utils/trpc'
import {useDebounceState} from 'utils/hooks/use-debounce'
import {slugify, truncate} from 'utils/literal'

import NavbarLayout from 'layouts/navbar'
import {
	LoadingPlaceholder,
	ErrorPlaceholder,
	EmptyPlaceholder,
} from 'components/query-wrapper'
import DataInfiniteWrapper from 'components/query-infinite-wrapper'
import DivAnimate from 'components/div-animate'
import Modal from 'components/modal'
import {TextAreaInputNew} from 'components/textarea-input'
import {Button, IconButton} from 'components/button'
import {
	PlusIcon,
	PencilIcon,
	TrashIcon,
	ArrowPathIcon,
	XMarkIcon,
	ArrowTopRightOnSquareIcon,
	PhotoIcon,
} from '@heroicons/react/24/outline'

import {type NextPageWithLayout} from './_app'
import {
	articleCreateSchema,
	ArticleCreateType,
	type ArticleType,
} from 'types/article'
import {type SubmitHandler} from 'react-hook-form'
import {type RichTextProps} from 'components/rich-text'

const RichTextEditor = dynamic<RichTextProps<ArticleCreateType>>(
	() => import('components/rich-text'),
	{
		loading: () => <LoadingPlaceholder label='editor' />,
		ssr: false,
	}
)

const MyArticlePage: NextPageWithLayout = () => {
	const router = useRouter()
	const {data: auth, status} = useSession()
	const invalidate = trpc.useContext().article.fetchAll.invalidate

	const [isCreate, setIsCreate] = React.useState(false)
	const [edit, setEdit] = React.useState<
		Pick<ArticleType, 'id' | 'authorId' | 'title' | 'content'> | undefined
	>(undefined)

	const [searchQuery, setSearchQuery] = useDebounceState<string>('', 350)
	const {hasNextPage, fetchNextPage, data, isLoading, isError, error, refetch} =
		trpc.article.fetchAll.useInfiniteQuery(
			{query: searchQuery, own: true},
			{
				staleTime: 60_000,
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			}
		)

	const {
		register,
		control,
		formState: {errors},
		handleSubmit,
		reset,
		setValue,
		watch,
	} = useForm<ArticleCreateType>({
		resolver: zodResolver(articleCreateSchema),
		shouldUnregister: true,
	})
	const titleF = watch('title')
	const contentHighlightF = watch('contentHighlight')
	const headerImageF = watch('headerImage')

	const {mutate: create, isLoading: isCreating} =
		trpc.article.create.useMutation({
			onError: (error) => alert(error.message),
			onSuccess: () => {
				invalidate()
				reset()
				setIsCreate(false)
			},
		})
	const {mutate: update, isLoading: isUpdating} =
		trpc.article.update.useMutation({
			onError: (error) => alert(error.message),
			onSuccess: () => {
				invalidate()
				reset()
				setEdit(undefined)
			},
		})
	const {mutate: remove, isLoading: isRemoving} =
		trpc.article.delete.useMutation({
			onError: (err) => alert(err.message),
			onSuccess: () => invalidate(),
		})

	const onValidSubmit: SubmitHandler<ArticleCreateType> = (data) => {
		if (isCreate) {
			create(data)
		} else if (edit) {
			update({id: edit.id, authorId: edit.authorId, ...data})
		}
	}

	React.useEffect(() => {
		if (status === 'unauthenticated') {
			router.replace('/community')
		}
	}, [status, router])

	if (status === 'loading')
		return (
			<main className='container mx-auto max-w-screen-md space-y-8 px-5 pt-8 md:px-8'>
				<LoadingPlaceholder label='authentication' />
			</main>
		)
	return (
		<>
			<Head>
				<title>My Articles | Transparency</title>
			</Head>
			<main className='container space-y-8 px-5 pt-8 md:px-8'>
				<div className='mx-auto max-w-screen-md space-y-2'>
					<div className='flex gap-2'>
						<h1 className='text-2xl'>Your Articles</h1>
						<IconButton onClick={() => void setIsCreate(true)}>
							<PlusIcon className='w-6 text-brand-300' />
						</IconButton>
					</div>
					<input
						className='h-10 w-full flex-1 rounded rounded-tl-lg rounded-br-2xl bg-gradient-to-br from-white via-brand-100 to-brand-300 py-2 px-3 placeholder:font-body placeholder:text-sm placeholder:italic md:w-1/2'
						onChange={(e) => void setSearchQuery(e.target.value)}
						placeholder='search by title or content...'
					/>
				</div>

				<DivAnimate className='mx-auto max-w-screen-md '>
					{isLoading ? (
						<LoadingPlaceholder label='articles' />
					) : isError ? (
						<ErrorPlaceholder error={error} refetch={refetch} />
					) : data.pages[0]?.items.length === 0 ? (
						<EmptyPlaceholder label='articles' />
					) : (
						<DataInfiniteWrapper
							name='user_article'
							className='flex flex-col gap-2'
							keys={[auth?.user.id ?? '']}
							{...{hasNextPage, fetchNextPage, data}}
						>
							{({
								id,
								title,
								content,
								authorId,
								contentHighlight,
								headerImage,
							}) => (
								<div
									key={id}
									className='flex items-center justify-between gap-2 rounded-lg rounded-t-lg bg-dark-bg/25 from-brand-900 to-brand-800 py-3 pl-5 pr-4 shadow transition-all hover:scale-105 hover:bg-gradient-to-br hover:shadow-lg'
								>
									<div className='flex flex-col'>
										<Link href={`/community/${slugify(title, id)}`}>
											<h2 className='group text-lg hover:cursor-pointer hover:underline'>
												{truncate(title, 60)}
												<ArrowTopRightOnSquareIcon className='ml-1 hidden w-5 group-hover:inline ' />
											</h2>
										</Link>
										{/* <pre className='text-sm'>{truncate(content, 80)}</pre> */}
									</div>

									<div className='item-center flex divide-x-2 '>
										<button
											onClick={() => {
												setValue('title', title)
												setValue('content', content)
												setValue('contentHighlight', contentHighlight)
												setValue('headerImage', headerImage)

												setEdit({id, authorId, title, content})
											}}
										>
											<PencilIcon className='h-8 w-8 rounded-l-lg bg-brand-100/75 p-1 text-brand-800 transition-colors duration-200 hover:bg-brand-200 active:bg-brand-300 md:h-10 md:w-10 md:p-2' />
										</button>
										<button
											disabled={isRemoving}
											onClick={() => remove({id, authorId})}
											className='rounded-r-lg bg-brand-100/75 p-1 text-red-700 transition-colors duration-200 hover:bg-brand-200 active:bg-brand-300 disabled:cursor-not-allowed disabled:bg-gray-400 md:h-10 md:w-10 md:p-1.5'
										>
											{isRemoving ? (
												<ArrowPathIcon className='w-6 animate-spin text-white' />
											) : (
												<TrashIcon className='h-6' />
											)}
										</button>
									</div>
								</div>
							)}
						</DataInfiniteWrapper>
					)}
				</DivAnimate>

				<Modal
					isOpen={isCreate || !!edit}
					setIsOpen={setIsCreate}
					className='max-w-screen-lg'
				>
					<form
						onSubmit={handleSubmit(onValidSubmit)}
						className='flex flex-col gap-4 rounded-lg bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-6'
					>
						<TextAreaInputNew
							name='title'
							register={register}
							errors={errors}
							inputClassName='bg-white text-2xl md:text-3xl lg:text-4xl font-bold font-heading'
						/>
						<RichTextEditor
							control={control}
							name='content'
							containerClassName='max-h-[75vh] overflow-y-auto rounded'
							menuClassName='sticky top-0 z-10'
							editorClassName='w-full'
						/>
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-4'>
								<TextAreaInputNew
									name='contentHighlight'
									label='Content highlight (summary)'
									rows={4}
									autoGrow={false}
									register={register}
									errors={errors}
								/>
								<TextAreaInputNew
									name='headerImage'
									label='Image for header & link share preview'
									autoGrow={false}
									register={register}
									errors={errors}
								/>
							</div>
							<div className='flex px-8'>
								<div className='flex w-full flex-col rounded-xl border-2 border-gray-300 bg-white '>
									<div className='flex  flex-1 items-center justify-center rounded-t-lg bg-gray-200'>
										{headerImageF ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={headerImageF}
												alt='Image'
												className='h-36 w-full rounded-t-lg object-cover'
											/>
										) : (
											<PhotoIcon className='w-12' />
										)}
									</div>
									<div className='h-24 border-t border-gray-300 p-3 text-sm'>
										<p className='text-dark-body/75'>
											{process.env.NEXT_PUBLIC_VERCEL_URL ?? 'transparency.com'}
										</p>
										<p className='text-black line-clamp-1'>{titleF}</p>
										<p className='leading-4 text-dark-body/75 line-clamp-2'>
											{contentHighlightF ?? 'Fill the content highlight'}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className='flex gap-2'>
							<Button
								type='submit'
								variant='filled'
								isLoading={isCreating || isUpdating}
							>
								{isCreate ? (
									<>
										Publish <PencilIcon className='w-5' />
									</>
								) : (
									<>
										Update <PencilIcon className='w-5' />
									</>
								)}
							</Button>
							<Button
								type='reset'
								variant='outlined'
								onClick={() => {
									setIsCreate(false)
									setEdit(undefined)
									reset()
								}}
								disabled={isCreating || isUpdating}
							>
								Cancel <XMarkIcon className='w-5' />
							</Button>
						</div>
					</form>
				</Modal>
			</main>
		</>
	)
}

MyArticlePage.getLayout = (page) => <NavbarLayout>{page}</NavbarLayout>

export default MyArticlePage
