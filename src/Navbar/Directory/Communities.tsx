import CreateCommunityModal from '@/src/components/Layout/Modal/CreateCommunity/CreateCommunityModal';
import { Flex, Icon, MenuItem } from '@chakra-ui/react';
import React, { useState } from 'react';
import { GrAdd } from 'react-icons/gr';
import { useRecoilState } from 'recoil';
import { commModalState } from '@/src/atoms/commModalAtom';

type CommunitiesProps = {

};

const Communities: React.FC<CommunitiesProps> = () => {
    const [commState, setCommModalState] = useRecoilState(commModalState)
    return (
        <>
            <CreateCommunityModal />
            <MenuItem
                width={'100%'}
                fontSize={'10pt'}
                _hover={{ bg: 'gray.100' }}
                onClick={() => {
                    setCommModalState({
                        open: true,
                    })
                }}>
                <Flex align={'center'}>
                    <Icon fontSize={'10pt'} as={GrAdd} />
                    Create Community
                </Flex>
            </MenuItem >
        </>
    )
}
export default Communities;
