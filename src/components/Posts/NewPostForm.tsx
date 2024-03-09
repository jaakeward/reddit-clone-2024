import { Alert, AlertIcon, CloseButton, Flex, Icon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '@/src/atoms/postsAtom';
import { useRouter } from 'next/router';
import { authUserState } from '@/src/atoms/authUserAtom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';
import { Timestamp, addDoc, collection, updateDoc } from 'firebase/firestore';
import { auth, firestore, storage } from '@/src/firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useSelectFile from '@/src/hooks/useSelectFile';

type NewPostFormProps = {
};

const formTabs: TabItemType[] = [
    {
        title: 'Post',
        icon: IoDocumentText,
    },
    {
        title: 'Images & Video',
        icon: IoImageOutline,
    },
    {
        title: 'Link',
        icon: BsLink45Deg,
    },
    {
        title: 'Poll',
        icon: BiPoll,
    },
    {
        title: 'Talk',
        icon: BsMic,
    },
];

export type TabItemType = {
    title: string,
    icon: typeof Icon.arguments,
};

const NewPostForm: React.FC<NewPostFormProps> = () => {
    const authUser = useRecoilState(authUserState)
    const router = useRouter();
    const setAuthModalState = useSetRecoilState(authModalState);
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const [error, setError] = useState(false);
    const [textInputs, setTextInputs] = useState({
        title: '',
        body: '',
    });
    const [loading, setLoading] = useState(false);
    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
    const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTextInputs(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
        console.log(textInputs);
    };

    const handleCreatePost = async () => {
        if (!authUser) {
            setAuthModalState({ open: true, view: 'login' });
            return;
        }
        const community = router.query.communityId as string;
        const newPost: Post = {
            id: '',
            communityId: community as string,
            creatorId: auth.currentUser!.uid,
            creatorDisplayName: auth.currentUser!.displayName ? auth.currentUser!.displayName : auth.currentUser!.email!.split('@')[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: Timestamp.fromDate(new Date()),
            imageURL: selectedFile ? selectedFile : '',
            communityImageURL: '',
        };
        setLoading(true);

        try {
            if (textInputs.title.length < 1) { throw new Error('No title given'); }
            const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);
            if (selectedFile) {
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, 'data_url');
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(postDocRef, {
                    imageURL: downloadURL,
                    id: postDocRef.id
                })
            }
            else {
                await updateDoc(postDocRef, {
                    id: postDocRef.id
                })
            }
            router.back();
        } catch (error: any) { setError(error); console.log(error.message) };
        setLoading(false);
    };

    return (
        <Flex direction={'column'}
            bg={'white'}
            borderRadius={4}
            mr={2}>
            <Flex width={'100%'}>
                {formTabs.map((item) =>
                    <><TabItem key={item.title} item={item}
                        selected={item.title === selectedTab}
                        setSelectedTab={setSelectedTab} /></>
                )}
            </Flex>
            <Flex p={4}>
                {selectedTab === 'Post' && <TextInputs textInputs={textInputs}
                    onChange={onTextChange}
                    handleCreatePost={handleCreatePost}
                    loading={loading}
                />}
                {selectedTab === 'Images & Video' &&
                    <ImageUpload
                        onSelectImage={onSelectFile}
                        setSelectedFile={setSelectedFile}
                        setSelectedTab={setSelectedTab}
                        selectedFile={selectedFile}
                    />}

            </Flex>
            {error && (
                <Alert status='error'>
                    <AlertIcon />
                    <Text>Post creation error</Text>
                    <CloseButton position='absolute' right='8px' top='8px' onClick={() => { setError(false); }} />
                </Alert>
            )}
        </Flex>
    );
}
export default NewPostForm;