import React from 'react'
import {useController, useFormContext} from 'react-hook-form'

import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'

import {capFirstChar} from 'utils/literal'

import {type CriteriaTypesEnum} from 'types/criteria'

const criteriaTypes: CriteriaType[] = [
	{label: 'True or false', id: 'TRUE_FALSE'},
	{label: 'Explanation', id: 'EXPLANATION'},
]

type CriteriaType = {
	id: CriteriaTypesEnum
	label: string
}

const ListBox = ({
	name,
	label,
	className,
}: {
	name: string
	label?: string
	className?: string
}) => {
	const {control} = useFormContext()
	const {field} = useController({name, control})

	return (
		<Listbox
			as='div'
			defaultValue={criteriaTypes[0]}
			value={field.value}
			onChange={field.onChange}
			name={field.name}
			ref={field.ref}
			onBlur={field.onBlur}
		>
			<div className={`relative ${className}`}>
				<Listbox.Label>{label ?? capFirstChar(name)}</Listbox.Label>
				<Listbox.Button className='relative w-full cursor-default rounded-md bg-light-bg/90 py-2 pl-3 pr-10 text-left shadow-md sm:text-sm'>
					{(data) => (
						<>
							<span className='block truncate text-dark-head'>
								{data.value.label}
							</span>
							<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
								<ChevronUpDownIcon
									className='h-5 w-5 text-brand-400'
									aria-hidden='true'
								/>
							</span>
						</>
					)}
				</Listbox.Button>
				<Transition
					as={React.Fragment}
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-light-bg py-1 text-base shadow-lg ring-1 ring-brand-900 ring-opacity-5 focus:outline-none sm:text-sm'>
						{criteriaTypes.map((type, i) => (
							<Listbox.Option
								key={i}
								className={({active}) => `
									relative cursor-default select-none py-2 pl-10 pr-4 
									${active ? 'bg-brand-100 text-brand-900' : 'text-dark-head'}
								`}
								value={type}
							>
								{({selected}) => (
									<>
										<span
											className={`
												block truncate 
												${selected ? 'font-medium' : 'font-normal'}
											`}
										>
											{type.label}
										</span>
										{selected ? (
											<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-brand-600'>
												<CheckIcon className='h-5 w-5' aria-hidden='true' />
											</span>
										) : undefined}
									</>
								)}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	)
}

export default ListBox
