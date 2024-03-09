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
import firebase from 'firebase/compat/app';

const usePosts = () => {
    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const router = useRouter();
    const { communityStateValue } = useCommunityData();
    const [loading, setLoading] = useState(false);
    const authUser = useRecoilValue(authUserState);
    const setAuthModalState = useSetRecoilState(authModalState);

    const getPosts = async () => {
        setLoading(true);
        console.log('gettings posts...');
        const postQuery = query(collection(firestore, 'posts'),
            where('communityId', '==', router.query.communityId as string),
            orderBy('createdAt', 'desc'));
        const postDocs = await (getDocs(postQuery));
        const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPostStateValue(prev => ({
            ...prev,
            posts: posts as Post[]
        }));
        setLoading(false);
        console.log('got posts');
    };

    //created new document / collection for postVotes on posts/{post.id}/postVotes/{auth.currentUser.uid} => voteValue: vote
    //create aggregate function for post vote totals

    const onVote = async (post: Post, vote: number, communityId: string) => {
        if (!auth.currentUser) {
            setAuthModalState(prev => ({ open: true, view: 'login' }));
            return;
        }
        console.log("@param post: " + post.id);
        console.log("@param vote: " + vote);
        console.log("@param communityId " + communityId);
        try {
            const batch = writeBatch(firestore);
            let updatedPost = { ...post };
            let updatedPostState = [...postStateValue.posts];
            const postVotesCollection = collection(firestore, `posts/${post.id}/postVotes`);
            const querySnapshot = query(postVotesCollection, where('user', '==', auth.currentUser.uid));
            const queryDocs = await getDocs(querySnapshot);
            const postRef = doc(firestore, `posts/${post.id}`);
            const postDoc = await getDoc(postRef);
            // user has not voted yet (new vote)
            if (queryDocs.size === 0) {
                console.log('existingVote undefined => adding new postVote...');
                const postVoteRef = doc(collection(firestore, `posts/${post.id}/postVotes`), auth.currentUser.uid);
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
            }
            //user has voted
            else {
                //get the post and vote reference for existingVote
                const postVoteRef = doc(firestore, `posts/${post.id}/postVotes/${auth.currentUser.uid}`);
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
                }
            }
            //commit to firebase, then update the post state
            console.log(updatedPostState);
            console.log(updatedPost);
            await batch.commit().then((result) => {
                setPostStateValue(prev => ({
                    ...prev,
                    posts: updatedPostState,
                }));
            });
            //getPosts();
        } catch (error) {
            console.log(error);
        }
    }
    const onGetPost = async (postId: string) => {
        try {
            const postDocRef = doc(firestore, 'posts', postId);
            const postDoc = getDoc(postDocRef);
            if (postDoc) {
                const docData = Promise.resolve(postDoc).then((doc) =>
                    setPostStateValue(prev => ({
                        ...prev,
                        selectedPost: { id: doc.id, ...doc.data() } as Post,
                    }))
                ).finally(() => {
                    console.log('completed')
                });
            }
        } catch (error) {
            console.log(error);
            process.exit()
        }

    }
    const onSelectPost = async (post: Post): Promise<boolean> => {
        console.log('onSelectPost...');
        console.log('setting state with ' + post.id);
        if (post.id) {
            setPostStateValue((prev) => ({
                posts: [post] as Post[],
                selectedPost: post,
                postVotes: prev.postVotes,
            }));
            window.history.pushState(postStateValue, "", `/r/${postStateValue.selectedPost?.communityId}/comments/${postStateValue.selectedPost?.id}`);
        }
        console.log(postStateValue.selectedPost?.id);
        console.log(postStateValue.posts);
        return false;
    }

    // useEffect(() => {
    //     if (communityStateValue.currentCommunity?.communityId) {
    //         window.history.pushState(postStateValue, "", `/r/${postStateValue.selectedPost?.communityId}/comments/${postStateValue.selectedPost?.id}`);
    //     }
    // }, [postStateValue.selectedPost?.id !== undefined])

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

    // useEffect(() => {
    //     const { pid } = router.query
    //     console.log(pid);
    //     if (postStateValue.selectedPost?.id !== pid) {
    //         onGetPost(pid as string);
    //     }
    //     console.log(postStateValue.selectedPost?.id);
    // }, [postStateValue.selectedPost === undefined])

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onDeletePost,
        onSelectPost,
        getPosts,
        loading
    };
};
export default usePosts;