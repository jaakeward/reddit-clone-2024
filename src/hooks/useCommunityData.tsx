import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, communityState } from '../atoms/communitiesAtom'
import { auth, firestore } from '@/src/firebase/clientApp';
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { authUserState } from '../atoms/authUserAtom';
import { onAuthStateChanged } from 'firebase/auth';
import { authModalState } from '../atoms/authModalAtom';
import { useRouter } from 'next/router';

const useCommunityData = () => {
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setAuthModalState = useSetRecoilState(authModalState);
    const router = useRouter();
    const authUser = useRecoilValue(authUserState);
    const [isModerator, setIsModerator] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    const getCommunityData = async (communityId: string) => {
        if (communityId === undefined) { return; }
        try {
            console.log('Resolving community data...' + communityId);
            if (communityStateValue.currentCommunity?.communityId !== communityId !== undefined) {
                console.log('getting community as \'' + communityId + '\'');
                const communityDocRef = doc(firestore, 'communities', communityId);
                const communityDoc = await getDoc(communityDocRef);
                const communityData = { ...communityDoc.data() };
                if (!auth.currentUser && (communityData.privacyType !== 'public')) {
                    setAuthModalState({ open: true, view: 'login' });
                    return;
                }
                setCommunityStateValue(prev => ({
                    ...prev,
                    currentCommunity: { communityId: communityDoc.id, ...communityDoc.data() } as Community
                }));
                console.log('set community state to: ' + communityId);
                setLoadingData(false);
            }
            else {
                console.log(communityId);
                console.log(communityStateValue.currentCommunity?.communityId);
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const joinCommunity = async (communityData: Community) => {
        if (!auth.currentUser) {
            setAuthModalState({ open: true, view: 'login' });
            return;
        }
        setLoading(true);
        const batch = writeBatch(firestore);
        const newSnippet = doc(firestore, `users/${auth.currentUser?.uid}/communitySnippets/${communityData.communityId}`);
        const communityRef = doc(firestore, `communities/${communityData.communityId}`);
        if (communityData.privacyType === 'public') {
            batch.set(newSnippet, {
                communtyId: communityData.communityId,
                imageURL: communityData.imageURL ? communityData.imageURL : null
            });
            batch.update(communityRef, {
                numberOfMembers: increment(1),
            });
        }
        else if (communityData.privacyType == 'restricted') {
            /**implement restricted comms */
        }
        else if (communityData.privacyType == 'private') {
            /**implement private comms */
        }
        await batch.commit();
        setLoading(false);

    };
    const leaveCommunity = (communityId: string) => {
        const batch = writeBatch(firestore);
        setLoading(true);
        batch.delete(doc(firestore, `users/${auth.currentUser?.uid}/communitySnippets/${communityId}`));
        batch.update(doc(firestore, `communities/${communityId}`), {
            numberOfMembers: increment(-1),
        });
        batch.commit();
        setLoading(false);
    };

    const onJoinOrLeaveCommunity = async (communityData: Community, isJoined: boolean) => {
        //signed in? if not, auth modal
        if (isJoined) {
            leaveCommunity(communityData.communityId);
        }
        else {
            await joinCommunity(communityData);
        }
        await getMySnippets();

    };

    const getMySnippets = async () => {
        if (!auth.currentUser) {
            return;
        }
        const communityCollection = collection(firestore, `users/${auth.currentUser?.uid}/communitySnippets/`);
        const snippetDocs = await getDocs(communityCollection);
        const snippets = snippetDocs.docs.map((doc) => ({ communityId: doc.id, ...doc.data() } as CommunitySnippet));
        setCommunityStateValue(prev => ({
            ...prev,
            mySnippets: snippets as CommunitySnippet[],
        }));
        setLoading(false);
    }

    useEffect(() => {
        if (communityStateValue.currentCommunity?.communityId) {
            const userSnippet = communityStateValue.mySnippets.find(item => (item.communityId === communityStateValue.currentCommunity?.communityId))
            setIsModerator(userSnippet?.isModerator as boolean);
        }
    }, [communityStateValue.mySnippets !== null])

    useEffect(() => {
        onAuthStateChanged(auth, async () => {
            if (auth.currentUser) {
                getMySnippets();
                let communityId = router.query[1];
                if ((communityId !== undefined) && (communityId !== communityStateValue.currentCommunity?.communityId)) {
                    getCommunityData(communityId as string);
                }
            }
        });
    }, [authUserState, communityStateValue.currentCommunity !== undefined]);

    useEffect(() => {
        if (router.query.communityId) {
            getCommunityData(router.query.communityId as string)
        }
    }, [])

    return {
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading,
        setCommunityStateValue,
        isModerator,
        getCommunityData
    };
};
export default useCommunityData;