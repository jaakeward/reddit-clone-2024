import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, PostVote, postState } from '../atoms/postsAtom';
import { firestore, storage } from '../firebase/clientApp';
import { deleteObject, ref } from 'firebase/storage';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useCommunityData from './useCommunityData';
import { authUserState } from '../atoms/authUserAtom';
import { authModalState } from '../atoms/authModalAtom';
import { auth } from '@/src/firebase/clientApp'

const usePosts = () => {
    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const router = useRouter();
    const { communityStateValue, setCommunityStateValue, getCommunityData } = useCommunityData();
    const [loading, setLoading] = useState(false);
    const authUser = useRecoilValue(authUserState);
    const setAuthModalState = useSetRecoilState(authModalState);

    const getPosts = async () => {
        if (!communityStateValue.currentCommunity?.communityId) { return; }
        console.log('getPosts');
        if (!postStateValue.posts.some(post => post.id === router.query.pid as string)) {
            const comparison = router.query.pid ? 'id' : 'communityId';
            const queryItem = router.query.pid ? router.query.pid as string : router.query.communityId as string;
            console.log('Query comparison: ' + comparison + '==' + queryItem);
            try {
                setLoading(true);
                console.log('gettings posts...');
                const postQuery = query(collection(firestore, 'posts'),
                    where(comparison, '==', queryItem),
                    orderBy('createdAt', 'desc'));
                const postDocs = await getDocs(postQuery);
                console.log(postDocs);
                let posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                if (router.query.pid) {
                    console.log('handling pid');
                    posts = posts.filter(post => router.query.pid as string === post.id)
                }
                setPostStateValue((prev) => ({
                    ...prev,
                    posts: posts as Post[],
                    selectedPost: posts[0] as Post,
                }));
                setLoading(false);
                console.log('got posts');
            } catch (error) {
                console.log(error);
            }
        }
    };

    const onVote = async (post: Post, vote: number, communityId: string) => {
        if (!auth.currentUser) {
            setAuthModalState(prev => ({ open: true, view: 'login' }));
            return;
        }
        console.log('onVote');
        console.log("@param post: " + post.id);
        console.log("@param vote: " + vote);
        console.log("@param communityId " + communityId);
        try {
            const batch = writeBatch(firestore);
            let updatedPost = { ...post };
            let updatedPostState = [...postStateValue.posts];
            let updatedPostVotes = [...postStateValue.postVotes];
            const postVotesCollection = collection(firestore, `users/${auth.currentUser.uid}/postVotes`);
            const querySnapshot = query(postVotesCollection, where('postId', '==', post.id));
            const queryDocs = await getDocs(querySnapshot);
            const postRef = doc(firestore, `posts/${post.id}`);
            const postDoc = await getDoc(postRef);
            // user has not voted yet (new vote)
            if (queryDocs.size === 0) {
                console.log('existingVote undefined => adding new postVote...');
                const postVoteRef = doc(collection(firestore, `users/${auth.currentUser.uid}/postVotes`), post.id);
                const newVote: PostVote = {
                    user: auth.currentUser.uid,
                    postId: post.id,
                    communityId: post.communityId,
                    voteValue: vote,
                };
                console.log('setting new vote doc: ' + postVoteRef.id + ' with ' + newVote.postId);
                batch.set(postVoteRef, newVote);
                batch.update(postRef, {
                    voteStatus: post.voteStatus + vote
                });
                updatedPost.voteStatus += vote;
                updatedPostState = updatedPostState.filter(post => post.id !== post.id);
                updatedPostState.push(updatedPost);
                updatedPostVotes.push(newVote);
            }
            //user has voted
            else {
                //get the post and vote reference for existingVote
                const postVoteRef = doc(firestore, `users/${auth.currentUser.uid}/postVotes/${post.id}`);
                const postVoteDoc = await getDoc(postVoteRef);
                //user has voted, and is voing the same again (remove vote)
                const postVoteData = { ...postVoteDoc.data() } as PostVote;
                const postDocData = { id: postDoc.id, ...postDoc.data() } as Post;
                console.log('vote value: ' + postVoteData);
                console.log('vote status: ' + postDocData);
                if (postVoteData.voteValue === vote) {
                    console.log('same vote... removing post vote');
                    batch.delete(postVoteRef); //delete the postVote doc from firebase
                    batch.update(postRef, { //update the vote status on the post
                        voteStatus: postDocData.voteStatus - postVoteData.voteValue
                    });
                    updatedPost.voteStatus -= vote;
                    updatedPostState = updatedPostState.filter(post => post.id !== post.id);
                    updatedPostState.push(updatedPost);
                    updatedPostVotes = updatedPostVotes.filter(vote => vote.postId !== post.id);
                }
                //negate the user vote value and update post.voteStatus by +/-2
                else {
                    console.log('updating post vote value +/-2');
                    batch.update(postVoteRef, {
                        voteValue: vote
                    });
                    batch.update(postRef, {
                        voteStatus: postDocData.voteStatus + (vote * 2)
                    });
                    updatedPost.voteStatus += (vote * 2);
                    updatedPostState = updatedPostState.filter(post => post.id !== post.id);
                    updatedPostState.push(updatedPost);
                    updatedPostVotes = updatedPostVotes.filter(vote => vote.postId !== post.id);
                    updatedPostVotes.push({
                        user: auth.currentUser.uid,
                        postId: post.id,
                        communityId: post.communityId,
                        voteValue: vote,
                    });
                }
            }
            //commit to firebase, then update the post state
            console.log(updatedPostState);
            console.log(updatedPost);
            await batch.commit().then((result) => {
                console.log(result);
                setPostStateValue(prev => ({
                    posts: updatedPostState,
                    selectedPost: updatedPost,
                    postVotes: updatedPostVotes,
                }));
            });
        } catch (error) {
            console.log(error);
        }
    }

    const getMyPostVotes = async () => {
        if (!auth.currentUser) {
            return;
        }
        console.log('getMyPostVotes');
        setLoading(true);
        const postVoteCollection = collection(firestore, `users/${auth.currentUser?.uid}/postVotes/`);
        const voteDocs = await getDocs(postVoteCollection);
        const votes = voteDocs.docs.map((doc) => ({ ...doc.data() }) as PostVote);
        setPostStateValue(prev => ({
            ...prev,
            postVotes: votes,
        }));
        setLoading(false);
    };


    useEffect(() => {
        if (auth.currentUser) { getMyPostVotes(); }
        getPosts();
    }, [!postStateValue.posts && auth.currentUser?.uid && postStateValue.postVotes])

    useEffect(() => {
        getPosts();
    }, [router.isReady])


    const onSelectPost = async (post: Post): Promise<boolean> => {
        console.log('onSelectPost...');
        console.log('setting state with ' + post.id);
        if (post.id) {
            setPostStateValue((prev) => ({
                ...prev,
                posts: [post] as Post[],
                selectedPost: post,
            }));
        }
        router.push(`/r/${post.communityId}/comments/${post.id}`);
        console.log(postStateValue.selectedPost?.id);
        console.log(postStateValue.posts);
        return false;
    }

    const onDeletePost = async (post: Post): Promise<boolean> => {
        console.log('onDeletePost...');
        const postDocRef = doc(firestore, 'posts', post.id);
        await deleteDoc(postDocRef).then(() => {
            if (post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`);
                deleteObject(imageRef)
            }
        }).finally(() => {
            setPostStateValue((prev) => ({
                ...prev,
                posts: prev.posts.filter(item => item.id !== post.id)
            }));
            return true;
        }).catch((error) => console.log(error.message));
        return false;
    };

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onDeletePost,
        onSelectPost,
        getPosts,
        getMyPostVotes,
        loading,
    };
};
export default usePosts;