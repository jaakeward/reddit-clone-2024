import { authUserState } from '@/src/atoms/authUserAtom';
import { Community, communityState } from '@/src/atoms/communitiesAtom';
import { storage, firestore } from '@/src/firebase/clientApp';
import useAuthUser from '@/src/hooks/useAuthUser';
import useCommunityData from '@/src/hooks/useCommunityData';
import useSelectFile from '@/src/hooks/useSelectFile';
import { Box, Button, Divider, Flex, Icon, Link, Stack, Text, Image, Spinner, Input } from '@chakra-ui/react';
import { updateCurrentUser } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { FaReddit } from 'react-icons/fa';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine } from 'react-icons/ri';
import { useRecoilState, useSetRecoilState } from 'recoil';

type AboutProps = {
};

const About: React.FC<AboutProps> = ({ }) => {
    const { communityStateValue, setCommunityStateValue, loading, isModerator } = useCommunityData();
    const authUser = useRecoilState(authUserState);
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
    const [uploadingImage, setUploadingImage] = useState(false);

    const onUploadImage = async () => {
        try {
            if (communityStateValue.currentCommunity) {
                setUploadingImage(true);
                const imageRef = ref(storage, `communities/${communityStateValue.currentCommunity!.communityId}/image`);
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(doc(firestore, 'communities', communityStateValue.currentCommunity!.communityId), {
                    imageURL: downloadURL
                })
                setCommunityStateValue(prev => ({
                    ...prev,
                    currentCommunity: {
                        ...prev.currentCommunity,
                        imageURL: downloadURL
                    } as Community
                }))
            }
        } catch (error) { console.error(); }
        setUploadingImage(false);
    };

    return (
        <>{(communityStateValue.currentCommunity && !loading) ? (<>
            <Box position={'sticky'} top={'14px'}>
                {/* Top Bar */}
                <Flex
                    justify={'space-between'}
                    align={'center'}
                    bg={'blue.400'}
                    color={'white'}
                    p={3}
                    borderRadius={4}>
                    <Text fontSize={'10pt'} fontWeight={700}>About Community</Text>
                    <Icon as={HiOutlineDotsHorizontal} />
                </Flex>
                {/* Community Info */}
                <Flex direction={'column'} p={3} bg={'white'} borderRadius={'0px 0px 4px 4px'}>
                    <Stack>
                        {/* Members / Online */}
                        <Flex width={'100%'} p={2} fontSize={'10pt'} fontWeight={700}>
                            <Flex direction={'column'} flexGrow={1}>
                                <Text>{communityStateValue.currentCommunity?.numberOfMembers.toLocaleString()}</Text>
                                <Text>Members</Text>
                            </Flex>
                            <Flex direction={'column'} flexGrow={1}>
                                <Text>?</Text>
                                <Text>Online</Text>
                            </Flex>
                        </Flex>
                        <Divider />
                        {/* Create post button */}
                        <Flex align={'center'}
                            width={'100%'}
                            p={1}
                            fontWeight={500}
                            fontSize={'10pt'}>
                            <Icon as={RiCakeLine} fontSize={18} mr={2} />
                            {communityStateValue.currentCommunity &&
                                <Text>
                                    Created{' '}
                                    {moment(new Date(communityStateValue.currentCommunity!.createdAt.seconds * 1000)).format("MMM DD, YYYY")}
                                </Text>}
                        </Flex>
                        <Link href={`/r/${communityStateValue.currentCommunity!.communityId}/submit`}>
                            <Button mt={3} height={'30px'} width={'100%'}>
                                Create Post
                            </Button>
                        </Link>
                        <Divider />
                        {/* Admin Options */}
                        {isModerator &&
                            <>
                                <Stack spacing={1} fontSize={'10pt'} >
                                    <Text fontWeight={600}>
                                        Admin
                                    </Text>
                                    <Flex align={'center'} justify={'space-between'}>
                                        <Text
                                            color={'blue.500'}
                                            cursor={'pointer'}
                                            _hover={{ textDecoration: 'underline' }}
                                            onClick={() => { selectedFileRef.current?.click(); }}>
                                            Change Image
                                        </Text>
                                        {communityStateValue.currentCommunity?.imageURL || selectedFile ?
                                            <>
                                                <Image src={selectedFile || communityStateValue.currentCommunity?.imageURL} borderRadius={'full'} boxSize={'40px'} alt='Community Image' />
                                            </> :
                                            <>
                                                <Icon as={FaReddit}
                                                    fontSize={40}
                                                    color={'brand.100'}
                                                    mr={2}
                                                />
                                            </>}
                                    </Flex>
                                    {selectedFile &&
                                        (uploadingImage ? <Spinner /> :
                                            <Text cursor={'pointer'}
                                                onClick={onUploadImage}>
                                                Save Changes</Text>)
                                    }
                                    <Input id='file-upload'
                                        type='file'
                                        accept="image/x-png, image/gif, image/jpeg"
                                        hidden
                                        ref={selectedFileRef}
                                        onChange={onSelectFile} />
                                </Stack>
                            </>}
                    </Stack>
                </Flex>
            </Box >
        </>) : <></>
        }</>
    )
}
export default About;
