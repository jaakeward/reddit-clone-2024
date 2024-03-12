import { Community, communityState } from '@/src/atoms/communitiesAtom';
import { firestore } from '@/src/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { createContext, useEffect, useLayoutEffect } from 'react';
import CommunityNotFound from '@/src/components/Community/NotFound';
import Header from '@/src/components/Community/Header';
import PageContent from '@/src/components/Layout/PageContent';
import CreatePostLink from '@/src/components/Community/CreatePostLink';
import Posts from '@/src/components/Posts/Posts';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import About from '@/src/components/Community/About';
import { Spinner } from '@chakra-ui/react';
import { authUserState } from '@/src/atoms/authUserAtom';
import useCommunityData from '@/src/hooks/useCommunityData';
import { useRouter } from 'next/router';

type CommunityPageProps = {
    communityData: Community
};
const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
    const router = useRouter();
    const { setCommunityStateValue, communityStateValue } = useCommunityData();
    const authUser = useRecoilValue(authUserState);
    if (!communityData) {
        return (
            <CommunityNotFound />
        );
    }

    useEffect(() => {
        setCommunityStateValue(prev => ({
            ...prev,
            currentCommunity: communityData
        }));
    }, [communityData.communityId.localeCompare(communityStateValue.currentCommunity?.communityId!) !== 0])
    return (
        <>
            <Header />
            <PageContent>
                <>
                    <CreatePostLink communityData={communityData} />
                    <Posts />
                </>
                <>
                    <About />
                </>
            </PageContent>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const communityDocRef = doc(
        firestore,
        'communities',
        context.query.communityId as string);
    const communityDoc = await getDoc(communityDocRef);
    return {
        props: { communityData: JSON.parse(JSON.stringify({ communityId: communityDoc.id, ...communityDoc.data() })) }
    };
}

export default CommunityPage;