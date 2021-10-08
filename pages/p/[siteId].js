import { useRef } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/core';

import { getAllFeedback, getAllSites } from '../../lib/db-admin';
import { useAuth } from '@/lib/auth';
import Feedback from '@/components/feedback';

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

export default function FeedbackPage({ initialFeedback }) {
	const auth = useAuth();
	const inputEl = useRef(null);

	return (
		<Box
			display="flex"
			flexDirection="column"
			width="full"
			maxWidth="700px"
			margin="0 auto"
		>
			{auth.user && (
				<Box as="form">
					<FormControl my={8}>
						<FormLabel htmlFor="comment">Comment</FormLabel>
						<Input
							ref={inputEl}
							id="comment"
							placeholder="Leave a comment..."
						/>
						<Button mt={4} type="submit" fontWeight="medium">
							Add Comment
						</Button>
					</FormControl>
				</Box>
			)}
			{initialFeedback &&
				initialFeedback.map((feedback) => {
					<Feedback key={feedback.id} {...feedback} />;
				})}
		</Box>
	);
}
