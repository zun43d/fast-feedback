import { Box, Divider, Heading, Text } from '@chakra-ui/core/';
import { format, parseISO } from 'date-fns';
import DeleteFeedbackButton from './DeleteFeedbackButton';

const Feedback = ({ author, text, createdAt, siteId }) => (
	<Box borderRadius="4" maxWidth="700px" w="full">
		<Heading size="sm" as="h3" mb={0} color="gray.900" fontWeight="medium">
			{author}
		</Heading>
		<Text color="gray.500" mb={4} fontSize="xs">
			{format(parseISO(createdAt), 'PPpp')}
		</Text>
		<Text color="gray.800">{text}</Text>
		<DeleteFeedbackButton feedbackId={siteId} />
		<Divider borderColor="gray.200" backgroundColor="gray.200" mt={8} mb={8} />
	</Box>
);

export default Feedback;
