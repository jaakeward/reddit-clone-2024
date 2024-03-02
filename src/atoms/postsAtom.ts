import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post = {
    id: string;
    communityId: string;
    creatorId: string;
    creatorDisplayName?: string;
    title: string;
    body: string;
    numberOfCommens: number;
    voteStatus: number;
    createdAt: Timestamp;
    imageURL?: string;
    communityImageURL?: string;
};

interface PostState {
    selectedPost: Post | null;
    posts: [];
    //postVotes
}

const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
}

export const postState = atom<PostState>({
    key: 'postState',
    default: defaultPostState,
})