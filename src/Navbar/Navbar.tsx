import { Flex, Image } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { auth } from '../firebase/clientApp';
import { onAuthStateChanged } from 'firebase/auth';
import Directory from './Directory/Directory';

const Navbar: React.FC = () => {
    const [user, setAuthUser] = useState(auth.currentUser);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setAuthUser(user)
        })
    });
    return (
        <Flex bg="white"
            height="44px"
            padding="6px 12px"
            justify={'space-between'}>
            <Flex align="center"
                width={{ base: '40px', md: 'auto' }}
                mr={{ base: 0, md: 2 }}>
                <a href='http://localhost:3000/'>
                    <Flex>
                        <Image src="images/navImg.png" height="40px" />
                        <Image src="images/navImg2.png" height="30px" display={{ base: "none", md: "unset" }} />
                    </Flex>
                </a>
            </Flex>
            {user && <Directory />}
            <SearchInput user={user} />
            <RightContent user={user} />
        </Flex>
    );
}
export default Navbar;