/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable unicorn/no-process-exit */
import {
	PrismaPromise,
	PrismaClient,
	Criteria,
	CriteriaType,
} from '@prisma/client'

import {slugify} from '../../src/utils/literal'

type CriteriaSimple = Pick<Criteria, 'value'> & {type?: CriteriaType}

const prisma = new PrismaClient()

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
		{
			value: 'Automatic Data',
			children: [
				{value: 'IP address'},
				{value: 'Devices ID'},
				{value: 'User activity statistic'},
				{value: 'How user come'},
				{value: 'Location'},
				{value: 'Features used and not'},
				{value: 'Visited website before and after'},
				{
					value:
						'Collect data from Cookies, Pixel Tags, Local Shared Object, Web Storage, and similar technology',
				},
				{value: 'Email and text interaction'},
			],
		},
		{
			value: 'Information from third party sources',
			type: 'EXPLANATION',
		},
		{value: 'Information from physical devices'},
		{
			value: 'Personal data usage',
			children: [
				{value: 'Customer services'},
				{value: 'Grant access'},
				{value: 'Internal business'},
				{value: 'Marketing'},
				{value: 'Social media ads'},
				{value: 'Organizer emails'},
				{value: 'Personalized recommendation/ localized content'},
				{value: 'Targeted advertisement/ recommendation customization'},
				{value: 'Unlawful behavior detection and prevention'},
				{
					value:
						'Consent to other purpose that is not consistent to current policy',
				},
			],
		},
		{value: 'Exclude from personalized marketing options'},
		{value: 'Data transfer', type: 'EXPLANATION'},
		{value: 'Manage personal data'},
		{value: 'Personal data retention period'},
		{
			value: 'Personal data options',
			children: [
				{value: 'Limitation'},
				{value: 'Electronic communication/ subscription'},
				{value: 'Social media notification/ personalization'},
				{value: 'Location tracking & push notification'},
			],
		},
		{value: 'Untracked frameworks'},
		{value: 'Data storage location', type: 'EXPLANATION'},
		{value: 'Parental consent on children data'},
		{value: 'Sources', type: 'EXPLANATION'},
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
