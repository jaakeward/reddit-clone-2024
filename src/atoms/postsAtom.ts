import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post = {
    id: string;
    communityId: string;
    creatorId: string;
    creatorDisplayName?: string;
    title: string;
    body: string;
    numberOfComments: number;
    voteStatus: number;
    createdAt: Timestamp;
    imageURL?: string;
    communityImageURL?: string;
};

export type PostVote = {
    user: string,
    postId: string,
    communityId: string,
    voteValue: number,
}

interface PostState {
    selectedPost?: Post | null,
    posts: Post[],
    postVotes: PostVote[],
}

const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
    postVotes: [],
}

export const postState = atom<PostState>({
    key: 'postState',
    default: defaultPostState,
})