import About from '@/src/components/Community/About';
import PageContent from '@/src/components/Layout/PageContent';
import PostItem from '@/src/components/Posts/PostItem';
import PostLoader from '@/src/components/Posts/PostLoader';
import useAuthUser from '@/src/hooks/useAuthUser';
import useCommunityData from '@/src/hooks/useCommunityData';
import usePosts from '@/src/hooks/usePosts';
import { useRouter } from 'next/router';

const PostPage: React.FC = () => {
    const { postStateValue, setPostStateValue, onDeletePost, onVote, onSelectPost } = usePosts();
    const { communityStateValue } = useCommunityData()
    const { authUser } = useAuthUser();
    const router = useRouter();

    return (
        <PageContent>
            <>
                {(postStateValue.selectedPost && communityStateValue.currentCommunity) ?
                    <PostItem post={postStateValue.selectedPost!}
                        userIsCreator={postStateValue.selectedPost?.creatorId === authUser.uid}
                        onVote={() => onVote(postStateValue.selectedPost!,
                            postStateValue.selectedPost!.voteStatus,
                            communityStateValue.currentCommunity!.communityId)}
                        onDeletePost={onDeletePost}
                        onSelectPost={onSelectPost} /> : <PostLoader />
                }
            </>
            <>
                <About />
            </>
        </PageContent>
    )
}
export default PostPage;