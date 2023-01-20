import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useSession, signIn, signOut} from 'next-auth/react'

import {
	HomeIcon as HomeOutlineIcon,
	DocumentTextIcon as ArticleOutlineIcon,
	UserGroupIcon as UserGroupOutlineIcon,
	ArrowLeftOnRectangleIcon as LoginIcon,
	ArrowRightOnRectangleIcon as LogoutIcon,
	LockClosedIcon,
} from '@heroicons/react/24/outline'
import {
	HomeIcon as HomeSolidIcon,
	UserGroupIcon as UserGroupSolidIcon,
	DocumentTextIcon as ArticleSolidIcon,
	UserIcon,
	LockOpenIcon,
	KeyIcon,
} from '@heroicons/react/24/solid'

import {capFirstChar} from 'utils/literal'
import {Menu, Transition} from '@headlessui/react'

export default function NavbarLayout({children}: {children: React.ReactNode}) {
	const {data} = useSession()

	const {pathname} = useRouter()
	const routes = [
		{
			href: '/',
			label: 'home',
			Icon: HomeOutlineIcon,
			IconActive: HomeSolidIcon,
			admin: false,
		},
		{
			href: '/policy',
			label: 'App Policy',
			Icon: ArticleOutlineIcon,
			IconActive: ArticleSolidIcon,
			admin: false,
		},
		{
			href: '/community',
			label: 'Community',
			Icon: UserGroupOutlineIcon,
			IconActive: UserGroupSolidIcon,
			admin: false,
		},
		{
			href: '/admin',
			label: 'admin',
			Icon: LockClosedIcon,
			IconActive: LockOpenIcon,
			admin: true,
		},
	]

	const filteredRoutes =
		!data || data?.user.role === 'USER'
			? routes.filter((route) => !route.admin)
			: routes

	return (
		<div className='to-bg-dark to-bg-brand relative min-h-screen bg-gradient-to-br from-brand-700 via-brand-900 to-dark-bg'>
			<div className='fixed bottom-0 z-10 flex w-full items-center justify-between border-t-0 bg-brand-900/50 bg-opacity-30 pt-2 pb-1 underline-offset-4 backdrop-blur-lg md:relative md:bg-inherit md:py-2'>
				<div className='ml-2 hidden h-10 w-10 md:block' />
				<Link
					href='/'
					className='ml-2 flex items-center justify-center rounded-full bg-brand-200/30 p-0.5 md:hidden'
				>
					<button className='h-8 w-8 rounded-full bg-gradient-to-br from-brand-700 to-brand-900 p-1 shadow'>
						<HomeOutlineIcon className='h-full w-full text-brand-100' />
					</button>
				</Link>

				<nav className='flex h-fit items-center gap-4'>
					{filteredRoutes.map(({href, label, Icon, IconActive}, i) => {
						const isActive = pathname === href
						return (
							<React.Fragment key={label}>
								<Link
									href={href}
									className={`
										flex w-16 flex-col items-center gap-0.5 rounded px-2 font-medium text-light-head md:w-fit md:flex-row md:gap-2 md:py-1 
										${label === 'home' ? 'hidden md:flex' : ''}
										${isActive ? 'pointer-events-none' : 'hover:underline'}
									`}
								>
									{isActive ? (
										<IconActive className='h-6 w-6 rounded-lg text-xl' />
									) : (
										<Icon className='h-6 w-6' />
									)}
									<span
										className={`
											whitespace-nowrap text-xs md:text-base
											${isActive ? 'underline' : ''}
										`}
									>
										{capFirstChar(label)}
									</span>
								</Link>

								{i !== filteredRoutes.length - 1 && (
									<span className='mx-2 hidden text-xs text-light-head md:mx-0 md:block lg:mx-2'>
										&#9671;
									</span>
								)}
							</React.Fragment>
						)
					})}
				</nav>

				<AuthButton className='mr-2 h-10 md:px-4' />
			</div>

			<div className='container mx-auto -mt-1 w-full bg-white'>
				<div className='h-0.5' />
			</div>

			<div className='container mx-auto pb-20 md:pb-16'>{children}</div>
		</div>
	)
}

