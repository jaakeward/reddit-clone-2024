import { auth } from '@/src/firebase/clientApp';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Menu, MenuButton, MenuList, MenuItem, Icon, Flex, MenuDivider, Text } from '@chakra-ui/react';
import React from 'react';
import { FaRedditSquare } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { IoSparkles } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineLogin } from 'react-icons/md'
import { signOut } from 'firebase/auth';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';
import { authUserState } from '@/src/atoms/authUserAtom';

type UserMenuProps = {
    user: typeof auth.currentUser;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const setAuthUserState = useSetRecoilState(authUserState);
    return (
        <Menu>
            <MenuButton
                cursor={'pointer'}
                padding={'0px 6px'}
                borderRadius={4}
                _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}>
                <Flex alignItems={'center'}><Flex alignItems={'center'}>
                    {user ? (
                        <>
                            <Icon fontSize={24}
                                mr={1}
                                color='gray.300'
                                as={FaRedditSquare} />
                            <Flex
                                direction={'column'}
                                display={{ base: 'none', lg: 'flex' }}
                                fontSize={'8pt'}
                                align={'flex-start'}
                                mr={8}>
                                <Text fontWeight={700}>
                                    {user?.displayName || user.email?.split("@")[0]}
                                </Text>
                                <Flex>
                                    <Icon as={IoSparkles} color={'brand.100'} mr={1} />
                                    <Text color={'gray.400'}>1 Karma</Text>
                                </Flex>
                            </Flex>
                        </>
                    ) : (
                        <Icon fontSize={24} color={'gray.400'} mr={1} as={VscAccount} />
                    )}
                </Flex><ChevronDownIcon /></Flex>
            </MenuButton>
            <MenuList>
                {user ? <>
                    <MenuItem fontSize={'10pt'} fontWeight={700} _hover={{ bg: 'blue.500', color: 'white' }}>
                        <Icon fontSize={20} mr={2} as={CgProfile} />
                        Profile
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem fontSize={'10pt'}
                        fontWeight={700}
                        _hover={{
                            bg: 'blue.500',
                            color: 'white'
                        }}
                        onClick={() => signOut(auth)}>
                        <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                        Logout
                    </MenuItem>
                </> : <>
                    <MenuItem fontSize={'10pt'}
                        fontWeight={700}
                        _hover={{ bg: 'blue.500', color: 'white' }}
                        onClick={() => {
                            setAuthModalState((prev) => ({
                                open: true,
                                view: "login",
                            }))
                            setAuthUserState(prev => ({
                                ...prev,
                                logged_in: false,
                                uid: prev.uid
                            }))
                        }}>
                        <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                        Login / Signup
                    </MenuItem>
                    <MenuDivider />
                </>}
            </MenuList>
        </Menu >
    );
}
export default UserMenu;