import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useSession, signIn, signOut} from 'next-auth/react'

import MenuButton from 'components/menu-button'
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
} from '@heroicons/react/24/solid'

import {capFirstChar} from 'utils/literal'

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
			<div className='fixed bottom-0 z-10 flex w-full items-center justify-between border-t-0 bg-brand-900/50 bg-opacity-30 py-2 underline-offset-4 backdrop-blur-lg md:relative md:bg-inherit'>
				<div className='ml-2 hidden h-10 w-10 md:block' />
				<Link
					href='/'
					className='ml-2 flex items-center justify-center rounded-full bg-brand-200/30 p-0.5 md:hidden'
				>
					<button className='h-9 w-9 rounded-full bg-dark-bg/50 p-1'>
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
										flex w-16 flex-col items-center gap-1 rounded px-2 font-medium text-light-head md:w-fit md:flex-row md:gap-2 md:py-1 
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

				<AuthButton className='mr-2 h-10 md:-mt-1 md:px-4' />
			</div>

			<div className='container -mt-1 w-full bg-white'>
				<div className='h-0.5' />
			</div>

			<div className='container mx-auto pb-10 md:pb-16'>{children}</div>
		</div>
	)
}

function AuthButton({className}: {className?: string}) {
	const {status, data} = useSession()
	const menuItems = [
		{label: 'Sign out', Icon: LogoutIcon, onClick: () => signOut()},
	]

	return (
		<div className={className}>
			{status === 'authenticated' ? (
				<MenuButton
					menuItems={menuItems}
					itemsClassName='-top-full md:top-full right-0 -mt-3 md:mt-2'
					buttonClassName='hover:bg-opacity-50 transition-all'
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
				</MenuButton>
			) : (
				<div className='flex items-center justify-center rounded-full bg-brand-200 bg-opacity-30 p-0.5 transition-all hover:bg-opacity-60 md:rounded-xl'>
					<button
						className='h-9 w-9 rounded-full bg-dark-bg bg-opacity-60 p-1 transition-all hover:bg-opacity-80 md:flex md:w-fit md:rounded-xl'
						onClick={() => signIn()}
					>
						<LoginIcon className='h-full w-full rotate-180 text-brand-100 md:ml-0.5' />
						<span className='mx-1 mt-0.5 hidden md:block'>Signin</span>
					</button>
				</div>
			)}
		</div>
	)
}
