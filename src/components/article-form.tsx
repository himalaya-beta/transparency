import {FormProvider, useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {trpc} from '@utils/trpc'

import Button from '@components/button'
import {MdCreate as Create} from 'react-icons/md'

import {CreateArticleSchema, type CreateArticleType} from '@type/article'
import TextAreaInput from './textarea-input'

const CreateArticleForm = () => {
	const formMethods = useForm<CreateArticleType>({
		mode: 'onTouched',
		resolver: zodResolver(CreateArticleSchema),
	})
	const {reset, handleSubmit} = formMethods

	const {mutate} = trpc.article.create.useMutation({
		onError: (error) => {
			alert(JSON.stringify(error.message))
		},
		onSuccess: () => {
			reset()
		},
	})

	const onSubmit: SubmitHandler<CreateArticleType> = (data) => {
		mutate(data)
	}

	return (
		<div className='grid grid-cols-4'>
			<FormProvider {...formMethods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
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
				</form>
			</FormProvider>
		</div>
	)
}

export default CreateArticleForm
