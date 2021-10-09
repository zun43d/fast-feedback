import React, { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { mutate } from 'swr';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	IconButton,
	Button,
} from '@chakra-ui/core';

import { deleteFeedback } from '@/lib/db';

const DeleteFeedbackButton = ({ feedbackId }) => {
	const [isOpen, setIsOpen] = useState();
	const auth = useAuth();
	const cancelRef = useRef();

	const onClose = () => setIsOpen(false);
	const onDelete = () => {
		deleteFeedback(feedbackId);
		mutate(
			['/api/feedback', auth.user.token],
			async (data) => {
				return {
					feedback: data.feedback.filter(
						(feedback) => feedback.id !== feedbackId
					),
				};
			},
			false
		);
		onClose();
	};

	return (
		<>
			<IconButton
				aria-label="Delete feedback"
				icon="delete"
				variant="ghost"
				onClick={() => setIsOpen(true)}
			/>
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay />
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Delete Feedback
					</AlertDialogHeader>
					<AlertDialogBody>
						Are you sure? You can't undo this action afterwards.
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button
							fontWeight="bold"
							variantColor="red"
							onClick={onDelete}
							ml={3}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default DeleteFeedbackButton;
