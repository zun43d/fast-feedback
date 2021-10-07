import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/core';

import { getAllFeedback, getAllSites } from '../../lib/db-admin';

export async function getStaticProps(context) {
	const siteId = context.params.siteId;
	const { feedback } = await getAllFeedback(siteId);

	return {
		props: {
			initialFeedback: feedback,
		},
		revalidate: 1,
	};
}

export async function getStaticPaths() {
	const { sites } = await getAllSites();
	const paths = sites.map((site) => ({
		params: {
			siteId: site.id,
		},
	}));

	return {
		paths,
		fallback: true,
	};
}

export default function FeedbackPage() {
	const router = useRouter();

	return <Box>Page ID: {router.query.siteId}</Box>;
}
