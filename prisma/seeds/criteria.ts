/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable unicorn/no-process-exit */
import {
	PrismaPromise,
	PrismaClient,
	Criteria,
	CriteriaType,
} from '@prisma/client'
const prisma = new PrismaClient()

type CriteriaSimple = Pick<Criteria, 'value'> & {type?: CriteriaType}

function slugify(title: string) {
	return title
		.normalize('NFD') // split an accented letter in the base letter and the accent
		.replace(/[\u0300-\u036F]/g, '') // remove all previously split accents
		.toLowerCase()
		.trim()
		.replace(/[^\d a-z]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
		.replace(/\s+/g, '-') // separator
}

async function main() {
	const criterias: Array<CriteriaSimple & {children?: CriteriaSimple[]}> = [
		{
			value: 'Personal data',
			children: [
				{value: 'Name'},
				{value: 'Address'},
				{value: 'Email address'},
				{value: 'Date of birth'},
				{value: 'Country of residence'},
				{value: 'Postal code'},
				{value: 'Financial information/ payment method'},
				{value: 'Mental health'},
				{value: 'Physical health'},
				{value: 'Geo location'},
				{value: 'Public post'},
			],
		},
		{
			value: 'Personal data collected for',
			type: 'EXPLANATION',
		},
	]
	const promises: PrismaPromise<Criteria>[] = []

	for (const [i, criteria] of criterias.entries()) {
		promises.push(
			prisma.criteria.upsert({
				where: {
					slug: slugify(criteria.value),
				},
				update: {
					order: i,
				},
				create: {
					order: i,
					type: criteria.type,
					value: criteria.value,
					slug: slugify(criteria.value),
					...(criteria.children && {
						children: {
							createMany: {
								data: criteria.children.map((subCriteria, j) => ({
									...subCriteria,
									order: j,
									slug: slugify(subCriteria.value),
								})),
							},
						},
					}),
				},
			})
		)
	}

	await Promise.all(promises).then((data) => console.log(data))
}
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (error) => {
		console.error(error)
		await prisma.$disconnect()
		process.exit(1)
	})
