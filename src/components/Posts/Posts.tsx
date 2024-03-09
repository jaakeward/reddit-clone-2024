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

type PostsProps = {
    communityData: Community,
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
    const router = useRouter();
    const authUser = auth.currentUser;
    const { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost, loading, getPosts } = usePosts();
    const { communityStateValue } = useCommunityData();

    useEffect(() => {
        console.log('useEffect: gettings posts...');
        getPosts();
    }, [communityStateValue.currentCommunity, router.query]);

    return (
        <Flex width={'100%'} align={'center'}>
            <>
                <Stack spacing={3} justify={'center'} width={'100%'}>
                    {postStateValue.posts && postStateValue.posts.map((item) =>
                        <>
                            <PostItem key={item!.id}
                                post={item!}
                                userIsCreator={authUser?.uid === item!.creatorId}
                                userVoteValue={postStateValue.postVotes.find(
                                    (vote: PostVote) => vote?.id === item.id)?.voteValue ?
                                    postStateValue.postVotes.find(
                                        (vote: PostVote) => vote?.id === item.id)?.voteValue : 0}
                                onVote={onVote}
                                onSelectPost={onSelectPost}
                                onDeletePost={onDeletePost}
                            />
                        </>
                    )}
                </Stack>
            </>
        </Flex>
    )
}
export default Posts;