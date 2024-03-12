import { communityState } from '@/src/atoms/communitiesAtom';
import About from '@/src/components/Community/About';
import Header from '@/src/components/Community/Header';
import PageContent from '@/src/components/Layout/PageContent';
import NewPostForm from '@/src/components/Posts/NewPostForm';
import { auth } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { getServerSideProps } from 'next/dist/build/templates/pages';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

type submitProps = {

};

const submit: React.FC<submitProps> = () => {
    const user = auth.currentUser;
    const { communityStateValue, getCommunityData } = useCommunityData();
    const router = useRouter();
    useEffect(() => {
        console.log(router.query[1]);
        const { communityId } = router.query;
        if (communityId !== undefined) {
            getCommunityData(communityId as string);
        }
        getCommunityData(router.query[1] as string);

    }, [auth.currentUser?.uid])
    return (
        <>
            <Header />
            < PageContent >
                <>
                    <Box p='14px 0px' borderBottom={'1px solid'} borderColor={'white'} >
                        <Text>
                            Create a post
                        </Text>
                        <NewPostForm />
                    </Box>
                </>
                <>
                    <About />
                </>
            </PageContent >
        </>
    )
}
export default submit;