import { Community } from '@/src/atoms/communitiesAtom';
import { Post } from '@/src/atoms/postsAtom';
import { Flex, Icon, Stack, Text, Image, Skeleton, Spinner } from '@chakra-ui/react';
import moment from 'moment';
import React, { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat } from 'react-icons/bs';
import { FcClock } from 'react-icons/fc';
import { IoArrowDownCircleOutline, IoArrowDownCircleSharp, IoArrowRedoOutline, IoArrowUpCircleOutline, IoArrowUpCircleSharp, IoBookmarkOutline } from 'react-icons/io5';

type PostItemProps = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: (post: Post, voteStatus: number, communityId: string) => void;
    onDeletePost: (post: Post) => {};
    onSelectPost: (post: Post) => {};
};

const PostItem: React.FC<PostItemProps> = ({
    post,
    userIsCreator,
    userVoteValue,
    onVote,
    onDeletePost,
    onSelectPost
}) => {
    const [loadingImage, setLoadingImage] = useState(false);
    const [error, setError] = useState('');
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingSelect, setLoadingSelect] = useState(false);
    const handleDelete = async () => {
        console.log('handleDelete...');
        setLoadingDelete(true);
        const success = onDeletePost(post);
        if (!success) {
            setError("Failed to delete post");
        }
        setLoadingDelete(false);
    };
    const handleSelect = async () => {
        console.log('handleSelect...');
        setLoadingSelect(true);
        const success = onSelectPost(post);
        if (!success) {
            setError("Failed to get post");
        }
        setLoadingSelect(false);

    }

    return (
        <>{
            (loadingSelect && post?.creatorDisplayName) ? <Spinner /> : (<Flex
                bg={'white'}
                borderColor={'gray.300'}
                borderRadius={4}
                _hover={{ borderColor: 'gray.500' }}
                cursor={'pointer'}
            >
                <Flex direction={'column'}
                    align={'center'}
                    bg={'gray.100'}
                    p={2}
                    width={'40px'}
                    borderRadius={4}>
                    <Icon as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
                        color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
                        fontSize={22}
                        cursor={'pointer'}
                        onClick={() => onVote(post, 1, post.communityId)}
                    />
                    <Text fontSize={'9pt'}>{post.voteStatus}</Text>
                    <Icon as={userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
                        color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
                        fontSize={22}
                        cursor={'pointer'}
                        onClick={() => onVote(post, -1, post.communityId)}
                    />
                </Flex>
                <Flex>
                    <Flex
                        direction={'column'}
                        width={'100%'}
                        onClick={handleSelect}>
                        <Stack spacing={1} p={'10px'}>
                            <Stack direction={'row'}
                                spacing={0.6}
                                align={'center'}
                                fontSize={'9pt'} >
                                <Text>Posted by u/{post.creatorDisplayName} <Icon as={FcClock} color={'gray.500'} /> {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}</Text>
                            </Stack>
                            <Text fontSize={'12pt'} fontWeight={600}>
                                {post.title}
                            </Text>
                            <Text fontSize={'10pt'}>
                                {post.body}
                            </Text>
                            {post.imageURL &&
                                <Flex justify={'center'} align={'center'} p={2}>
                                    {loadingImage ? <Skeleton height={'200px'} width={'100%'} borderRadius={4} /> :
                                        <Image src={post.imageURL} maxHeight={'460px'} alt='Post Image' display={loadingImage ? 'none' : 'unset'} onLoad={() => { setLoadingImage(false) }} />}
                                </Flex>
                            }
                        </Stack>
                        <Flex ml={1} mb={0.5} color={'gray.500'} fontWeight={400}>
                            <Flex align={'center'}
                                p={'8px 10px'}
                                borderRadius={4}
                                _hover={{ bg: 'gray.200' }}
                                cursor={'pointer'}>
                                <Icon as={BsChat} mr={2} />
                                <Text fontSize={'9pt'}>{post.numberOfComments}</Text>
                            </Flex>
                            <Flex align={'center'}
                                p={'8px 10px'}
                                borderRadius={4}
                                _hover={{ bg: 'gray.200' }}
                                cursor={'pointer'}>
                                <Icon as={IoArrowRedoOutline} mr={2} />
                                <Text fontSize={'9pt'}>Share</Text>
                            </Flex>
                            <Flex align={'center'}
                                p={'8px 10px'}
                                borderRadius={4}
                                _hover={{ bg: 'gray.200' }}
                                cursor={'pointer'}>
                                <Icon as={IoBookmarkOutline} mr={2} />
                                <Text fontSize={'9pt'}>Save</Text>
                            </Flex>
                            {userIsCreator && (<Flex align={'center'}
                                p={'8px 10px'}
                                borderRadius={4}
                                _hover={{ bg: 'gray.200' }}
                                cursor={'pointer'}
                                onClick={handleDelete}>
                                {loadingDelete ?
                                    <Spinner size={'sm'} /> :
                                    <>
                                        <Icon as={AiOutlineDelete} mr={2} />
                                        <Text fontSize={'9pt'}>Delete</Text>
                                    </>}
                            </Flex>)}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex >)
        }</>
    )
}
export default PostItem;