function AuthButton({className}: {className?: string}) {
	const {status, data} = useSession()

	return (
		<div className={className}>
			{status === 'authenticated' ? (
				<Menu as='div' className='relative inline-block text-left'>
					<div>
						<Menu.Button
							className={`inline-flex w-full justify-center rounded-full bg-light-bg bg-opacity-25 p-0.5 text-sm font-medium text-light-head transition-all hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-light-head focus-visible:ring-opacity-75 md:-mt-0.5 md:p-1`}
						>
							{data.user?.image ? (
								<Image
									src={data.user.image}
									alt='user picture'
									width={36}
									height={36}
									className='rounded-full'
								/>
							) : (
								<div className='h-9 w-9 rounded-full bg-light-bg p-0.5'>
									<UserIcon className='h-full w-full text-brand-500' />
								</div>
							)}
						</Menu.Button>
					</div>
					<Transition
						as={React.Fragment}
						enter='transition ease-out duration-100'
						enterFrom='transform opacity-0 scale-95'
						enterTo='transform opacity-100 scale-100'
						leave='transition ease-in duration-75'
						leaveFrom='transform opacity-100 scale-100'
						leaveTo='transform opacity-0 scale-95'
					>
						<Menu.Items className='absolute -top-28 right-0 -mt-3 w-44 origin-top-right rounded-lg font-body text-sm shadow-md shadow-brand-100/75 ring-2 ring-brand-900 ring-opacity-10 focus:outline-none md:top-full md:mt-2 md:w-52 md:text-base'>
							<div className='flex gap-2 rounded-t-lg bg-gradient-to-br from-brand-700 to-brand-800 p-2 text-brand-50 shadow-md'>
								<div className='h-fit rounded-full border-2 border-brand-100 bg-gradient-to-br from-brand-400 to-brand-600 p-2'>
									{data.user.role === 'ADMIN' ? (
										<KeyIcon className='w-5 text-brand-100 md:w-7' />
									) : (
										<UserIcon className='w-5 text-brand-100 md:w-7' />
									)}
								</div>
								<div className='flex-col'>
									<span className='w-full line-clamp-1'>{data.user.name}</span>
									<span className='italic'>
										{capFirstChar(data.user.role.toLocaleLowerCase())}
									</span>
								</div>
							</div>
							<div className='rounded-b-lg bg-gradient-to-br from-white via-white to-brand-200 px-1 py-1 md:py-3 md:px-2'>
								{/* <Menu.Item>
									<button className='group flex w-full gap-4 rounded from-brand-500 to-brand-700 py-2 pl-3 hover:bg-gradient-to-br md:gap-5'>
										<ArticleOutlineIcon className='w-6 text-brand-600 group-hover:text-brand-50' />
										<span className='group-hover:text-light-head'>
											My Articles
										</span>
									</button>
								</Menu.Item> */}
								<Menu.Item>
									<button
										className='group flex w-full gap-4 rounded from-brand-500 to-brand-700 py-2 pl-3 hover:bg-gradient-to-br md:gap-5'
										onClick={() => signOut()}
									>
										<LogoutIcon className='w-6 text-brand-600 group-hover:text-brand-50' />
										<span className='group-hover:text-light-head'>
											Sign out
										</span>
									</button>
								</Menu.Item>
							</div>
						</Menu.Items>
					</Transition>
				</Menu>
			) : (
				<button
					className='h-9 items-center rounded-full bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-1.5 shadow transition-all hover:bg-opacity-80 hover:shadow-brand-100 md:flex md:w-fit md:rounded-lg'
					onClick={() => signIn()}
				>
					<LoginIcon className='h-full w-full rotate-180 text-brand-100 md:ml-0.5' />
					<span className='mx-1 hidden text-light-head md:block'>Signin</span>
				</button>
			)}
		</div>
	)
}
