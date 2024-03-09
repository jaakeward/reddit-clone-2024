import { atom } from 'recoil';

export interface AuthUserState {
    logged_in: boolean,
    uid: string,
};

const defaultUserState: AuthUserState = {
    logged_in: false,
    uid: '',
};

export const authUserState = atom<AuthUserState>({
    key: "authUserState",
    default: defaultUserState,
});