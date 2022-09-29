import {WrapperProps} from 'types/component'

export function ButtonOutlined({children, className}: WrapperProps) {
	return (
		<button
			className={`${className} flex items-center gap-2  whitespace-nowrap rounded-xl border-[0.2rem] border-purple-500 px-5 py-2 shadow-lg transition ease-out hover:border-violet-200 hover:bg-white/[0.15] hover:shadow-purple-200/60 hover:duration-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-white active:translate-y-2 active:text-white active:shadow-md active:shadow-purple-200`}
		>
			{children}
		</button>
	)
}

export function ButtonFilled({children, className}: WrapperProps) {
	return (
		<button
			className={`${className} flex items-center gap-2 whitespace-nowrap rounded-xl bg-violet-500 px-6 py-2.5 shadow-lg transition ease-out hover:bg-violet-700 hover:shadow-purple-200/80 hover:duration-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:translate-y-2 active:bg-violet-900 active:shadow-md active:shadow-purple-200 sm:flex`}
		>
			{children}
		</button>
	)
}
