import { authModalState } from '@/src/atoms/authModalAtom';
import { authUserState } from '@/src/atoms/authUserAtom'
import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { confirmPasswordReset, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/src/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/src/firebase/errors';
import { BsDot, BsReddit } from 'react-icons/bs';

const ResetPassword: React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await sendPasswordResetEmail(auth, email)
            .then(() => {
                setSuccess(true);
            }).catch((fbError) => {
                setError(FIREBASE_ERRORS[fbError.message as keyof typeof FIREBASE_ERRORS]);
            });
    };
    return (
        <Flex direction="column" alignItems="center" width="100%">
            <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
            <Text fontWeight={700} mb={2}>
                {success ? 'Link Sent' : 'Reset your password'}
            </Text>
            {success ? (
                <Text
                    mb={4}
                    textAlign='center'>
                    Pleae check your email for the password reset link.
                </Text>
            ) : (
                <>
                    <Text fontSize="sm" textAlign="center" mb={2}>
                        Enter the email associated with your account and we will send you a
                        reset link
                    </Text>
                    <form onSubmit={onSubmit} style={{ width: "100%" }}>
                        <Input
                            required
                            name="email"
                            placeholder="email"
                            type="email"
                            mb={2}
                            onChange={(event) => setEmail(event.target.value)}
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
                        />
                        <Text textAlign="center" fontSize="10pt" color="red">
                            {error}
                        </Text>
                        <Button
                            width="100%"
                            height="36px"
                            mb={2}
                            mt={2}
                            type="submit"
                        >
                            Reset Password
                        </Button>
                    </form>
                </>
            )}
            <Flex
                alignItems="center"
                fontSize="9pt"
                color="blue.500"
                fontWeight={700}
                cursor="pointer"
            >
                <Text
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "login",
                        }))
                    }
                >
                    LOGIN
                </Text>
                <Icon as={BsDot} />
                <Text
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "signup",
                        }))
                    }
                >
                    SIGN UP
                </Text>
            </Flex>
        </Flex>
    );
};
export default ResetPassword;