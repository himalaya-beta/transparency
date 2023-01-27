type Props = {
	className?: string
	primaryClassName?: string
	secondaryClassName?: string
}

const H3Icon = ({
	className = 'h-5 w-5',
	primaryClassName,
	secondaryClassName,
}: Props) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 640 512'
		className={className}
	>
		<path
			className={primaryClassName}
			d='M523.9 211.7l91.03-93.38c8.984-9.219 11.58-22.91 6.578-34.78C616.5 71.73 604.9 64.01 592 64.01l-192-.0778c-17.67 0-32 14.39-32 32.08s14.33 32 32 32h116.1l-91.02 93.34c-8.984 9.219-11.58 22.91-6.578 34.78C423.5 267.1 435.1 275.7 448 275.7h73.84C551.7 275.7 576 299.1 576 329.9s-24.3 54.16-54.16 54.16h-62.53c-13.16 0-24.8-8.375-28.95-20.88c-5.578-16.75-23.69-25.88-40.48-20.22c-16.77 5.594-25.83 23.72-20.23 40.47c12.89 38.66 48.94 64.63 89.67 64.63h62.53C587 448 640 395 640 329.9C640 265.4 588.1 212.8 523.9 211.7z'
		/>
		<path
			className={secondaryClassName}
			d='M288 64.01c-17.67 0-32 14.31-32 32v128H64v-128c0-17.69-14.33-32-32-32s-32 14.31-32 32v320c0 17.69 14.33 32 32 32s32-14.31 32-32v-128h192v128c0 17.69 14.33 32 32 32s32-14.31 32-32v-320C320 78.33 305.7 64.01 288 64.01z'
		/>
	</svg>
)

export default H3Icon
