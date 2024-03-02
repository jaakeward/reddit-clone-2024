import { authModalState } from '@/src/atoms/authModalAtom';
import { authUserState } from '@/src/atoms/authUserAtom'
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { User, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '@/src/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/src/firebase/errors';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Signup: React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const setAuthUserState = useSetRecoilState(authUserState);
    const [loading, setLoading] = useState(false);
    const [signupForm, setSignupForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState('');
    //Firebase Logic: onSubmit
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (error) { setError(''); }
        if (signupForm.password != signupForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        else if (!isValidPassword(signupForm.password)) {
            setError(passwordPolicy);
            return;
        }
        else {
            createUserWithEmailAndPassword(auth, signupForm.email, signupForm.password)
                .then(async (result) => {
                    setAuthModalState(prev => ({
                        ...prev,
                        open: false,
                    }));
                    setAuthUserState(prev => ({
                        ...prev,
                        logged_in: true,
                        uid: result.user.uid
                    }));
                    if (!(auth.currentUser === null)) {
                        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
                        const userDoc = await getDoc(userDocRef);
                        if (userDoc.exists()) {
                            setError('Error: Overwriting user profile doc');
                            return;
                        }
                        setLoading(true);
                        await setDoc(userDocRef, JSON.parse(JSON.stringify({
                            uid: auth.currentUser.uid,
                            displayName: auth.currentUser.displayName,

                        }))).then(() => {
                            setLoading(false);
                            setError('');
                        }).catch((e) => {
                            console.log(e.message);
                            setError(e.message);
                        })
                    }
                })
                .catch((fbError) => {
                    setError(FIREBASE_ERRORS[fbError.message as keyof typeof FIREBASE_ERRORS]);
                });
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignupForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const isValidPassword = (pswd: string) => {
        const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        return reg.test(pswd);
    };

    const passwordPolicy = `
    Password must contain 8 or more characters, including:
    one uppercase letter,
    one lowercase letter,
    one digit (0-9),
    and one special character (eg. !, %)
    `;

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
                bg="gray.50" />
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
                bg="gray.50" />
            <Input
                required
                name='confirmPassword'
                placeholder='confirm password'
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
                bg="gray.50" />
            <Text textAlign='center' color='red' fontSize='10pt'>
                {error}
            </Text>
            <Button type='submit'
                width='100%' height='36px'
                isLoading={loading}>Sign Up</Button>
            <Flex mt={1} fontSize="9pt" justifyContent="center">
                <Text mr={1}>Already signed up?</Text>
                <Text color="blue.500"
                    fontWeight={700}
                    cursor='pointer'
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "login",
                        }))}>Log In</Text>
            </Flex>
        </form >
    )
}
export default Signup;