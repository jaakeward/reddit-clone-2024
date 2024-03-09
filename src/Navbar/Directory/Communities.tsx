import CreateCommunityModal from '@/src/components/Layout/Modal/CreateCommunity/CreateCommunityModal';
import { Flex, Icon, MenuItem, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { GrAdd } from 'react-icons/gr';
import { useRecoilState } from 'recoil';
import { commModalState } from '@/src/atoms/commModalAtom';
import { useRouter } from 'next/router';
import useCommunityData from '@/src/hooks/useCommunityData';

type CommunitiesProps = {
};

const Communities: React.FC<CommunitiesProps> = () => {
    const [commState, setCommModalState] = useRecoilState(commModalState);
    const { onJoinOrLeaveCommunity, communityStateValue, loading, setCommunityStateValue } = useCommunityData();
    const router = useRouter();
    return (
        <>
            <CreateCommunityModal key={'communityModal'} />
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
            </MenuItem >
            {communityStateValue.mySnippets.map((item) =>
                <>
                    {item.communityId && <MenuItem
                        key={item.communityId}
                        id={item.communityId}
                        width={'100%'}
                        fontSize={'10pt'}
                        _hover={{ bg: 'gray.100' }}
                        onClick={() => {
                            router.push('/r/' + item.communityId).catch((error) => router.reload());
                        }}
                    >
                        {item.imageURL && <Image src={item.imageURL} />}
                        {item.communityId}
                    </MenuItem >}
                </>
            )
            }
        </>
    )
}
export default Communities;
