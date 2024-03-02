import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, communityState } from '../atoms/communitiesAtom'
import { auth, firestore } from '@/src/firebase/clientApp';
import { collection, deleteDoc, doc, documentId, getDocs, increment, query, runTransaction, setDoc, where, writeBatch } from 'firebase/firestore';
import { authUserState } from '../atoms/authUserAtom';
import { onAuthStateChanged } from 'firebase/auth';
import { authModalState } from '../atoms/authModalAtom';

const useCommunityData = () => {
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setAuthModalState = useSetRecoilState(authModalState);

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
        const communityCollection = collection(firestore, `users/${auth.currentUser?.uid}/communitySnippets/`);
        const snippetDocs = await getDocs(communityCollection);
        const snippets = snippetDocs.docs.map((doc) => ({ communityId: doc.id, ...doc.data() }));
        setCommunityStateValue(prev => ({
            ...prev,
            mySnippets: snippets as CommunitySnippet[],
        }));
        setLoading(false);
    }

    useEffect(() => {
        onAuthStateChanged(auth, () => {
            getMySnippets();
        });
    }, [authUserState]);

    return {
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading,
    };
};
export default useCommunityData;

