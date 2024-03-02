import { authUserState } from '@/src/atoms/authUserAtom';
import PageContent from '@/src/components/Layout/PageContent';
import NewPostForm from '@/src/components/Posts/NewPostForm';
import { auth } from '@/src/firebase/clientApp';
import { Box, Text } from '@chakra-ui/react';

import React from 'react';

type submitProps = {

};

const submit: React.FC<submitProps> = () => {
    const user = auth.currentUser;
    return (
        <div>
            <PageContent>
                <><Box p='14px 0px' borderBottom={'1px solid'} borderColor={'white'} >
                    <Text>
                        Create a post
                    </Text>
                    <NewPostForm />
                </Box></>
                <><div></div></>
            </PageContent>
        </div >
    )
}
export default submit;