import { Input, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex, Text, Box, Divider, Stack, Checkbox, Icon, Grid, GridItem, SimpleGrid } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { commModalState } from '@/src/atoms/commModalAtom';
import { auth, firestore } from '@/src/firebase/clientApp';
import React, { useState } from 'react';
import { BsDash, BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi'
import { IoMdCheckboxOutline } from "react-icons/io";
import { Timestamp, doc, runTransaction } from 'firebase/firestore';
import safeJsonStringify from 'safe-json-stringify';

const CreateCommunityModal: React.FC = () => {
    const [modalState, setModalState] = useRecoilState(commModalState);
    const [charsRemaining, setCharsRemaining] = useState(21);
    const [communityName, setCommunityName] = useState('');
    const [communityType, setCommunityType] = useState('public');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const user = auth.currentUser;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 21) { return; }
        setCommunityName(event.target.value)
        setCharsRemaining(21 - event.target.value.length);
    };
    const handleClose = () => {
        setModalState(prev => ({
            ...prev,
            open: false,
        }));
        setCommunityName('');
        setCharsRemaining(21);
        setError('');
    };
    const onCommunityTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCommunityType(event.target.name);
    }
    const handleCreateCommunity = async () => {
        const format = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/
        if (format.test(communityName) || (communityName.length < 3) || (communityName.length > 21)) {
            setError("Community name must be between 3-21 characters, and can only contain letters, numbers, or underscores.");
            return;
        }
        const communityDocRef = doc(firestore, 'communities', communityName);
        await runTransaction(firestore, async (transaction) => {
            const communityDoc = await transaction.get(communityDocRef);
            if (communityDoc.exists()) {
                setError('Sorry, that name is already taken. Try another.');
                return;
            }
            setLoading(true);

            transaction.set(communityDocRef, JSON.parse(JSON.stringify({
                creatorID: user?.uid,
                createdAt: Timestamp.fromDate(new Date()),
                numberOfMembers: 1,
                privacyType: communityType
            })));

            transaction.set(doc(firestore, `users/${auth.currentUser?.uid}/communitySnippets`, communityName), JSON.parse(JSON.stringify({
                communityId: communityName,
                isModerator: true,
            })));

        }).then(() => {
            setLoading(false);
            handleClose();
        }).catch((e) => {
            setError(e.message);
        })
    }
    return (
        <>
            <Modal isOpen={modalState.open} onClose={handleClose} size={'lg'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display={'flex'}
                        flexDirection={'column'}
                        fontSize={15}
                        padding={3}>
                        Create Community
                    </ModalHeader>
                    <Box pl={3} pr={3}>
                        <Divider />
                        <ModalCloseButton />
                        <ModalBody
                            display="flex"
                            flexDirection="column"
                            padding={'10px'}
                            border={'1px solid'}
                            borderColor={'gray.200'}>
                            <Text fontWeight={600} fontSize={15}>
                                Name
                            </Text>
                            <Text fontSize={11} color={'gray.400'}>
                                This name cannot be changed later.
                            </Text>
                            <Text
                                fontSize={15}
                                color={'gray.400'}
                                position={'relative'}
                                top={'25px'}
                                left={'10px'}
                                width={'20px'}>
                                r/
                            </Text>
                            <Input name='communityNameInput'
                                value={communityName}
                                position={'relative'}
                                size={'sm'}
                                pl={'22px'}
                                onChange={handleChange} />
                            <Text fontSize={'8pt'} color={charsRemaining === 0 ? 'red' : 'gray.500'}>
                                {charsRemaining} characters remaining
                            </Text>
                            <Box mt={4} mb={4}>
                                <Flex>
                                    <Box width={'50%'}>
                                        <Text fontWeight={600} fontSize={15}>
                                            Community Type
                                        </Text>
                                    </Box>
                                    <Box width={'50%'}>
                                        Other members can...
                                    </Box>
                                </Flex>
                                <Stack spacing={3}>
                                    <Grid
                                        templateColumns={'2fr 1fr 1fr 1fr'}
                                        templateRows={'1fr'.repeat(5)}>
                                        <GridItem></GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Text fontSize={11}>
                                                View
                                            </Text>
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Text fontSize={11}>
                                                Join
                                            </Text>
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Text fontSize={11}>
                                                Post/Comment
                                            </Text>
                                        </GridItem>
                                    </Grid>
                                    <Grid
                                        templateColumns={'2fr 1fr 1fr 1fr'}
                                        templateRows={'1fr'.repeat(5)}>
                                        <GridItem>
                                            <Divider />
                                            <Checkbox
                                                name='public'
                                                isChecked={communityType === 'public'}
                                                onChange={onCommunityTypeChange}
                                                pl={2}
                                                pt={1}
                                                justifyItems={'center'}>
                                                <Flex justify={'center'}>
                                                    <Icon as={BsFillPersonFill} color='gray.500' mr={2} />
                                                    <Text fontSize={11} >
                                                        Public
                                                    </Text>
                                                </Flex>
                                            </Checkbox>
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Divider />
                                            <Text fontSize={20}>
                                                <Icon as={IoMdCheckboxOutline} />
                                            </Text>
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Divider />
                                            <Text fontSize={20}>
                                                <Icon as={IoMdCheckboxOutline} />
                                            </Text>
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Divider />
                                            <Text fontSize={20}>
                                                <Icon as={IoMdCheckboxOutline} />
                                            </Text>
                                        </GridItem>
                                        <GridItem>
                                            <Divider />
                                            <Checkbox
                                                name='restricted'
                                                isChecked={communityType === 'restricted'}
                                                onChange={onCommunityTypeChange}
                                                pl={2}
                                                pt={1}
                                                justifyItems={'center'}>
                                                <Flex justify={'center'}>
                                                    <Icon as={BsFillEyeFill} color='gray.500' mr={2} />
                                                    <Text fontSize={11} >
                                                        Restricted
                                                    </Text>
                                                </Flex>
                                            </Checkbox>
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Divider />
                                            <Text fontSize={20}>
                                                <Icon as={IoMdCheckboxOutline} />
                                            </Text>
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Divider />
                                            <Text fontSize={20}>
                                                <Icon as={IoMdCheckboxOutline} />
                                            </Text>
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Divider />
                                            <Text fontSize={20}>
                                                <Icon as={BsDash} />
                                            </Text>
                                        </GridItem>
                                        <GridItem>
                                            <Divider />
                                            <Checkbox
                                                name='private'
                                                isChecked={communityType === 'private'}
                                                onChange={onCommunityTypeChange}
                                                pl={2}
                                                pt={1}
                                                justifyItems={'center'}>
                                                <Flex justify={'center'}>
                                                    <Icon as={HiLockClosed} color='gray.500' mr={2} />
                                                    <Text fontSize={11} >
                                                        Private
                                                    </Text>
                                                </Flex>
                                            </Checkbox>
                                            <Divider />
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Divider />
                                            <Text fontSize={20}>
                                                <Icon as={BsDash} />
                                            </Text>
                                            <Divider />
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Divider />
                                            <Text fontSize={20}>
                                                <Icon as={BsDash} />
                                            </Text>
                                            <Divider />
                                        </GridItem>
                                        <GridItem textAlign={'center'}>
                                            <Divider />
                                            <Text fontSize={20}>
                                                <Icon as={BsDash} />
                                            </Text>
                                            <Divider />
                                        </GridItem>
                                    </Grid>
                                </Stack>
                            </Box>
                            <Text textAlign='center' color='red' fontSize='10pt'>
                                {error}
                            </Text>
                        </ModalBody>
                    </Box>
                    <ModalFooter bg={'gray.100'} borderRadius={'0px 0px 10px 10px'}>
                        <Button
                            variant={'outline'}
                            mr={3}
                            onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            mr={3}
                            onClick={handleCreateCommunity}
                            isLoading={loading}>
                            Create Community
                        </Button>
                    </ModalFooter>
                </ModalContent >
            </Modal >
        </>
    )

}
export default CreateCommunityModal;