import { authModalState } from '@/src/atoms/authModalAtom';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Login from './Login';
import Signup from './Signup';
import { auth } from '@/src/firebase/clientApp';

type AuthInputsProps = {
    user: typeof auth.currentUser
};

const AuthInputs: React.FC<AuthInputsProps> = ({ user }) => {
    const modalState = useRecoilValue(authModalState);
    return (
        <Flex
            flex-direction="column"
            align="center"
            width="100%"
            mt={4}>
            {modalState.view === 'login' && <Login user={user} />}
            {modalState.view === 'signup' && <Signup />}
        </Flex>
    );
}
export default AuthInputs;