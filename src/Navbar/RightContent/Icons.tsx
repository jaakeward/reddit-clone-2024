import React from 'react';
import { Flex, Icon } from '@chakra-ui/react';
import { BsArrowUpRightCircle, BsChat, BsChatDots } from 'react-icons/bs';
import { GrAdd } from 'react-icons/gr';
import {
    IoFilterCircleOutline,
    IoNotificationsOutline,
    IoVideocamOutline
} from 'react-icons/io5';
import { NodeNextRequest } from 'next/dist/server/base-http/node';
const Icons: React.FC = () => {
    return (
        <Flex>
            <Flex display={{ base: 'none', md: 'flex' }}
                align='center'
                borderRight='1px solid gray.200'
                mr={1.5}
                ml={1.5}
                padding={1}
                cursor='pointer'
                borderRadius={4}
                _hover={{ bg: 'gray.200' }}>
                <Icon as={BsArrowUpRightCircle} fontSize={20}></Icon>
            </Flex>
            <Flex display={{ base: 'none', md: 'flex' }}
                align='center'
                borderRight='1px solid gray.200'
                mr={1.5}
                ml={1.5}
                padding={1}
                cursor='pointer'
                borderRadius={4}
                _hover={{ bg: 'gray.200' }}>
                <Icon as={IoFilterCircleOutline} fontSize={22}></Icon>
            </Flex>
            <Flex display={{ base: 'none', md: 'flex' }}
                align='center'
                borderRight='1px solid gray.200'
                mr={1.5}
                ml={1.5}
                padding={1}
                cursor='pointer'
                borderRadius={4}
                _hover={{ bg: 'gray.200' }}>
                <Icon as={IoVideocamOutline} fontSize={22}></Icon>
            </Flex>
            <><Flex align='center'
                borderRight='1px solid gray.200'
                mr={1.5}
                ml={1.5}
                padding={1}
                cursor='pointer'
                borderRadius={4}
                _hover={{ bg: 'gray.200' }}>
                <Icon as={BsChatDots} fontSize={20}></Icon>
            </Flex>
                <Flex align='center'
                    borderRight='1px solid gray.200'
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor='pointer'
                    borderRadius={4}
                    _hover={{ bg: 'gray.200' }}>
                    <Icon as={IoNotificationsOutline} fontSize={20}></Icon>
                </Flex>
                <Flex display={{ base: 'none', md: 'flex' }}
                    align='center'
                    borderRight='1px solid gray.200'
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor='pointer'
                    borderRadius={4}
                    _hover={{ bg: 'gray.200' }}>
                    <Icon as={GrAdd} fontSize={20}></Icon>
                </Flex></>
        </Flex>
    );
}
export default Icons;