/* eslint-disable unicorn/no-null */
import React from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import QueryWrapper from 'components/query-wrapper'
import FormWrapper from 'components/form-wrapper'
import TextAreaInput from 'components/textarea-input'
import {Button} from 'components/button'
import {SectionSeparator} from 'components/ornaments'
import DivAnimate from 'components/div-animate'
import {
	DocumentTextIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	PencilIcon,
	PlusIcon,
	ShieldCheckIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'
import {
	PencilIcon as PencilIconSolid,
	TrashIcon as TrashIconSolid,
} from '@heroicons/react/24/solid'

import {trpc} from 'utils/trpc'

import {
	criteriaCreateSchema,
	criteriaUpdateSchema,
	type CriteriaUpdateType,
	type CriteriaCreateType,
	type CriteriaType,
} from 'types/criteria'
import ListBox from 'components/list-box'

const CriteriaSection = () => {
	const criteriaListQuery = trpc.criteria.fetchRoot.useQuery({noParent: true})

	const {mutate: create} = trpc.criteria.create.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: () => {
			createMethods.reset()
			criteriaListQuery.refetch()
		},
	})

	const createMethods = useForm<CriteriaCreateType>({
		resolver: zodResolver(criteriaCreateSchema),
	})

	const onCreateCriteria: SubmitHandler<CriteriaCreateType> = (data) => {
		create({...data, order: criteriaListQuery.data?.length ?? 0})
	}

	React.useEffect(() => {
		createMethods.setValue('type', 'TRUE_OR_FALSE')
		createMethods.setValue('order', 0)
	}, [createMethods])

	return (
		<div className='space-y-8'>
			<QueryWrapper {...criteriaListQuery}>
				{(criterias) => (
					<div className='space-y-1'>
						{criterias.map((criteria) => (
							<CriteriaCard
								key={criteria.id}
								criteria={criteria}
								refetch={criteriaListQuery.refetch}
							/>
						))}
					</div>
				)}
			</QueryWrapper>

			<div>
				<SectionSeparator>Create New</SectionSeparator>
				<FormWrapper
					methods={createMethods}
					onValidSubmit={onCreateCriteria}
					className='space-y-4'
				>
					<ListBox
						label='Type'
						setValue={(value) => createMethods.setValue('type', value)}
					/>

					<TextAreaInput<CriteriaCreateType>
						name='value'
						label='Criteria name/ content/ value'
					/>
					<Button type='submit' variant='filled'>
						Submit
					</Button>
				</FormWrapper>
			</div>
		</div>
	)
}

