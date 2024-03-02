import { Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';

type CommunityNotFoundProps = {

};

const CommunityNotFound: React.FC<CommunityNotFoundProps> = () => {

    return (
        <Flex direction={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            minHeight={'60vh'} >
            Sorry, that community does not exist or has been removed.
            <Link href='/'>
                <Button mt={4}>
                    Go Home
                </Button>
            </Link>
        </Flex>
    )
}
export default CommunityNotFound;