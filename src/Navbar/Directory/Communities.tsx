import CreateCommunityModal from '@/src/components/Layout/Modal/CreateCommunity/CreateCommunityModal';
import { Flex, Icon, MenuItem, Text, Image, Box } from '@chakra-ui/react';
import React from 'react';
import { GrAdd } from 'react-icons/gr';
import { useRecoilState } from 'recoil';
import { commModalState } from '@/src/atoms/commModalAtom';
import { useRouter } from 'next/router';
import useCommunityData from '@/src/hooks/useCommunityData';
import usePosts from '@/src/hooks/usePosts';
import { FaReddit } from 'react-icons/fa';

type CommunitiesProps = {
};

const Communities: React.FC<CommunitiesProps> = () => {
    const [commState, setCommModalState] = useRecoilState(commModalState);
    const { onJoinOrLeaveCommunity, communityStateValue, loading, setCommunityStateValue, getCommunityData } = useCommunityData();
    const { getPosts } = usePosts();
    const router = useRouter();
    return (
        <>
            <CreateCommunityModal key={'communityModal'} />
            {communityStateValue.mySnippets.find((item) => item.isModerator) && (
                <Box mt={3} mb={4}>
                    <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
                        MODERATING
                    </Text>
                    {communityStateValue.mySnippets
                        .filter((item) => item.isModerator)
                        .map((snippet) => (
                            <MenuItem
                                key={snippet.communityId}
                                id={snippet.communityId}
                                width={'100%'}
                                fontSize={'10pt'}
                                _hover={{ bg: 'gray.100' }}
                                onClick={() => {
                                    router.push('/r/' + snippet.communityId).then(() => { getCommunityData(snippet.communityId); getPosts(); });
                                }}
                            >
                                {snippet.imageURL && <Image src={snippet.imageURL} />}
                                {snippet.communityId}
                            </MenuItem >
                        ))}
                </Box >
            )}
            <Box mt={3} mb={4}>
                <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
                    MY COMMUNITIES
                </Text>
                <MenuItem
                    key={'createCommunity'}
                    width={'100%'}
                    fontSize={'10pt'}
                    _hover={{ bg: 'gray.100' }}
                    onClick={() => {
                        setCommModalState({
                            open: true,
                        });
                    }}>
                    <Flex key='menu-item-flex' align={'center'}>
                        <Icon key='menu-item-icon' fontSize={'10pt'} as={GrAdd} />
                        <Text key='menu-item-text' pl={2}>Create Community</Text>
                    </Flex>
                </MenuItem>
                {communityStateValue.mySnippets.filter(item => !item.isModerator).map((item) =>
                    <>
                        {item.communityId && <MenuItem
                            key={item.communityId}
                            id={item.communityId}
                            width={'100%'}
                            fontSize={'10pt'}
                            _hover={{ bg: 'gray.100' }}
                            onClick={() => {
                                router.push('/r/' + item.communityId).then(() => getPosts());
                            }}
                        >
                            {item.imageURL && <Image src={item.imageURL} />}
                            {item.communityId}
                        </MenuItem >}
                    </>
                )
                }
            </Box>
        </>)
}
export default Communities;
