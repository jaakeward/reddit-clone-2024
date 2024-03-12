import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

export type Comment = {
    commentId: string,
    creatorId: string,
    creatorDisplayName: string,
    communityId: string,
    postId: string,
    postTitle: string,
    text: string,
    createdAt: Timestamp,
};

export interface CommentState {
    selectedComment: Comment | null,
    postComments: Comment[],
    userComments: Comment[],
}

const defaultCommentState: CommentState = {
    selectedComment: null,
    postComments: [],
    userComments: [],
};

export const commentState = atom<CommentState>({
    key: "commentState",
    default: defaultCommentState,
});