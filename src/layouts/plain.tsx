import React from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'

import {capFirstChar} from '@utils/literal'
import {MdArticle, MdHome} from 'react-icons/md'

export default function PlainLayout({children}: {children: React.ReactNode}) {
	const {pathname} = useRouter()
	const routes = [
		{href: '/', name: 'home', icon: <MdHome />},
		{href: '/article', name: 'article', icon: <MdArticle />},
	]

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 '>
			<div className='glass flex h-12 w-full items-center justify-center border-none  bg-opacity-30 shadow-sm'>
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
			</div>
			<main className='container mx-auto py-12'>{children}</main>
		</div>
	)
}
