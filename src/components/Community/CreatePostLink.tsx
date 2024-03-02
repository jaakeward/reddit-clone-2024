import { Button, Flex, Icon, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { BsLink45Deg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authUserState } from "@/src/atoms/authUserAtom";
import { authModalState } from "@/src/atoms/authModalAtom";
import { Community } from "@/src/atoms/communitiesAtom";
type CreatePostProps = {
    communityData: Community,
};

const CreatePostLink: React.FC<CreatePostProps> = ({ communityData }) => {
    const authUser = useRecoilState(authUserState)
    const router = useRouter();
    const setAuthModalState = useSetRecoilState(authModalState);
    const pushData = {
        communityId: communityData.communityId,
        creatorId: communityData.creatorId,
        numberOfMembers: communityData.numberOfMembers,
        privacyType: communityData.privacyType,
        createdAt: communityData.createdAt,
        imageURL: communityData.imageURL ? communityData.imageURL : null
    }
    const pushCommunityPostLink = async () => {
        if (!authUser) {
            setAuthModalState({ open: true, view: 'login' });
            return;
        }
        const community = router.query[1];
        console.log(router.query);
        if (router.query) {
            await router.push(`/r/${router.query.communityId}/submit`);
            return;
        }
    };
    return (
        <Flex
            justify="space-evenly"
            align="center"
            bg="white"
            height="56px"
            borderRadius={4}
            border="1px solid"
            borderColor="gray.300"
            p={3}
            flexGrow={1}
            onClick={pushCommunityPostLink}
        >
            <Icon as={FaReddit} fontSize={36} color="gray.300" mr={4} />
            <Input
                placeholder="Create Post"
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
                borderColor="gray.200"
                height="36px"
                borderRadius={4}
                mr={4}
            />
            <Icon
                as={IoImageOutline}
                fontSize={24}
                mr={4}
                color="gray.400"
                cursor="pointer"
            />
            <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
        </Flex>
    );
};
export default CreatePostLink;