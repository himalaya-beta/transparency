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
import {
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
	CriteriaType,
} from 'types/criteria'

const AdminDashboardPage = () => {
	const [edit, setEdit] = React.useState<string | null>(null)
	const [add, setAdd] = React.useState<string | null>(null)

	const criteriaListQuery = trpc.criteria.fetchRoot.useQuery()

	const {mutate: create} = trpc.criteria.create.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: () => {
			createMethods.reset()
			createSubMethods.reset()
			criteriaListQuery.refetch()
			setAdd(null)
		},
	})
	const {mutate: update} = trpc.criteria.update.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: () => {
			updateMethods.reset()
			criteriaListQuery.refetch()
			setEdit(null)
		},
	})
	const {mutate: remove} = trpc.criteria.delete.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: () => {
			criteriaListQuery.refetch()
		},
	})

	const createMethods = useForm<CriteriaCreateType>({
		mode: 'onTouched',
		resolver: zodResolver(criteriaCreateSchema),
	})
	const createSubMethods = useForm<CriteriaCreateType>({
		mode: 'onTouched',
		resolver: zodResolver(criteriaCreateSchema),
	})
	const updateMethods = useForm<CriteriaUpdateType>({
		mode: 'onTouched',
		resolver: zodResolver(criteriaUpdateSchema),
	})

	const onCreateCriteria: SubmitHandler<CriteriaCreateType> = (data) => {
		create(data)
	}
	const onUpdateCriteria: SubmitHandler<CriteriaUpdateType> = (data) => {
		if (edit) {
			update({...data, id: edit})
		}
	}

	const onClickEdit = (criteria: CriteriaType) => {
		setEdit(criteria.id)
		setAdd(null)
		updateMethods.setValue('id', criteria.id)
		updateMethods.setValue('value', criteria.value)
		updateMethods.setValue('parentId', criteria.parentId)
	}

	const onClickAddSubCriteria = (criteria: CriteriaType) => {
		setAdd(criteria.id)
		setEdit(null)
		createSubMethods.setValue('parentId', criteria.id)
	}

	return (
		<div className='container max-w-screen-md space-y-8 px-8 md:mx-auto '>
			<h1 className='text-3xl'>Policy Criteria</h1>
			<QueryWrapper {...criteriaListQuery}>
				{(criterias) => (
					<div className='space-y-2'>
						{criterias.map((criteria) => (
							<div
								key={criteria.id}
								className='space-y-4 rounded-lg bg-dark-bg/25 p-4'
							>
								{edit === criteria.id ? (
									<FormWrapper
										methods={updateMethods}
										onValidSubmit={onUpdateCriteria}
										className='flex w-full gap-2'
									>
										<TextAreaInput<CriteriaUpdateType>
											name='value'
											rows={2}
											label=''
											wrapperClassName='flex-1'
											inputClassName='pb-3'
										/>
										<div className='flex flex-col gap-1'>
											<button type='submit'>
												<PencilIcon className='h-8 w-8 rounded-lg bg-blue-500 p-1 text-brand-100' />
											</button>
											<button onClick={() => setEdit(null)}>
												<XMarkIcon className='h-8 w-8 rounded-lg bg-orange-400 p-1 text-brand-100' />
											</button>
										</div>
									</FormWrapper>
								) : (
									<>
										<div className='flex items-center justify-between'>
											<h2>{criteria.value}</h2>
											<div className='item-center flex gap-2'>
												<button onClick={() => onClickAddSubCriteria(criteria)}>
													<PlusIcon className='h-10 w-10 rounded-lg bg-brand-100 p-2 text-blue-500' />
												</button>
												<button onClick={() => onClickEdit(criteria)}>
													<PencilIcon className='h-10 w-10 rounded-lg bg-brand-100 p-2 text-blue-500' />
												</button>
												<button onClick={() => remove({id: criteria.id})}>
													<TrashIcon className='h-10 w-10 rounded-lg bg-brand-100 p-2 text-red-500' />
												</button>
											</div>
										</div>
										<div className='space-y-2'>
											{criteria.children.map((child) => (
												<div
													key={child.id}
													className='flex items-center justify-between rounded-lg bg-dark-bg/25 p-2 pl-4'
												>
													<h3>{child.value}</h3>
													<div className='item-center flex gap-4'>
														<button onClick={() => onClickEdit(child)}>
															<PencilIconSolid className='h-6 w-6 text-blue-500/75' />
														</button>
														<button onClick={() => remove({id: child.id})}>
															<TrashIconSolid className='h-6 w-6 text-red-500/75' />
														</button>
													</div>
												</div>
											))}
										</div>
										{add === criteria.id && (
											<FormWrapper
												methods={createSubMethods}
												onValidSubmit={onCreateCriteria}
												className='flex w-full gap-2'
											>
												<TextAreaInput<CriteriaUpdateType>
													name='value'
													rows={2}
													label=''
													wrapperClassName='flex-1'
													inputClassName='pb-3'
												/>
												<div className='flex flex-col gap-1'>
													<button type='submit'>
														<PencilIcon className='h-8 w-8 rounded-lg bg-blue-500 p-1 text-brand-100' />
													</button>
													<button onClick={() => setAdd(null)}>
														<XMarkIcon className='h-8 w-8 rounded-lg bg-orange-400 p-1 text-brand-100' />
													</button>
												</div>
											</FormWrapper>
										)}
									</>
								)}
							</div>
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
					/>
					<Button type='submit' variant='filled'>
						Submit
					</Button>
				</FormWrapper>
			</div>
		</div>
	)
}

AdminDashboardPage.getLayout = (page: React.ReactElement) => (
	<NavbarTopLayout>{page}</NavbarTopLayout>
)

export default AdminDashboardPage
