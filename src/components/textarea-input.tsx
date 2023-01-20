import React from 'react'
import {useFormContext} from 'react-hook-form'
import {ErrorMessage} from '@hookform/error-message'
import {capFirstChar, slugify} from 'utils/literal'
import cN from 'clsx'

type InputProps<T> = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	name: keyof T
	label?: string
	wrapperClassName?: string
	labelClassName?: string
	inputClassName?: string
	errorClassName?: string
	autoGrow?: boolean
}

const TextAreaInput = <T,>({
	name,
	label,
	wrapperClassName,
	labelClassName,
	inputClassName,
	errorClassName,
	autoGrow = true,
	...props
}: InputProps<T>) => {
	const {
		register,
		formState: {errors},
	} = useFormContext()

	React.useEffect(() => {
		const textarea = document.querySelector(
			`#${slugify(name)}`
		) as HTMLTextAreaElement
		const resizeHeight = () => {
			textarea.style.height = 'auto'
			textarea.style.overflow = 'hidden'
			textarea.style.height = `${textarea.scrollHeight}px`
		}

		if (autoGrow) {
			textarea.addEventListener('input', resizeHeight)
		}
		return () => {
			textarea.removeEventListener('input', resizeHeight)
		}
	}, [autoGrow, name])

	return (
		<div className={`flex flex-col ${wrapperClassName ?? ''}`}>
			<label htmlFor={name} className={labelClassName ?? ''}>
				{label ?? capFirstChar(name)}
			</label>
			<textarea
				id={slugify(name)}
				{...register(name)}
				{...props}
				className={cN(
					'resize-none rounded bg-light-bg py-2 px-4 text-black',
					inputClassName
				)}
			/>
			<ErrorMessage
				name={name}
				errors={errors}
				render={({message}) => (
					<small
						className={`mt-0.5 font-medium text-red-500 ${
							errorClassName ?? ''
						}`}
					>
						{message}
					</small>
				)}
			/>
		</div>
	)
}

export default TextAreaInput
