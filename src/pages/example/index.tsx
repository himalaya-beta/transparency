import {MdCreate as Create} from 'react-icons/md'

import {ButtonOutlined} from '@components/button'
import QueryWrapper from '@components/query-wrapper'

import {trpc} from '@utils/trpc'

import {useForm, type SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {ErrorMessage} from '@hookform/error-message'
import {capFirstChar} from '@utils/literal'

import {
	createExampleInputSchema,
	type ExampleType,
	type createExampleInputType,
} from '@type/example'
import PlainLayout from 'layouts/plain'

export default function ExamplePage() {
	const examplesQuery = trpc.example.getExamples.useQuery()

	return (
		<div className='glass mx-auto max-w-screen-lg space-y-8 rounded-xl bg-red-200/50 p-8'>
			<h1 className='text-3xl text-gray-50'>Examples</h1>
			<QueryWrapper {...examplesQuery}>
				{(examples) => (
					<div className='grid grid-cols-3 gap-4'>
						{examples.map((example) => (
							<Card key={example.id} {...example} />
						))}
					</div>
				)}
			</QueryWrapper>

			<CreateExampleForm />
		</div>
	)
}

ExamplePage.getLayout = function getLayout(page: React.ReactElement) {
	return <PlainLayout>{page}</PlainLayout>
}

const Card = ({title, content}: ExampleType) => {
	return (
		<div
			className={`hover:glass max-h-72 space-y-4 rounded-lg border-2 border-white/25 bg-white/10 p-6 transition-colors`}
		>
			<h2 className='text-xl text-gray-50'>{title}</h2>
			<p className='text-gray-200 line-clamp-6'>{content}</p>
		</div>
	)
}

type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	name: keyof createExampleInputType
}

const CreateExampleForm = () => {
	const {
		register,
		reset,
		handleSubmit,
		formState: {errors},
	} = useForm<createExampleInputType>({
		mode: 'onTouched',
		resolver: zodResolver(createExampleInputSchema),
	})

	const {mutate} = trpc.example.createExample.useMutation({
		onError: (error) => {
			alert(JSON.stringify(error.message))
		},
		onSuccess: (data) => {
			alert(JSON.stringify(data))
			reset()
		},
	})

	const onSubmit: SubmitHandler<createExampleInputType> = async (data) => {
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
