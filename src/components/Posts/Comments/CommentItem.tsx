import { Post } from '@/src/atoms/postsAtom';
import React from 'react';
import { Comment } from '@/src/atoms/commentAtom';
import { Box, Flex, Icon, Spinner, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import { FaReddit } from 'react-icons/fa';
import { IoArrowUpCircleOutline, IoArrowDownCircleOutline } from 'react-icons/io5';
import useComments from '@/src/hooks/useComments';
import { auth } from '@/src/firebase/clientApp';

type CommentItemProps = {
    onDeleteComment: (comment: Comment) => void;
    comment: Comment,
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDeleteComment }) => {
    const { fetchLoading } = useComments();

    return (<>
        <Flex>
            <Box mr={2}>
                <Icon as={FaReddit} fontSize={30} color="gray.300" />
            </Box>
            <Stack spacing={1}>
                <Stack direction="row" align="center" spacing={2} fontSize="8pt">
                    <Text
                        fontWeight={700}
                        _hover={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                        {comment.creatorDisplayName}
                    </Text>
                    {comment.createdAt?.seconds && (
                        <Text color="gray.600">
                            {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
                        </Text>
                    )}
                    {fetchLoading && <Spinner size="sm" />}
                </Stack>
                <Text fontSize="10pt">{comment.text}</Text>
                <Stack
                    direction="row"
                    align="center"
                    cursor="pointer"
                    fontWeight={600}
                    color="gray.500"
                >
                    <Icon as={IoArrowUpCircleOutline} />
                    <Icon as={IoArrowDownCircleOutline} />
                    {auth.currentUser?.uid === comment.creatorId && (
                        <>
                            <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                                Edit
                            </Text>
                            <Text
                                fontSize="9pt"
                                _hover={{ color: "blue.500" }}
                                onClick={() => onDeleteComment(comment)}
                            >
                                Delete
                            </Text>
                        </>
                    )}
                </Stack>
            </Stack>
        </Flex>
    </>);
}
export default CommentItem;