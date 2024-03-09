import React from 'react';
import { auth } from '@/src/firebase/clientApp';
import { authUserState } from '../atoms/authUserAtom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { onAuthStateChanged } from 'firebase/auth';

const useAuthUser = () => {
    const [authUser, setAuthUser] = useRecoilState(authUserState);
    onAuthStateChanged(auth, (user) => {
        setAuthUser((prev) => ({
            ...prev,
            uid: user?.uid ? user.uid : ''
        }))
    })

    return {
        authUser, setAuthUser
    }
}
export default useAuthUser;