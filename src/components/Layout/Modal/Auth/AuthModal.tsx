import { authModalState } from '@/src/atoms/authModalAtom';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex, Text } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { auth } from '@/src/firebase/clientApp';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import ResetPassword from './ResetPassword';

const AuthModal: React.FC = () => {
    const [modalState, setModalState] = useRecoilState(authModalState);
    const handleClose = () => {
        setModalState(prev => ({
            ...prev,
            open: false,
        }));
    };
    return (
        <>
            <Modal isOpen={modalState.open} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {modalState.view === 'login' && "Login"}
                        {modalState.view === 'signup' && 'Sign Up'}
                        {modalState.view === 'resetPassword' && 'Reset Password'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        pb={10}>
                        <Flex
                            direction='column'
                            align='center'
                            justify='center'
                            width='70%'>
                            {(modalState.view === 'login' || modalState.view === 'signup') ? (
                                <>
                                    <OAuthButtons />
                                    <Text color="gray.500" fontWeight={700}>Or</Text>
                                    <AuthInputs user={auth.currentUser} />
                                </>
                            ) : (
                                <>
                                    <ResetPassword />
                                </>
                            )}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )

}
export default AuthModal;