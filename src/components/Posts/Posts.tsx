import { Community, communityState } from '@/src/atoms/communitiesAtom';
import { Post, PostVote } from '@/src/atoms/postsAtom';
import { auth, firestore } from '@/src/firebase/clientApp';
import usePosts from '@/src/hooks/usePosts';
import { query, collection, where, orderBy, getDocs } from 'firebase/firestore';
import React, { Suspense, useEffect, useState } from 'react';
import PostItem from './PostItem';
import { Flex, Stack } from '@chakra-ui/react';
import PostLoader from './PostLoader';
import useCommunityData from '@/src/hooks/useCommunityData';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';

type PostsProps = {
};

const Posts: React.FC<PostsProps> = () => {
    const { postStateValue, onVote, onDeletePost, onSelectPost, loading, getPosts } = usePosts();
    const { communityStateValue } = useCommunityData();

    return (
        <Flex width={'100%'} align={'center'}>
            <>
                <Stack spacing={3} justify={'center'} width={'100%'}>
                    {postStateValue.posts && postStateValue.posts.map((item) => {
                        return (<>
                            <PostItem key={item!.id}
                                post={item!}
                                userIsCreator={auth.currentUser?.uid === item!.creatorId}
                                userVoteValue={(postStateValue.postVotes.find(vote => vote?.postId === item.id)?.voteValue ?
                                    postStateValue.postVotes.find((vote: PostVote) => vote.postId === item.id)!.voteValue : 0)}
                                onVote={onVote}
                                onSelectPost={onSelectPost}
                                onDeletePost={onDeletePost}
                            />
                        </>)
                    }
                    )}
                </Stack>
            </>
        </Flex>
    )
}
export default Posts;