import AuthButtons from '@/src/Navbar/RightContent/AuthButtons';
import { Post } from '@/src/atoms/postsAtom';
import { auth } from '@/src/firebase/clientApp';
import useComments from '@/src/hooks/useComments';
import { Button, Flex, Input, Text, Textarea } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { comment } from 'postcss';
import React, { ChangeEvent, ReactElement, useState } from 'react';


const CommentInput: React.FC = () => {
    const { onCreateComment, createLoading, commentText, onTextChange } = useComments();


    return (
        <Flex direction="column" position="relative">
            {auth.currentUser ? (
                <>
                    <Text mb={1}>
                        Comment as{" "}
                        <span style={{ color: "#3182CE" }}>
                            {auth.currentUser?.email?.split("@")[0]}
                        </span>
                    </Text>
                    <Textarea
                        value={commentText}
                        onChange={onTextChange}
                        placeholder="What are your thoughts?"
                        fontSize="10pt"
                        borderRadius={4}
                        minHeight="160px"
                        pb={10}
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                            outline: "none",
                            bg: "white",
                            border: "1px solid black",
                        }}
                    />
                    <Flex
                        position="absolute"
                        left="1px"
                        right={0.1}
                        bottom="1px"
                        justify="flex-end"
                        bg="gray.100"
                        p="6px 8px"
                        borderRadius="0px 0px 4px 4px"
                    >
                        <Button
                            height="26px"
                            disabled={!(commentText.length < 400)}
                            isLoading={createLoading}
                            onClick={() => { onCreateComment(commentText); }}
                        >
                            Comment
                        </Button>
                    </Flex>
                </>
            ) : (
                <Flex
                    align="center"
                    justify="space-between"
                    borderRadius={2}
                    border="1px solid"
                    borderColor="gray.100"
                    p={4}
                >
                    <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
                    <AuthButtons />
                </Flex>
            )}
        </Flex>
    );
}
export default CommentInput;