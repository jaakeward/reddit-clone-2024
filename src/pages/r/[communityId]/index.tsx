import { Community } from '@/src/atoms/communitiesAtom';
import { firestore } from '@/src/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import CommunityNotFound from '@/src/components/Community/NotFound';
import Header from '@/src/components/Community/Header';
import PageContent from '@/src/components/Layout/PageContent';
import CreatePostLink from '@/src/components/Community/CreatePostLink';

type CommunityPageProps = {
    communityData: Community
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
    if (!communityData.createdAt) {
        return (
            <CommunityNotFound />
        );
    }
    return (
        <div>
            <Header communityData={communityData} />
            <PageContent>
                <><CreatePostLink communityData={communityData} /></>
                <><div></div></>
            </PageContent>
        </div >
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