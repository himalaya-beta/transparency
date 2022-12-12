/* eslint-disable unicorn/no-null */
import React from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import NavbarTopLayout from 'layouts/navbar'
import QueryWrapper from 'components/query-wrapper'
import FormWrapper from 'components/form-wrapper'
import TextAreaInput from 'components/textarea-input'
import {Button} from 'components/button'
import {SectionSeparator} from 'components/ornaments'
import DivAnimate from 'components/div-animate'
import {
	ChevronDownIcon,
	ChevronUpIcon,
	PencilIcon,
	PlusIcon,
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

const AdminDashboardPage = () => {
	const criteriaListQuery = trpc.criteria.fetchRoot.useQuery()

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
		mode: 'onTouched',
		resolver: zodResolver(criteriaCreateSchema),
	})

	const onCreateCriteria: SubmitHandler<CriteriaCreateType> = (data) => {
		create(data)
	}

	return (
		<div className='container max-w-screen-md space-y-8 px-8 md:mx-auto '>
			<h1 className='text-3xl'>Policy Criteria</h1>
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
					<TextAreaInput<CriteriaCreateType>
						name='value'
						label='Criteria name/ content/ value'
						autoFocus
						wrapperClassName='mt-2'
						inputClassName='mt-1'
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
		mode: 'onTouched',
		resolver: zodResolver(criteriaCreateSchema),
	})
	const updateMethods = useForm<CriteriaUpdateType>({
		mode: 'onTouched',
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
		updateMethods.setValue('parentId', criteria.parentId)
	}
	const onClickAdd = (criteria: CriteriaType) => {
		setAdd(criteria.id)
		setIsExpanded(true)
		setEdit(null)
		createMethods.setValue('parentId', criteria.id)
	}

	const EditForm = ({className}: {className?: string}) => {
		return (
			<FormWrapper
				methods={updateMethods}
				onValidSubmit={onUpdate}
				className={`flex w-full gap-2 ${className}`}
			>
				<TextAreaInput<CriteriaUpdateType>
					name='value'
					rows={2}
					label=''
					wrapperClassName='flex-1'
					inputClassName='pb-3'
					autoFocus
				/>
				<div className='flex flex-col gap-1'>
					<button type='submit'>
						<PencilIcon className='h-8 w-8 rounded-lg bg-blue-500 p-1 text-brand-100 hover:bg-blue-400 active:bg-blue-300' />
					</button>
					<button type='reset' onClick={() => setEdit(null)}>
						<XMarkIcon className='h-8 w-8 rounded-lg bg-orange-400 p-1 text-brand-100 hover:bg-orange-300 active:bg-orange-200' />
					</button>
				</div>
			</FormWrapper>
		)
	}

	return (
		<DivAnimate className='rounded-lg bg-dark-bg/25 py-2 pl-4 pr-2 md:pr-4'>
			{edit === criteria.id ? (
				<EditForm key='main_criteria' />
			) : (
				<div className='flex items-center justify-between gap-2'>
					<h2 className='md:text-xl'>
						{criteria.value}
						{criteria.children.length > 0 && (
							<button
								className='ml-1 rounded-full px-1 pt-0.5 align-middle text-brand-100 hover:bg-brand-200/50 active:bg-brand-200 active:text-brand-500 md:ml-2'
								onClick={() => setIsExpanded(!isExpanded)}
							>
								{isExpanded ? (
									<ChevronUpIcon className='h-6 w-6' />
								) : (
									<ChevronDownIcon className='h-6 w-6' />
								)}
							</button>
						)}
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
			)}

			{criteria.children.length > 0 && isExpanded && (
				<DivAnimate
					className={`
					mt-2 divide-y-[1px] divide-brand-600 divide-opacity-50 rounded-t-md bg-dark-bg/25 
					${add ? '' : 'rounded-b-md'} 
				`}
				>
					{criteria.children.map((child) => {
						return (
							<DivAnimate className='' key={child.id}>
								{edit === child.id ? (
									<EditForm
										className='p-2 pl-4'
										key={`sub_criteria_${child.id}`}
									/>
								) : (
									<div className='flex items-center justify-between  p-2 pl-4'>
										<h3 className='font-normal'>{child.value}</h3>
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
				flex w-full gap-2 rounded-b-md  ${
					criteria.children.length > 0 ? 'bg-dark-bg/25 p-2 pl-4' : 'pt-4'
				}
			`}
				>
					<TextAreaInput<CriteriaUpdateType>
						name='value'
						rows={2}
						label=''
						wrapperClassName='flex-1'
						inputClassName='pb-3'
						autoFocus
					/>
					<div className='flex flex-col gap-1'>
						<button type='submit'>
							<PencilIcon className='h-8 w-8 rounded-lg bg-blue-500 p-1 text-brand-100 hover:bg-blue-400 active:bg-blue-300' />
						</button>
						<button type='reset' onClick={() => setAdd(null)}>
							<XMarkIcon className='h-8 w-8 rounded-lg bg-orange-400 p-1 text-brand-100 hover:bg-orange-300 active:bg-orange-200' />
						</button>
					</div>
				</FormWrapper>
			)}
		</DivAnimate>
	)
}

AdminDashboardPage.getLayout = (page: React.ReactElement) => (
	<NavbarTopLayout>{page}</NavbarTopLayout>
)

export default AdminDashboardPage
