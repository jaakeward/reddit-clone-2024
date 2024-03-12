import { Post } from '@/src/atoms/postsAtom';
import { Box, Flex, Stack } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React, { useState } from 'react';
import CommentInput from './CommentInput';
import { Comment } from '@/src/atoms/commentAtom';
import { Timestamp, collection, doc, writeBatch } from 'firebase/firestore';
import { auth, firestore } from '@/src/firebase/clientApp';
import useComments from '@/src/hooks/useComments';
import CommentItem from './CommentItem';

type CommentsProps = {
};

const Comments: React.FC<CommentsProps> = () => {
    const { onCreateComment, onDeleteComment, getPostComments, commentStateValue } = useComments();
    return (
        <Box bg={'white'} borderRadius={'0px 0px 4px 4px'} p={2}>
            <Flex
                direction={'column'}
                pl={10}
                pr={4}
                mb={6}
                fontSize={'10pt'}
                width={'100%'}>
                <CommentInput />

            </Flex>
            <Flex>
                <>
                    <Stack spacing={3} justify={'center'} width={'100%'}>
                        {commentStateValue.postComments && commentStateValue.postComments?.map((item) => {
                            return (<>
                                <CommentItem key={item!.commentId}
                                    comment={item!}
                                    onDeleteComment={onDeleteComment} />
                            </>)
                        }
                        )}
                    </Stack>
                </>
            </Flex>
        </Box>

    )
}
export default Comments;