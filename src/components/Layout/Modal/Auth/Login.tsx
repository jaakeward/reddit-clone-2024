import { authModalState } from '@/src/atoms/authModalAtom';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { auth } from '@/src/firebase/clientApp'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_ERRORS } from '@/src/firebase/errors';
import { authUserState } from '@/src/atoms/authUserAtom';

type LoginProps = {
    user: typeof auth.currentUser
};

const Login: React.FC<LoginProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const setAuthUserState = useSetRecoilState(authUserState);
    const [error, setError] = useState('');
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });
    //Firebase Logic: onSubmit
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
            .then((result) => {
                setAuthModalState(prev => ({
                    ...prev,
                    open: false,
                }));
                setAuthUserState(prev => ({
                    ...prev,
                    logged_in: true,
                    uid: result.user.uid
                }));
            }).catch((fberror) => {
                setError(FIREBASE_ERRORS[fberror.message as keyof typeof FIREBASE_ERRORS]);
            });
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name='email'
                placeholder='email'
                type='email'
                mb={2}
                fontSize='10pt'
                onChange={onChange}
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
            <Input
                required
                name='password'
                placeholder='password'
                type='password'
                mb={2}
                fontSize='10pt'
                onChange={onChange}
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
            <Text textAlign='center' color='red' fontSize='10pt'>
                {error}
            </Text>
            <Flex justifyContent='center' mb={2}>
                <Text fontSize='9pt'
                    cursor={'pointer'}
                    mr={1}
                    color='blue.500'
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "resetPassword",
                        }))}>
                    Forgot password?
                </Text>
            </Flex>
            <Button type='submit' width='100%' height='36px'>Login</Button>
            <Flex mt={1} fontSize="9pt" justifyContent="center">
                <Text mr={1}>New here?</Text>
                <Text color="blue.500"
                    fontWeight={700}
                    cursor='pointer'
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "signup",
                        }))}>Sign Up</Text>
            </Flex>
        </form >
    )
}
export default Login;