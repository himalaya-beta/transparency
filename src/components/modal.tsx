import React from 'react'
import {Transition, Dialog} from '@headlessui/react'
import cN from 'clsx'

export default function Modal({
	isOpen,
	setIsOpen,
	children,
	className,
}: {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	children: React.ReactNode
	className?: string
}) {
	return (
		<Transition appear show={isOpen} as={React.Fragment}>
			<Dialog
				as='div'
				className='relative z-10'
				onClose={() => setIsOpen(false)}
			>
				<Transition.Child
					as={React.Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-dark-bg bg-opacity-50' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={React.Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel
								className={cN(
									'container w-full transform overflow-hidden rounded-2xl bg-gradient-to-br from-light-head/75 to-brand-200 p-4 text-left align-middle shadow-xl transition-all',
									className
								)}
							>
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
