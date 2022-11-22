import {ButtonHTMLAttributes, DetailedHTMLProps} from 'react'
import {MdIncompleteCircle as IncompleteCircleIcon} from 'react-icons/md'

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
	isLoading?: boolean
}

const base =
	'whitespace-nowrap rounded-xl shadow-lg transition ease-out hover:duration-500 focus:outline-none focus:ring-2 active:translate-y-2 active:shadow-md  active:shadow-purple-200'

const outlined =
	'border-[0.2rem] border-purple-500 px-5 py-2 hover:border-violet-200 hover:bg-white/[0.15] hover:shadow-purple-200/60 focus:border-violet-500 focus:ring-white active:text-white'

const filled =
	'bg-violet-500 px-6 py-2.5 hover:bg-violet-700 hover:shadow-purple-200/80 focus:ring-purple-500 focus:ring-offset-2 active:bg-violet-900'

export default function Button({
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
			disabled={isLoading}
			className={`${className} ${base} ${variantClass} relative disabled:pointer-events-none disabled:border-gray-500 disabled:bg-gray-400 disabled:text-gray-300`}
		>
			<span
				className={`${
					isLoading ? 'invisible' : 'visible'
				} flex items-center gap-2`}
			>
				{children}
			</span>
			<span
				className={`${
					!isLoading ? 'invisible' : 'visible'
				} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
			>
				<IncompleteCircleIcon className='animate-spin text-white' />
			</span>
		</button>
	)
}
