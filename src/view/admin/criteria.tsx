/* eslint-disable unicorn/no-null */
import React from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import QueryWrapper from 'components/query-wrapper'
import FormWrapper from 'components/form-wrapper'
import TextAreaInput from 'components/textarea-input'
import DivAnimate from 'components/div-animate'
import {Button, IconButton} from 'components/button'
import {SectionSeparator} from 'components/ornaments'
import {
	Bars3BottomLeftIcon,
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
	type CriteriaUpdateType,
	type CriteriaType,
} from 'types/criteria'
import ListBox from 'components/list-box'
import {z} from 'zod'

const typeListOptionsSchema = z.object({
	id: z.enum(['TRUE_FALSE', 'EXPLANATION']),
	label: z.string(),
})
const formSchema = criteriaCreateSchema.omit({type: true}).merge(
	z.object({
		type: typeListOptionsSchema,
	})
)
type FormType = z.infer<typeof formSchema>

const CriteriaSection = () => {
	const createMethods = useForm<FormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {order: 0, type: {id: 'TRUE_FALSE', label: 'True or false'}},
	})

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

	const onCreateCriteria: SubmitHandler<FormType> = (data) => {
		create({
			...data,
			type: data.type.id,
			order: criteriaListQuery.data?.length ?? 0,
		})
	}

	return (
		<>
			<h1 className='text-2xl'>
				Policy criteria
				<IconButton
					className='ml-2 align-bottom'
					onClick={() => createMethods.setFocus('value')}
				>
					<PlusIcon className='h-6 w-6 text-brand-300' />
				</IconButton>
			</h1>

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
					<SectionSeparator>Create new</SectionSeparator>
					<FormWrapper
						methods={createMethods}
						onValidSubmit={onCreateCriteria}
						className='space-y-4'
					>
						<ListBox name='type' />

						<TextAreaInput<FormType>
							name='value'
							label='Criteria name/ content/ value'
						/>
						<Button type='submit' variant='filled'>
							Submit
						</Button>
					</FormWrapper>
				</div>
			</div>
		</>
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
	const haveChildren = criteria.children.length > 0

	const createMethods = useForm<FormType>({
		resolver: zodResolver(formSchema),
	})
	const updateMethods = useForm<FormType & {id: string}>({
		resolver: zodResolver(formSchema.extend({id: z.string()})),
	})

	const {mutate: create} = trpc.criteria.create.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: (data) => {
			createMethods.resetField('order', {defaultValue: data.order + 1})
			createMethods.resetField('value', {defaultValue: ''})
			createMethods.setFocus('value')
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

	const onCreate: SubmitHandler<FormType> = (data) => {
		create({...data, type: data.type.id})
	}
	const onUpdate: SubmitHandler<FormType & {id: string}> = (data) => {
		if (edit) {
			update({...data, type: data.type.id, id: edit})
		}
	}
	const onClickEdit = (criteria: Omit<CriteriaType, 'children'>) => {
		setEdit(criteria.id)
		setAdd(null)
		updateMethods.setValue('id', criteria.id)
		updateMethods.setValue('value', criteria.value)
		updateMethods.setValue('order', criteria.order)
		updateMethods.setValue('parentId', criteria.parentId)
		updateMethods.setValue('type', {
			id: criteria.type,
			label: criteria.type === 'TRUE_FALSE' ? 'True or False' : 'Explanation',
		})
	}
	const onClickAdd = (criteria: CriteriaType) => {
		setAdd(criteria.id)
		setIsExpanded(true)
		setEdit(null)
		createMethods.setValue('order', criteria.children.length)
		createMethods.setValue('parentId', criteria.id)
		createMethods.setValue('type', {id: 'TRUE_FALSE', label: 'True or false'})
	}
	const onExpand = () => {
		if (haveChildren) {
			if (isExpanded) {
				setAdd(null)
			}
			setIsExpanded(!isExpanded)
		}
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
					<ListBox name='type' label='' className='w-40' />
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

	return (
		<DivAnimate className='rounded-lg bg-dark-bg/25 p-2 pt-2'>
			{edit === criteria.id ? (
				<EditForm key='main_criteria' className='pr-0 md:py-2 md:pl-2' />
			) : (
				<div className='flex items-start'>
					{haveChildren ? (
						<IconButton onClick={onExpand}>
							{isExpanded ? (
								<ChevronUpIcon className='h-6 w-6' />
							) : (
								<ChevronDownIcon className='h-6 w-6' />
							)}
						</IconButton>
					) : (
						<div className='inline-block h-full w-8' />
					)}
					<div className='flex flex-1 items-center justify-between gap-2'>
						<h2
							className={`
								leading-5 md:text-lg md:leading-none
								${haveChildren ? 'hover:cursor-pointer' : ''} 
							`}
							onClick={onExpand}
						>
							<span className='mr-2'>{criteria.value}</span>
							<span className='space-x-1'>
								{criteria.type === 'EXPLANATION' && (
									<Bars3BottomLeftIcon className='inline h-5 w-5 text-brand-100' />
								)}
							</span>
						</h2>
						<div className='item-center flex'>
							<button onClick={() => onClickAdd(criteria)}>
								<PlusIcon className='h-8 w-8 rounded-l-lg bg-brand-100/50 p-1 text-brand-800 transition-colors duration-200 hover:bg-brand-200 active:bg-brand-300 md:h-10 md:w-10 md:p-2' />
							</button>
							<button onClick={() => onClickEdit({...criteria})}>
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
													{child.type === 'EXPLANATION' && (
														<Bars3BottomLeftIcon className='inline h-5 w-5 align-text-top text-brand-100' />
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
							flex flex-col gap-2 rounded-b-md md:ml-8 md:flex-row md:pb-3   
							${haveChildren ? 'bg-dark-bg/25 p-2 md:pl-4' : 'pt-4'}
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
							<ListBox name='type' label='' className='w-40' />
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
