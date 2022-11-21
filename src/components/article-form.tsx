import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {ErrorMessage} from '@hookform/error-message'

import {trpc} from '@utils/trpc'
import {capFirstChar} from '@utils/literal'

import {ButtonOutlined} from '@components/button'
import {MdCreate as Create} from 'react-icons/md'

import {
	createArticleInputSchema,
	type CreateArticleInputType,
} from '@type/article'

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

	const onSubmit: SubmitHandler<CreateArticleInputType> = (data) => {
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

export default CreateArticleForm
