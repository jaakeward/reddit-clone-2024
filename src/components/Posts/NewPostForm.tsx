import { Flex, Icon } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
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
import uuid, { v4 } from 'uuid';
import { Community } from '@/src/atoms/communitiesAtom';

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
}

const NewPostForm: React.FC<NewPostFormProps> = () => {
    const authUser = useRecoilState(authUserState)
    const router = useRouter();
    const setAuthModalState = useSetRecoilState(authModalState);
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const [textInputs, setTextInputs] = useState({
        title: '',
        body: '',
    });
    const [selectedFile, setSelectedFile] = useState<string>();
    const [loading, setLoading] = useState(false);
    const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
            console.log(event.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target.result as string);
                console.log(readerEvent.target.result);
            }
        }

    };
    const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTextInputs(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
        console.log(textInputs);
    };

    const handleCreatePost = async () => {
        console.log('handling post creation...');
        //get the user or login
        if (!authUser) {
            setAuthModalState({ open: true, view: 'login' });
            return;
        }
        console.log('user is logged in as ' + authUser);
        //get current community from router
        const community = router.query.communityId as string;
        console.log(router.query);
        console.log(community)
        //assign post values
        const newPost: Post = {
            id: '',
            communityId: community as string,
            creatorId: auth.currentUser!.uid,
            creatorDisplayName: auth.currentUser!.displayName ? auth.currentUser!.displayName : auth.currentUser!.email!.split('@')[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfCommens: 0,
            voteStatus: 0,
            createdAt: Timestamp.fromDate(new Date()),
            imageURL: selectedFile ? selectedFile : undefined,
            communityImageURL: ''

        };
        console.log('new post data: ');
        setLoading(true);
        console.log("adding post");

        try {
            const postsCollection = collection(firestore, 'posts');
            const postDocRef = await addDoc(postsCollection, newPost);

            console.log("got collection and checcking image");
            if (selectedFile) {
                console.log("got image and uploading data");
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, 'data_url');
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(postDocRef, {
                    imageURL: downloadURL,
                    id: postDocRef.id
                })
                console.log('post data set')
            }
        } catch (error: any) { console.log(error.message) };
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
                        onSelectImage={onSelectImage}
                        setSelectedFile={setSelectedFile}
                        setSelectedTab={setSelectedTab}
                        selectedFile={selectedFile}
                    />}

            </Flex>
        </Flex>
    );
}
export default NewPostForm;