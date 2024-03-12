import { auth } from '@/src/firebase/clientApp';
import { authUserState } from '../atoms/authUserAtom';
import { useRecoilState } from 'recoil';
import { Auth, onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';

const useAuthUser = (auth: Auth) => {
    const [authUser, setAuthUser] = useRecoilState(authUserState);
    const [loadingUser, setLoadingUser] = useState(true);
    onAuthStateChanged(auth, (user) => {
        setAuthUser((prev) => ({
            ...prev,
            uid: user?.uid ? user.uid : '',
            logged_in: user ? true : false,
        }));
        setLoadingUser(false);
    });

    return {
        authUser, setAuthUser, loadingUser
    }
}
export default useAuthUser;