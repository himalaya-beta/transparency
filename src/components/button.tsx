import Link, {LinkProps} from 'next/link'
import React, {ButtonHTMLAttributes, DetailedHTMLProps} from 'react'
import {ArrowPathIcon as LoadingIcon} from '@heroicons/react/24/outline'

export interface NativeButtonProps
	extends DetailedHTMLProps<
			ButtonHTMLAttributes<HTMLButtonElement>,
			HTMLButtonElement
		>,
		React.AriaAttributes {}

type Extension = {
	children: React.ReactNode
	className?: string
	variant: 'filled' | 'outlined'
	isLoading?: boolean
}
type CustomButtonProps = NativeButtonProps & Extension
type LinkButtonProps = LinkProps & Extension

const disabled =
	'disabled:border-gray-600 disabled:border-2 disabled:bg-gray-400 disabled:cursor-not-allowed'

const base =
	'relative whitespace-nowrap text-light-head w-fit rounded-xl shadow-md transition ease-out focus:outline-none focus:ring-2 active:translate-y-2 active:shadow-md active:shadow-brand-400 disabled:pointer-events-none' +
	disabled

const outlined =
	'border-[0.2rem] border-brand-600 px-5 py-2 hover:border-brand-100 hover:bg-brand-700 hover:shadow-brand-200 focus:border-brand-100 focus:ring-bg-light active:bg-brand-900'

const filled =
	'bg-brand-500 px-6 py-2.5 hover:bg-brand-400 hover:text-brand-900 hover:shadow-brand-200 ring-brand-600 hover:ring ring-offset-2 active:bg-brand-300'

function Children({
	isLoading,
	children,
}: {
	isLoading: boolean
	children: React.ReactNode
}) {
	return (
		<>
			<span
				className={`
					flex items-center gap-2
					${isLoading ? 'invisible' : 'visible'}
				`}
			>
				{children}
			</span>
			<span
				className={`
					absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
					${isLoading ? 'visible' : 'invisible'} 
				`}
			>
				<LoadingIcon className='h-6 w-6 animate-spin text-light-head' />
			</span>
		</>
	)
}

export function Button({
	children,
	className,
	variant,
	isLoading = false,
	...props
}: CustomButtonProps) {
	const variantClass = variant === 'outlined' ? outlined : filled

	return (
		<button
			{...props}
			disabled={isLoading || props.disabled}
			className={`${className} ${base} ${variantClass}`}
		>
			<Children isLoading={isLoading}>{children}</Children>
		</button>
	)
}

export const IconButton = ({
	children,
	className,
	...props
}: Omit<CustomButtonProps, 'variant'>) => {
	return (
		<button
			className={`mr-0.5 rounded-full p-0.5 align-middle text-brand-400 transition-all hover:bg-brand-200/75 hover:text-brand-500 active:bg-brand-200 active:text-brand-600 md:mt-1 ${className}`}
			{...props}
		>
			{children}
		</button>
	)
}

export function LinkButton({
	children,
	className,
	variant,
	isLoading = false,
	...props
}: LinkButtonProps) {
	const variantClass = variant === 'outlined' ? outlined : filled

	return (
		<Link {...props} className={`${className} ${base} ${variantClass}`}>
			<Children isLoading={isLoading}>{children}</Children>
		</Link>
	)
}
