import { Community } from '@/src/atoms/communitiesAtom';
import { firestore, auth } from '@/src/firebase/clientApp';
import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import React, { createContext, useEffect, useState } from 'react';
import { FaReddit } from 'react-icons/fa';
import useCommunityData from '@/src/hooks/useCommunityData'

type HeaderProps = {
    communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
    const CurrentCommunity = createContext(communityData)
    const { communityStateValue, onJoinOrLeaveCommunity, loading } = useCommunityData();
    const isJoined = communityStateValue ? communityStateValue.mySnippets.some(
        item => item.communityId === communityData.communityId
    ) : false;
    console.log(isJoined);
    return (
        <Flex direction={'column'} width={'100%'} height={'146px'}>
            <Box height={'50%'} bg={'blue.400'} />
            <Flex justify={'center'} bg={'white'} flexGrow={1}>
                <Flex width={'95%'} maxWidth={'860px'}>
                    {communityData?.imageURL ?
                        (<div>Image</div>/**<Image communityData={communityData} />*/) : (
                            < Icon as={FaReddit}
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
                                {communityData.communityId}
                            </Text>
                            <Text fontWeight={600} fontSize={'10pt'} color={'gray.400'}>
                                r/{communityData.communityId}
                            </Text>
                        </Flex>
                        <Button
                            variant={isJoined ? 'outline' : 'solid'}
                            onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
                            isLoading={loading}>
                            {isJoined ? "Joined" : "Join"}</Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex >)
}
export default Header;