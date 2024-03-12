import { Community } from '@/src/atoms/communitiesAtom';
import { auth, firestore } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import { Box, Button, Flex, Icon, Link, Text, Skeleton, Image, SkeletonCircle, Stack } from '@chakra-ui/react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaReddit } from 'react-icons/fa';

type TopCommunitiesProps = {

};

const TopCommunities: React.FC<TopCommunitiesProps> = () => {
    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState<Community[]>()
    const { onJoinOrLeaveCommunity, communityStateValue } = useCommunityData();

    const getTopCommunities = async () => {
        setLoading(true);
        try {
            const communityQuery = query(collection(firestore, 'communities'),
                orderBy('numberOfMembers', 'desc'),
                limit(5));

            const communityDocs = await getDocs(communityQuery);
            const communities = communityDocs.docs.map(doc => ({ communityId: doc.id, ...doc.data } as Community))
            console.log("HERE ARE COMS", communities);

            setCommunities(communities);

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTopCommunities()
    }, [auth.authStateReady])

    return (
        <Flex direction={'column'}
            bg={'white'}
            borderRadius={4}
            border={'1px solid'}
            borderColor={'gray.300'}>
            <Flex align={'flex-end'}
                position={'relative'}
                color={'white'}
                p={'6px 10px'}
                height={'70px'}
                borderRadius={'4px 4px 0px 0px'}
                fontWeight={700}
                bgImage={'url(images/recCommsArt.png)'}
                backgroundSize={'cover'}
            >
                <Flex align={'flex-end'}
                    position={'absolute'}
                    bottom='0'
                    color={'black'}
                    p={'6px 10px'}
                    height={'70px'}
                    borderRadius={'4px 4px 0px 0px'}
                    fontWeight={700}
                    backgroundSize={'cover'}
                    bgGradient={'linear-gradient(to bottom, rbga(0, 0, 0, 0), rbga(0, 0, 0, 0.75))'}>
                    {/* TODO: implement gradient over image */}
                </Flex>
                Top Communities
            </Flex>


            <Flex direction={'column'}>
                {loading ? (
                    <Stack mt={2} p={3}>
                        <Flex justify="space-between" align="center">
                            <SkeletonCircle size="10" />
                            <Skeleton height="10px" width="70%" />
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <SkeletonCircle size="10" />
                            <Skeleton height="10px" width="70%" />
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <SkeletonCircle size="10" />
                            <Skeleton height="10px" width="70%" />
                        </Flex>
                    </Stack>
                ) : <>
                    {communities?.map((item, index) => {
                        const isJoined = communityStateValue.mySnippets.some(
                            (snippet) => snippet.communityId === item.communityId
                        );
                        return (
                            <Link key={item.communityId} href={`/r/${item.communityId}`}>
                                <Flex
                                    position="relative"
                                    align="center"
                                    fontSize="10pt"
                                    borderBottom="1px solid"
                                    borderColor="gray.200"
                                    p="10px 12px"
                                    fontWeight={600}
                                >
                                    <Flex width="80%" align="center">
                                        <Flex width="15%">
                                            <Text mr={2}>{index + 1}</Text>
                                        </Flex>
                                        <Flex align="center" width="80%">
                                            {item.imageURL ? (
                                                <Image
                                                    borderRadius="full"
                                                    boxSize="28px"
                                                    src={item.imageURL}
                                                    mr={2}
                                                />
                                            ) : (
                                                <Icon
                                                    as={FaReddit}
                                                    fontSize={30}
                                                    color="brand.100"
                                                    mr={2}
                                                />
                                            )}
                                            <span
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >{`r/${item.communityId}`}</span>
                                        </Flex>
                                    </Flex>
                                    <Box position="absolute" right="10px">
                                        <Button
                                            height="22px"
                                            fontSize="8pt"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onJoinOrLeaveCommunity(item, isJoined);
                                            }}
                                            variant={isJoined ? "outline" : "solid"}
                                        >
                                            {isJoined ? "Joined" : "Join"}
                                        </Button>
                                    </Box>
                                </Flex>
                            </Link>
                        );
                    })}
                    <Box p="10px 20px">
                        <Button height="30px" width="100%">
                            View All
                        </Button>
                    </Box>
                </>}
            </Flex>
        </Flex>
    )
}
export default TopCommunities;