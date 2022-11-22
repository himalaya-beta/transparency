import {
	useForm,
	type SubmitHandler,
	type SubmitErrorHandler,
} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {trpc} from '@utils/trpc'

import FormWrapper from './form'
import TextAreaInput from './textarea-input'
import Button from '@components/button'
import {MdCreate as Create} from 'react-icons/md'

import {CreateArticleSchema, type CreateArticleType} from '@type/article'

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

export default CreateArticleForm
