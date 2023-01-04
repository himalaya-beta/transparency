/* eslint-disable react-hooks/exhaustive-deps */
import React, {Dispatch} from 'react'

const usePaginate = (
	perPage: number,
	data: Array<{id: string; [key: string]: unknown}> | undefined,
	isPreviousData: boolean,
	isInitialLoading: boolean,
	setCursorId: Dispatch<string | undefined>
) => {
	const [cursorIds, setCursorIds] = React.useState<Array<string | undefined>>([
		undefined,
	])
	const [page, setPage] = React.useState(0)

	React.useLayoutEffect(() => {
		if (!isPreviousData) {
			if (data?.length === perPage) {
				const cursor = data[data.length - 1]
				setCursorIds([...cursorIds, cursor?.id])
			} else if (data?.length === 0) {
				const popped = [...cursorIds]
				popped.length = cursorIds.length - 1
				setCursorIds(popped)
				setPage(page - 1)
				setCursorId(popped[page - 1])
			}
		}
	}, [isPreviousData])

	React.useEffect(() => {
		if (!isInitialLoading && data) {
			const cursor = data[data.length - 1]
			setCursorIds([...cursorIds, cursor?.id])
		}
	}, [isInitialLoading])

	return {page, setPage, cursorIds}
}

export default usePaginate
