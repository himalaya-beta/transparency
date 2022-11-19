import QueryWrapper from '@components/wrapper'
import {trpc} from '@utils/trpc'

export default function ExamplePage() {
	const examplesQuery = trpc.example.getExamples.useQuery()

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 py-12'>
			<main className='glass mx-auto max-w-screen-lg space-y-8 rounded-xl bg-red-200/50 p-8'>
				<h1 className='text-3xl text-gray-50'>Try it by yourself</h1>
				<div className='grid grid-cols-3'>
					<QueryWrapper {...examplesQuery}>
						{({title, content}) => <Card title={title} content={content} />}
					</QueryWrapper>
				</div>
			</main>
		</div>
	)
}

const Card = ({title, content}: {title: string; content: string}) => {
	return (
		<div
			className={`hover:glass max-h-72 space-y-4 rounded-lg border-2 border-white/25 bg-white/10 p-6 transition-colors`}
		>
			<h2 className='text-xl text-gray-50'>{title}</h2>
			<p className='text-gray-200 line-clamp-6'>{content}</p>
		</div>
	)
}
