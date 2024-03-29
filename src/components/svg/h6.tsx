type Props = {
	className?: string
	primaryClassName?: string
	secondaryClassName?: string
}

const H6Icon = ({
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
			d='M501.7 160.1C578.6 163.1 640 226.4 640 304C640 383.5 575.5 448 496 448C416.5 448 352 383.5 352 304C352 265.7 365 228.5 388.1 198.5L487 76.01C498.1 62.21 518.2 59.97 531.1 71.01C545.8 82.05 548 102.2 536.1 115.1L501.7 160.1zM416 304C416 348.2 451.8 384 496 384C540.2 384 576 348.2 576 304C576 259.8 540.2 224 496 224C451.8 224 416 259.8 416 304z'
		/>
		<path
			className={secondaryClassName}
			d='M32 64C49.67 64 64 78.33 64 96V224H256V96C256 78.33 270.3 64 288 64C305.7 64 320 78.33 320 96V416C320 433.7 305.7 448 288 448C270.3 448 256 433.7 256 416V288H64V416C64 433.7 49.67 448 32 448C14.33 448 0 433.7 0 416V96C0 78.33 14.33 64 32 64z'
		/>
	</svg>
)

export default H6Icon
