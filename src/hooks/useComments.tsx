import React, { useEffect, useState } from 'react';
import { Comment, commentState } from '../atoms/commentAtom';
import { useRecoilState } from 'recoil';
import { auth, firestore } from '../firebase/clientApp';
import { Timestamp, collection, doc, getDoc, getDocs, orderBy, query, where, writeBatch } from 'firebase/firestore';
import usePosts from './usePosts';
import { Post } from '../atoms/postsAtom';

const useComments = () => {
    const { postStateValue, setPostStateValue } = usePosts();
    const [commentStateValue, setCommentStateValue] = useRecoilState(commentState);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    const [commentText, setCommentText] = useState('');
    const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCommentText(event.target.value);
        console.log(commentText);
    };

    const onCreateComment = async (commentText: string) => {
        if (!postStateValue.selectedPost?.id) { return; }
        try {
            setCreateLoading(true);
            const batch = writeBatch(firestore);
            const commentDocRef = doc(collection(firestore, 'comments'));
            const postDocRef = doc(firestore, 'posts', postStateValue.selectedPost!.id);

            const newComment: Comment = {
                commentId: commentDocRef.id.toString(),
                creatorId: auth.currentUser!.uid,
                creatorDisplayName: auth.currentUser?.displayName ? auth.currentUser!.displayName : auth.currentUser!.email!.split('@')[0],
                communityId: postStateValue.selectedPost!.communityId,
                createdAt: Timestamp.fromDate(new Date()),
                postId: postStateValue.selectedPost!.id,
                postTitle: postStateValue.selectedPost!.title,
                text: commentText,
            }

            batch.set(commentDocRef, newComment);
            batch.update(postDocRef, ({
                numberOfComments: postStateValue.selectedPost!.numberOfComments + 1,
            }));


            setCommentStateValue(prev => ({
                ...prev,
                postComments: [{ ...prev.postComments }, newComment] as Comment[],
                userComments: [{ ...prev.userComments }, newComment] as Comment[],
            }))
            setCommentText('');
            batch.commit()
        } catch (error) {
            console.log(error);
        }
        setCreateLoading(false);
    }

    const onDeleteComment = async (comment: Comment) => {
        if (!auth.currentUser) { return; }
        else if (auth.currentUser.uid !== comment.creatorId) {
            return;
        }
        else {
            try {
                const batch = writeBatch(firestore);
                const commentDocRef = doc(firestore, 'comments', comment.commentId);
                const postDocRef = doc(firestore, 'posts', postStateValue.selectedPost!.id);
                const postDoc = await getDoc(postDocRef);

                batch.delete(commentDocRef);
                batch.update(postDocRef, ({
                    numberOfComments: postStateValue.selectedPost!.numberOfComments - 1,
                }));

                let updatedPost = { id: postDoc.id, ...postDoc.data() } as Post;
                let updatedPosts = [...postStateValue.posts] as Post[]
                let updatedComments = [...commentStateValue.userComments] as Comment[]

                updatedComments = updatedComments.filter(item => item.commentId !== comment.commentId);
                updatedPost = {
                    ...updatedPost,
                    numberOfComments: updatedPost.numberOfComments - 1,
                }
                updatedPosts = updatedPosts.filter(item => item.id !== comment.postId);

                batch.commit();

                setCommentStateValue(prev => ({
                    ...prev,
                    postComments: updatedComments
                }));

                setPostStateValue(prev => ({
                    ...prev,
                    posts: updatedPosts,
                }))

            } catch (error) {
                console.log(error);
            }
        }
    }

    const getPostComments = async (post: Post) => {
        setFetchLoading(true);
        const commentQuery = query(collection(firestore, 'comments'),
            where('postId', '==', post.id),
            orderBy('createdAt', 'desc'));
        const commentDocs = await getDocs(commentQuery)
        let comments = commentDocs.docs.map(item => ({ commentId: item.id, ...item.data() } as Comment));
        let userComments = comments.filter(item => item.creatorId === auth.currentUser?.uid);
        setCommentStateValue(prev => ({
            ...prev,
            postComments: comments,
            userComments: userComments
        }));
        setFetchLoading(false);
    }

    useEffect(() => {
        getPostComments(postStateValue.selectedPost!)
    }, [postStateValue.selectedPost])

    return {
        onCreateComment,
        onDeleteComment,
        getPostComments,
        fetchLoading,
        createLoading,
        commentStateValue,
        setCommentStateValue,
        onTextChange,
        commentText
    }
}
export default useComments;