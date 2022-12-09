import {useFormContext} from 'react-hook-form'
import {ErrorMessage} from '@hookform/error-message'
import {capFirstChar} from 'utils/literal'

type InputProps<T> = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	name: keyof T
	label?: string
}

const TextAreaInput = <T,>({
	name,
	label,
	className,
	...props
}: InputProps<T>) => {
	const {
		register,
		formState: {errors},
	} = useFormContext()
	return (
		<div className='flex flex-col'>
			<label htmlFor={name} className='text-light-head'>
				{label ?? capFirstChar(name)}
			</label>
			<textarea
				id={name}
				className={`rounded bg-light-bg/80 py-2 px-4 ${className}`}
				{...register(name)}
				{...props}
			/>
			<ErrorMessage
				name={name}
				errors={errors}
				render={({message}) => (
					<small className='mt-0.5 font-medium text-red-500'>{message}</small>
				)}
			/>
		</div>
	)
}

export default TextAreaInput
