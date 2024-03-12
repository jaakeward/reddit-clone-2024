import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, Menu, MenuButton, MenuList, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { TiHome } from 'react-icons/ti';
import Communities from './Communities';
import { auth } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import { useRouter } from 'next/router';

const Directory: React.FC = () => {
    const { communityStateValue } = useCommunityData();
    const router = useRouter();
    return (
        <Menu>
            <MenuButton
                key={'communityMenuButton'}
                cursor={'pointer'}
                padding={'0px 6px'}
                borderRadius={4}
                mr={2}
                ml={{ base: '0', md: '2' }}
                _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}>
                <Flex alignItems={'center'} justify={'space-between'} width={{ base: 'auto', lg: '200px' }}>
                    <Flex alignItems={'center'}>
                        {auth.currentUser?.photoURL ?
                            <Image maxBlockSize={'30px'} mr={{ base: '1', md: '2' }} src={auth.currentUser.photoURL} borderRadius={'full'} /> :
                            <Icon fontSize={24} mr={{ base: '1', md: '2' }} borderRadius={'full'} as={TiHome} />}
                        <Flex display={{ base: 'none', lg: 'flex' }} alignItems={'center'}>
                            <Text fontSize={14}>{router.query?.communityId ? `r/${router.query.communityId}` : 'Home'}</Text>
                        </Flex>
                    </Flex>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList>
                <Communities />
            </MenuList>
        </Menu >
    );
}
export default Directory;

function useRoute() {
    throw new Error('Function not implemented.');
}
