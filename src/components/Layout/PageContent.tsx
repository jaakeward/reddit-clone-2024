import { Flex } from '@chakra-ui/react';
import React from 'react';
import CreatePostLink from '../Community/CreatePostLink';

type PageContentProps = {
    children: Object[]
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {

    return (
        <Flex justify={'center'} p={'16px 0px'}>
            <Flex width={'95%'}
                justify={'center'}
                maxWidth={'860px'}>
                <Flex direction={'column'}
                    width={{ base: '100%', md: '65%' }}
                    mr={{ base: 0, md: 6 }}>
                    <>{children[0]}</>
                </Flex>
                <Flex direction={'column'}
                    display={{ base: 'none', md: 'flex' }}
                    flexGrow={1}>
                    <>{children[1]}</>
                </Flex>
            </Flex>
        </Flex>
    )
}
export default PageContent;