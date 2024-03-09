import { atom } from 'recoil';

export interface CommModalState {
    open: boolean;
};

const defaultModalState: CommModalState = {
    open: false,
};

export const commModalState = atom<CommModalState>({
    key: "commModalState",
    default: defaultModalState,
});