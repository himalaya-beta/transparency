import {ButtonHTMLAttributes, DetailedHTMLProps} from 'react'

export interface NativeButtonProps
	extends DetailedHTMLProps<
			ButtonHTMLAttributes<HTMLButtonElement>,
			HTMLButtonElement
		>,
		React.AriaAttributes {}

type CustomButtonProps = NativeButtonProps & {
	children: React.ReactNode
	className?: string
	variant: 'filled' | 'outlined'
}

const base =
	'flex items-center gap-2 whitespace-nowrap rounded-xl shadow-lg transition ease-out hover:duration-500 focus:outline-none focus:ring-2 active:translate-y-2 active:shadow-md  active:shadow-purple-200'

const outlined =
	'border-[0.2rem] border-purple-500 px-5 py-2 hover:border-violet-200 hover:bg-white/[0.15] hover:shadow-purple-200/60 focus:border-violet-500 focus:ring-white active:text-white'

const filled =
	'bg-violet-500 px-6 py-2.5 hover:bg-violet-700 hover:shadow-purple-200/80 focus:ring-purple-500 focus:ring-offset-2 active:bg-violet-900'

export default function Button({
	children,
	className,
	variant,
	...props
}: CustomButtonProps) {
	const variantClass = variant === 'outlined' ? outlined : filled

	return (
		<button
			{...props}
			className={`${className} ${base} ${variantClass} disabled:pointer-events-none disabled:border-gray-500 disabled:bg-gray-400 disabled:text-gray-300`}
		>
			{children}
		</button>
	)
}
