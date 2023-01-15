import React from 'react'
import {Transition, Dialog} from '@headlessui/react'

export default function Modal({
	isOpen,
	setIsOpen,
	children,
}: {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	children: React.ReactNode
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
					<div className='fixed inset-0 bg-black bg-opacity-50' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center py-16 md:px-4 md:py-20'>
						<Transition.Child
							as={React.Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							{children}
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
