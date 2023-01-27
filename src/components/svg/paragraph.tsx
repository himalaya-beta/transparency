type Props = {
	className?: string
	primaryClassName?: string
	secondaryClassName?: string
}

const ParagraphIcon = ({
	className = 'h-5 w-5',
	primaryClassName,
	secondaryClassName,
}: Props) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 448 512'
		className={className}
	>
		<path
			className={primaryClassName}
			d='M448 63.1C448 81.67 433.7 96 416 96H288v352c0 17.67-14.33 32-31.1 32S224 465.7 224 448v-96H198.9c-83.57 0-158.2-61.11-166.1-144.3C23.66 112.3 98.44 32 191.1 32h224C433.7 32 448 46.33 448 63.1z'
		/>
		<path
			className={secondaryClassName}
			d='M384 96v352c0 17.67-14.33 32-31.1 32S320 465.7 320 448V96H384z'
		/>
	</svg>
)

export default ParagraphIcon