const CriteriaCard = ({
	criteria,
	refetch,
}: {
	criteria: CriteriaType
	refetch: () => void
}) => {
	const [isExpanded, setIsExpanded] = React.useState(false)
	const [edit, setEdit] = React.useState<string | null>(null)
	const [add, setAdd] = React.useState<string | null>(null)

	const {mutate: create} = trpc.criteria.create.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: (data) => {
			createMethods.setFocus('value')
			createMethods.reset({value: '', parentId: data.parentId})
			refetch()
		},
	})
	const {mutate: update} = trpc.criteria.update.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: () => {
			updateMethods.reset()
			refetch()
			setEdit(null)
		},
	})
	const {mutate: remove} = trpc.criteria.delete.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: () => {
			refetch()
		},
	})

	const createMethods = useForm<CriteriaCreateType>({
		resolver: zodResolver(criteriaCreateSchema),
	})
	const updateMethods = useForm<CriteriaUpdateType>({
		resolver: zodResolver(criteriaUpdateSchema),
	})

	const onCreate: SubmitHandler<CriteriaCreateType> = (data) => {
		create(data)
	}
	const onUpdate: SubmitHandler<CriteriaUpdateType> = (data) => {
		if (edit) {
			update({...data, id: edit})
		}
	}

	const onClickEdit = (criteria: Omit<CriteriaType, 'children'>) => {
		setEdit(criteria.id)
		setAdd(null)
		updateMethods.setValue('id', criteria.id)
		updateMethods.setValue('value', criteria.value)
		updateMethods.setValue('order', criteria.order)
		updateMethods.setValue('parentId', criteria.parentId)
		updateMethods.setValue('type', criteria.type)
	}
	const onClickAdd = (criteria: CriteriaType) => {
		setAdd(criteria.id)
		setIsExpanded(true)
		setEdit(null)
		createMethods.setValue('order', criteria.children.length)
		createMethods.setValue('parentId', criteria.id)
		createMethods.setValue('type', 'TRUE_OR_FALSE')
	}

	const EditForm = ({className}: {className?: string}) => {
		return (
			<FormWrapper
				methods={updateMethods}
				onValidSubmit={onUpdate}
				className={`flex w-full flex-col gap-2 md:flex-row ${className}`}
			>
				<TextAreaInput<CriteriaUpdateType>
					name='value'
					rows={2}
					label=''
					wrapperClassName='flex-1'
					inputClassName='pb-5'
					autoFocus
				/>
				<div className='flex gap-2 md:flex-col'>
					<ListBox
						label=''
						setValue={(value) => updateMethods.setValue('type', value)}
						className='w-40'
					/>
					<div className='flex flex-1 gap-2'>
						<button
							type='submit'
							className='flex-1 rounded-lg bg-blue-500 hover:bg-blue-400 active:bg-blue-300'
						>
							<PencilIcon className='mx-auto h-8 w-8 p-1 text-brand-100' />
						</button>
						<button
							type='reset'
							onClick={() => setEdit(null)}
							className='flex-1 rounded-lg bg-orange-400 hover:bg-orange-300 active:bg-orange-200'
						>
							<XMarkIcon className='mx-auto h-8 w-8 p-1 text-brand-100' />
						</button>
					</div>
				</div>
			</FormWrapper>
		)
	}

	const haveChildren = criteria.children.length > 0
	const handleExpand = () => {
		if (haveChildren) {
			if (isExpanded) {
				setAdd(null)
			}
			setIsExpanded(!isExpanded)
		}
	}

	return (
		<DivAnimate className='rounded-lg bg-dark-bg/25 p-2 pt-2'>
			{edit === criteria.id ? (
				<EditForm key='main_criteria' className='pr-0 md:py-2 md:pl-2' />
			) : (
				<div className='flex items-start'>
					{haveChildren ? (
						<button
							onClick={handleExpand}
							className='mr-0.5 rounded-full p-0.5 align-middle text-brand-400 hover:bg-brand-200/75 hover:text-brand-500 active:bg-brand-200 active:text-brand-600 md:mt-1'
						>
							{isExpanded ? (
								<ChevronUpIcon className='h-6 w-6' />
							) : (
								<ChevronDownIcon className='h-6 w-6' />
							)}
						</button>
					) : (
						<div className='inline-block h-full w-8' />
					)}
					<div className='flex flex-1 items-center justify-between gap-2'>
						<h2
							className={`

								leading-5 md:text-xl md:leading-none
								${haveChildren ? 'hover:cursor-pointer' : ''} 
							`}
							onClick={handleExpand}
						>
							<span className='mr-2'>{criteria.value}</span>
							<span className='space-x-1'>
								{criteria.type.includes('TRUE_OR_FALSE') && (
									<ShieldCheckIcon className='inline h-5 w-5 text-brand-100' />
								)}
								{criteria.type.includes('EXPLANATION') && (
									<DocumentTextIcon className='inline h-5 w-5 text-brand-100' />
								)}
							</span>
						</h2>
						<div className='item-center flex'>
							<button onClick={() => onClickAdd(criteria)}>
								<PlusIcon className='h-8 w-8 rounded-l-lg bg-brand-100/50 p-1 text-brand-800 transition-colors duration-200 hover:bg-brand-200 active:bg-brand-300 md:h-10 md:w-10 md:p-2' />
							</button>
							<button onClick={() => onClickEdit(criteria)}>
								<PencilIcon className='h-8 w-8 border-l-[1px] border-r-[1px] border-brand-100/25 bg-brand-100/50 p-1 text-blue-700 transition-colors duration-200 hover:bg-brand-200 active:bg-brand-300 md:h-10 md:w-10 md:p-2' />
							</button>
							<button onClick={() => remove({id: criteria.id})}>
								<TrashIcon className='h-8 w-8 rounded-r-lg bg-brand-100/50 p-1 text-red-700 transition-colors duration-200 hover:bg-brand-200 active:bg-brand-300 md:h-10 md:w-10 md:p-2' />
							</button>
						</div>
					</div>
				</div>
			)}

			<DivAnimate className=''>
				{haveChildren && isExpanded && (
					<DivAnimate
						className={`
							mt-2 divide-y-[1px] divide-brand-600 divide-opacity-50 rounded-t-md bg-dark-bg/25 md:ml-8 
							${add ? '' : 'rounded-b-md'} 
						`}
					>
						{criteria.children.map((child) => {
							return (
								<DivAnimate className='' key={child.id}>
									{edit === child.id ? (
										<EditForm
											className='p-2 md:py-3 md:pl-4'
											key={`sub_criteria_${child.id}`}
										/>
									) : (
										<div className='flex items-center justify-between p-2 pl-3 md:pl-4'>
											<h3 className='font-normal'>
												{child.value}
												<span className='ml-2 space-x-0.5'>
													{child.type.includes('TRUE_OR_FALSE') && (
														<ShieldCheckIcon className='inline h-5 w-5 align-text-top text-brand-100' />
													)}
													{child.type.includes('EXPLANATION') && (
														<DocumentTextIcon className='inline h-5 w-5 align-text-top text-brand-100' />
													)}
												</span>
											</h3>
											<div className='item-center flex gap-4'>
												<button onClick={() => onClickEdit(child)}>
													<PencilIconSolid className='h-6 w-6 p-0.5 text-blue-500 text-opacity-50 transition-colors duration-200 hover:text-opacity-100 active:text-blue-400' />
												</button>
												<button onClick={() => remove({id: child.id})}>
													<TrashIconSolid className='h-6 w-6 p-0.5 text-red-500 text-opacity-50 transition-colors duration-200 hover:text-opacity-100  active:text-red-400' />
												</button>
											</div>
										</div>
									)}
								</DivAnimate>
							)
						})}
					</DivAnimate>
				)}

				{add === criteria.id && (
					<FormWrapper
						methods={createMethods}
						onValidSubmit={onCreate}
						className={`
							flex flex-col gap-2 rounded-b-md md:ml-8 md:flex-row md:pb-3 md:pl-4  
							${haveChildren ? 'bg-dark-bg/25 p-2' : 'pt-4'}
						`}
					>
						<TextAreaInput<CriteriaUpdateType>
							name='value'
							rows={2}
							label=''
							wrapperClassName='flex-1'
							inputClassName='pb-5'
							autoFocus
						/>
						<div className='flex gap-2 md:flex-col'>
							<ListBox
								label=''
								setValue={(value) => createMethods.setValue('type', value)}
								className='w-40'
							/>
							<div className='flex flex-1 gap-2'>
								<button
									type='submit'
									className='flex-1 rounded-lg bg-blue-500 hover:bg-blue-400 active:bg-blue-300'
								>
									<PencilIcon className='mx-auto h-8 w-8 p-1 text-brand-100' />
								</button>
								<button
									type='reset'
									onClick={() => setAdd(null)}
									className='flex-1 rounded-lg bg-orange-400 hover:bg-orange-300 active:bg-orange-200'
								>
									<XMarkIcon className='mx-auto h-8 w-8 p-1 text-brand-100' />
								</button>
							</div>
						</div>
					</FormWrapper>
				)}
			</DivAnimate>
		</DivAnimate>
	)
}

export default CriteriaSection