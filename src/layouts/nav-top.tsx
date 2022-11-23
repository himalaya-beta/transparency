import React from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {useSession, signIn} from 'next-auth/react'
import Image from 'next/image'

import Button from '@components/button'
import {
	MdArticle as ArticleIcon,
	MdHome as HomeIcon,
	MdLogin as LoginIcon,
} from 'react-icons/md'

import {capFirstChar} from '@utils/literal'

export default function PlainLayout({children}: {children: React.ReactNode}) {
	const {pathname} = useRouter()
	const routes = [
		{href: '/', name: 'home', icon: <HomeIcon />},
		{href: '/article', name: 'article', icon: <ArticleIcon />},
	]

	const {status, data} = useSession()

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 '>
			<div className='glass flex h-12 w-full items-center justify-between border-none  bg-opacity-30 shadow-sm'>
				<div />
				<nav className='flex h-fit gap-4'>
					{routes.map(({href, name, icon}) => (
						<Link
							href={href}
							key={name}
							className={`flex items-center gap-2 px-4 font-medium text-gray-50 ${
								pathname === href
									? 'pointer-events-none text-violet-300'
									: 'hover:underline'
							}`}
						>
							<span className='text-xl'>{icon}</span>
							<span>{capFirstChar(name)}</span>
						</Link>
					))}
				</nav>
				<div className='px-4'>
					{status === 'authenticated' ? (
						<Image
							src={data.user?.image!}
							alt='user picture'
							width={32}
							height={32}
							className='rounded-full'
						/>
					) : (
						<Button
							variant='filled'
							className='px-4 py-1.5 font-medium text-gray-200 shadow-sm'
							onClick={() => signIn()}
						>
							Signin <LoginIcon className='text-xl' />
						</Button>
					)}
				</div>
			</div>
			<main className='container mx-auto py-12'>{children}</main>
		</div>
	)
}
