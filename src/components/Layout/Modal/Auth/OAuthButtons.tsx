import { Flex, Button, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth"
import { auth, firestore } from '@/src/firebase/clientApp';
import { authModalState } from '@/src/atoms/authModalAtom';
import { authUserState } from '@/src/atoms/authUserAtom';
import { useSetRecoilState } from 'recoil';
import { FIREBASE_ERRORS } from '@/src/firebase/errors';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const OAuthButtons: React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const setAuthUserState = useSetRecoilState(authUserState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const provider = new GoogleAuthProvider();
    const signInUser = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                setAuthModalState(prev => ({
                    ...prev,
                    open: false,
                }));
                setAuthUserState(prev => ({
                    ...prev,
                    logged_in: true,
                    uid: result.user.uid
                }));
                if (!(auth.currentUser === null)) {
                    const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setError('Error: Overwriting user profile doc');
                        return;
                    }
                    setLoading(true);
                    await setDoc(userDocRef, {
                        uid: auth.currentUser.uid,
                        displayName: auth.currentUser.displayName,

                    }).then(() => {
                        setLoading(false);
                        setError('');
                    }).catch((e) => {
                        console.log(e.message);
                        setError(e.message);
                    })
                }
            }).catch((fbError) => {
                setError(FIREBASE_ERRORS[fbError.message as keyof typeof FIREBASE_ERRORS]);
            })
    }

    return (
        <Flex direction={'column'} width={'100%'} mb={4}>
            <Button variant={'oauth'} onClick={signInUser}>
                <Image src="/images/signin-assets/Web (mobile + desktop)/png@1x/light/web_light_rd_na@1x.png" height="80%" mr={4} />
                Continue with Google
            </Button>
        </Flex >
    );
}
export default OAuthButtons;
