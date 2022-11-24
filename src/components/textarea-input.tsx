import {useFormContext} from 'react-hook-form'
import {ErrorMessage} from '@hookform/error-message'
import {capFirstChar} from '@utils/literal'

import {type CreateArticleType} from '@type/article'
type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	name: keyof CreateArticleType
}

const TextAreaInput = ({name, ...props}: InputProps) => {
	const {
		register,
		formState: {errors},
	} = useFormContext()
	return (
		<div className='flex flex-col'>
			<label htmlFor={name} className='text-gray-50'>
				{capFirstChar(name)}
			</label>
			<textarea
				id={name}
				className='rounded bg-gray-200/75 py-2 px-4 '
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

export default TextAreaInput
