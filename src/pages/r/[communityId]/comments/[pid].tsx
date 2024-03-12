import AuthButtons from '@/src/Navbar/RightContent/AuthButtons';
import { authModalState } from '@/src/atoms/authModalAtom';
import { authUserState } from '@/src/atoms/authUserAtom';
import { Post, PostVote } from '@/src/atoms/postsAtom';
import About from '@/src/components/Community/About';
import Header from '@/src/components/Community/Header';
import PageContent from '@/src/components/Layout/PageContent';
import Comments from '@/src/components/Posts/Comments/Comments';
import PostItem from '@/src/components/Posts/PostItem';
import PostLoader from '@/src/components/Posts/PostLoader';
import { firestore, auth } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import usePosts from '@/src/hooks/usePosts';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

const PostPage: React.FC = () => {
    const { postStateValue, setPostStateValue, onDeletePost, onVote, onSelectPost, getPosts, getMyPostVotes, loading } = usePosts();
    const { communityStateValue, getCommunityData } = useCommunityData();
    const setAuthModalState = useSetRecoilState(authModalState);
    const router = useRouter();
    const getPost = async () => {

    }
    useEffect(() => {
        if (router.isReady) {
            getCommunityData(router.query.communityId as string);
            getPosts();
            if (auth.currentUser?.uid) {
                getMyPostVotes();
            }
            console.log('got posts as ' + postStateValue.selectedPost?.id);
        }
    }, [auth.currentUser?.uid && communityStateValue.currentCommunity?.communityId]);



    return (
        <>
            <Header />
            <PageContent>
                <>
                    {
                        (postStateValue.selectedPost?.id && communityStateValue.currentCommunity?.communityId) ?
                            <PostItem post={postStateValue.selectedPost!}
                                userIsCreator={postStateValue.selectedPost?.creatorId === auth.currentUser?.uid}
                                userVoteValue={(postStateValue.postVotes.find(vote => vote?.postId === postStateValue.selectedPost?.id)?.voteValue ?
                                    postStateValue.postVotes.find((vote: PostVote) => vote.postId === postStateValue.selectedPost?.id)!.voteValue : 0)}
                                onVote={onVote}
                                onDeletePost={onDeletePost}
                                onSelectPost={onSelectPost} />
                            : <PostLoader />}
                    {(postStateValue.selectedPost?.id && auth.currentUser?.uid) ?
                        < Comments /> : <AuthButtons />
                    }
                </>
                <>
                    <About />
                </>
            </PageContent>
        </>
    )
}
export default PostPage;