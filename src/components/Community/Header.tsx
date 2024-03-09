import { Box, Button, Flex, Icon, Text, Image, Spinner } from '@chakra-ui/react';
import React from 'react';
import { FaReddit } from 'react-icons/fa';
import useCommunityData from '@/src/hooks/useCommunityData'
import { useRouter } from 'next/router';

type HeaderProps = {
};

const Header: React.FC<HeaderProps> = () => {
    const { communityStateValue, onJoinOrLeaveCommunity, loading } = useCommunityData();
    const router = useRouter();
    const isJoined = communityStateValue ? communityStateValue.mySnippets.some(
        item => item.communityId === communityStateValue.currentCommunity?.communityId
    ) : false;
    return (
        <>
            {communityStateValue.currentCommunity ?
                (<Flex direction={'column'} width={'100%'} height={'146px'}>
                    <Box height={'50%'} bg={'blue.400'} />
                    <Flex justify={'center'} bg={'white'} flexGrow={1}>
                        <Flex width={'95%'} maxWidth={'860px'}>
                            {communityStateValue.currentCommunity?.imageURL ?
                                (<Image src={communityStateValue.currentCommunity?.imageURL}
                                    onClick={() => { router.push(`/r/${communityStateValue.currentCommunity?.communityId}`) }}
                                    position={'relative'}
                                    cursor={'pointer'}
                                    top={-3}
                                    color={'blue.500'}
                                    border={'4px solid white'}
                                    boxSize={'66px'}
                                    alt='Community Image'
                                    borderRadius={'50%'} />) : (
                                    < Icon as={FaReddit}
                                        cursor={'pointer'}
                                        onClick={() => { router.push(`/r/${communityStateValue.currentCommunity?.communityId}`) }}
                                        fontSize={64}
                                        position={'relative'}
                                        top={-3}
                                        color={'blue.500'}
                                        border={'4px solid white'}
                                        borderRadius={'50%'} />)
                            }
                            <Flex padding={'10px 16px'}>
                                <Flex direction={'column'} mr={6}>
                                    <Text fontWeight={800} fontSize={'16pt'}>
                                        {communityStateValue.currentCommunity?.communityId}
                                    </Text>
                                    <Text fontWeight={600} fontSize={'10pt'} color={'gray.400'}>
                                        r/{communityStateValue.currentCommunity?.communityId}
                                    </Text>
                                </Flex>
                                <Button
                                    variant={isJoined ? 'outline' : 'solid'}
                                    onClick={() => onJoinOrLeaveCommunity(communityStateValue.currentCommunity!, isJoined)}
                                    isLoading={loading}>
                                    {isJoined ? "Joined" : "Join"}</Button>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex >) : <><Spinner /></>}
        </>)
}
export default Header;