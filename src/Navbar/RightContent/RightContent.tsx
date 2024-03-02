import { Flex, Button } from '@chakra-ui/react';
import React from 'react';
import AuthButtons from './AuthButtons';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthModal from '@/src/components/Layout/Modal/Auth/AuthModal';
import { auth } from '@/src/firebase/clientApp';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
    user: typeof auth.currentUser;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
    return (
        <>
            {<AuthModal />}
            <Flex flexGrow={1} justify="right" align="center">
                {user ? <Icons /> : <AuthButtons />}
            </Flex >
            <UserMenu user={user} />
        </>
    );
}
export default RightContent;