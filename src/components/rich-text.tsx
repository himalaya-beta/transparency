import {Editor, EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import cN from 'clsx'

import BoldIcon from 'components/svg/bold'
import ItalicIcon from './svg/italic'
import StrikeThroughIcon from './svg/strikethrough'
import UnderlineIcon from './svg/underline'
import H1Icon from './svg/h1'
import H2Icon from './svg/h2'
import H3Icon from './svg/h3'
import H4Icon from './svg/h4'
import H5Icon from './svg/h5'
import H6Icon from './svg/h6'
import ParagraphIcon from './svg/paragraph'
import ListUlIcon from './svg/list-ul'
import ListOlIcon from './svg/list-ol'
import QuoteLeftIcon from './svg/quote-left'
// import CodeSimpleIcon from './svg/code-simple'
// import SquareCodeIcon from './svg/square-code'
import ArrowToDottedLineIcon from './svg/arrows-to-dotted-line'
import EraserIcon from './svg/eraser'
import ArrowRotateLeftIcon from './svg/arrow-rotate-left'
import ArrowRotateRightIcon from './svg/arrow-rotate-right'

const RichTextEditor = () => {
	const editor = useEditor({
		extensions: [StarterKit, Underline],
		editorProps: {
			attributes: {
				class: cN(
					'prose-headings:font-head prose-p:font-body prose-headings:text-black prose-p:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg',
					'prose-ol:list-decimal prose-ul:list-disc prose-li:pl-2 prose-li:ml-6',
					'prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:ml-4 prose-blockquote:my-2 prose-blockquote:pl-4 prose-blockquote:py-1 ',
					'bg-white rounded-b py-3 px-4 outline-gray-500 outline-offset-2 min-h-[16rem]'
				),
			},
		},
		content: `
			<p>lorem ipsum dolor amit</p>
			<ul>
				<li>Konde</li>
				<li>Mande</li>
			</ul>
			<ol>
				<li>Konde</li>
				<li>Mande</li>
			</ol>
			<p>lorem ipsum dolor amit</p>

			<blockquote>Konde is the most unreasonable tech</blockquote>
		`,
	})

	return (
		<div className='relative'>
			<EditorMenu editor={editor} />
			<EditorContent editor={editor} />
		</div>
	)
}

const EditorMenu = ({editor}: {editor: Editor | null}) => {
	if (!editor) return <></>

	const boldActive = editor.isActive('bold')
	const italicActive = editor.isActive('italic')
	const strikeActive = editor.isActive('strike')
	const underlineActive = editor.isActive('underline')

	return (
		<div className='sticky top-0 z-10 flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-t bg-gray-100 py-2 px-4 shadow '>
			<div className='flex items-center gap-1'>
				<button
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={cN(
						'group rounded-lg border-2 p-1 disabled:border-transparent',
						boldActive && 'bg-gray-400',
						!boldActive && 'border-white'
					)}
				>
					<BoldIcon
						secondaryClassName={cN(
							'group-disabled:opacity-25',
							boldActive ? 'fill-white ' : 'fill-gray-400 '
						)}
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					className={cN(
						'group rounded-lg border-2 p-1 disabled:border-transparent',
						italicActive && 'bg-gray-400',
						!italicActive && 'border-white'
					)}
				>
					<ItalicIcon
						secondaryClassName={cN(
							'group-disabled:opacity-25',
							italicActive ? 'fill-white' : 'fill-gray-400'
						)}
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
					className={cN(
						'group rounded-lg border-2 p-1 disabled:border-transparent',
						strikeActive && 'bg-gray-400',
						!strikeActive && 'border-white'
					)}
				>
					<StrikeThroughIcon
						primaryClassName={cN(
							'group-disabled:opacity-25',
							strikeActive ? 'fill-gray-900' : 'fill-gray-700'
						)}
						secondaryClassName={cN(
							'group-disabled:opacity-25',
							strikeActive ? 'fill-white' : 'fill-gray-400'
						)}
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					disabled={!editor.can().chain().focus().toggleUnderline().run()}
					className={cN(
						'group rounded-lg border-2 p-1 disabled:border-transparent',
						underlineActive && 'bg-gray-400',
						!underlineActive && 'border-white'
					)}
				>
					<UnderlineIcon
						primaryClassName={cN(
							'group-disabled:opacity-25',
							underlineActive ? 'fill-gray-900' : 'fill-gray-700'
						)}
						secondaryClassName={cN(
							'group-disabled:opacity-25',
							underlineActive ? 'fill-white' : 'fill-gray-400'
						)}
					/>
				</button>

				<SubDivider />

				<button
					onClick={() => editor.chain().focus().unsetAllMarks().run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<EraserIcon
						primaryClassName='fill-red-700'
						secondaryClassName='fill-red-400'
					/>
				</button>
			</div>

			<Divider />

			<div className='flex items-center gap-1'>
				<button
					onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<H1Icon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<H2Icon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<H3Icon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleHeading({level: 4}).run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<H4Icon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleHeading({level: 5}).run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<H5Icon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleHeading({level: 6}).run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<H6Icon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().setParagraph().run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<ParagraphIcon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button>
				<SubDivider />
				<button
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<ListUlIcon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<ListOlIcon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<QuoteLeftIcon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button>
				{/* <button
					onClick={() => editor.chain().focus().toggleCode().run()}
					disabled={!editor.can().chain().focus().toggleCode().run()}
					className='group rounded-lg border-2 border-white p-1 disabled:border-transparent'
				>
					<CodeSimpleIcon
						primaryClassName='fill-gray-700 group-disabled:opacity-25'
						secondaryClassName='fill-gray-400 group-disabled:opacity-25'
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<SquareCodeIcon
						primaryClassName='fill-gray-700'
						secondaryClassName='fill-gray-400'
					/>
				</button> */}
				<button
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<ArrowToDottedLineIcon
						secondaryClassName='fill-gray-700'
						primaryClassName='fill-gray-400'
					/>
				</button>
				<SubDivider />
				<button
					onClick={() => editor.chain().focus().clearNodes().run()}
					className='rounded-lg border-2 border-white p-1'
				>
					<EraserIcon
						primaryClassName='fill-red-700'
						secondaryClassName='fill-red-400'
					/>
				</button>
			</div>

			<Divider />

			<div className='flex space-x-1'>
				<button
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
					className='group rounded-lg border-2 border-white p-1 disabled:border-transparent'
				>
					<ArrowRotateLeftIcon
						primaryClassName='fill-blue-700 group-disabled:opacity-25'
						secondaryClassName='fill-blue-400 group-disabled:opacity-25'
					/>
				</button>
				<button
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
					className=' group rounded-lg border-2 border-white p-1 disabled:border-transparent'
				>
					<ArrowRotateRightIcon
						primaryClassName='fill-blue-700 group-disabled:opacity-25'
						secondaryClassName='fill-blue-500 group-disabled:opacity-25'
					/>
				</button>
			</div>

			{/*
			<button onClick={() => editor.chain().focus().setHardBreak().run()}>
				hard break
			</button> 
			*/}
		</div>
	)
}

const SubDivider = () => (
	<div className='mx-1 h-1 w-1 rounded-full bg-gray-300' />
)

const Divider = () => (
	<div className='mx-1 h-8 w-0.5 rounded-full bg-gray-600 py-1' />
)

export default RichTextEditor
