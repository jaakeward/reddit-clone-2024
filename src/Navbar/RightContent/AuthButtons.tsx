import { authModalState } from '@/src/atoms/authModalAtom';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';

const AuthButtons: React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    return (
        <>
            <Button variant="outline" height="28px"
                display={{ base: "none", md: "unset" }}
                width={{ base: "70px", md: "110px" }}
                mr={2}
                onClick={() => { setAuthModalState({ open: true, view: 'login' }) }}
            >
                Log In
            </Button >
            <Button height="28px"
                display={{ base: "none", md: "unset" }}
                width={{ base: "70px", md: "110px" }}
                mr={2}
                onClick={() => { setAuthModalState({ open: true, view: 'signup' }) }}
            >
                Sign up
            </Button>

        </>
    );
}
export default AuthButtons;