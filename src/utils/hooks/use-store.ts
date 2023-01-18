/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {isArrayIdentic} from 'utils/array'

const pagesAvailable = ['policy', 'community'] as const
export type PagesAvailable = typeof pagesAvailable[number]
type PaginationObject = {
	keys: Array<string>
	pages: Array<number>
	pageActive: number
}
type initialValues = Record<PagesAvailable, Array<PaginationObject>> & {
	initParams: (name: PagesAvailable, keys: Array<string>) => void
	addPage: (name: PagesAvailable, keys: Array<string>) => void
	setPageActive: (
		name: PagesAvailable,
		keys: Array<string>,
		pageActive: number
	) => void
}
export const usePagination = create<initialValues>()(
	immer((set) => ({
		policy: [],
		community: [],
		initParams: (name, keys) =>
			set((state) => {
				state[name].push({keys, pages: [1], pageActive: 1})
			}),
		addPage: (name, keys) =>
			set((state) => {
				const pagins = state[name]
				const i = pagins.findIndex((pagin) => isArrayIdentic(pagin.keys, keys))
				if (i !== -1) pagins[i]!.pages.push(pagins[i]!.pages.length + 1)
			}),
		setPageActive: (name, keys, destination) =>
			set((state) => {
				const pagins = state[name]
				const i = pagins.findIndex((pagin) => isArrayIdentic(pagin.keys, keys))
				if (i !== -1) pagins[i]!.pageActive = destination
			}),
	}))
)
