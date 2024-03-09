import React from 'react';
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { auth } from '../firebase/clientApp';

type SearchInputProps = {
    user: typeof auth.currentUser;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {

    return (
        <Flex flexGrow={1} maxWidth={user ? 'auto' : '600px'} mr={2} align="center">
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <SearchIcon color='gray.300' />
                </InputLeftElement>
                <Input name='searchText'
                    type='text'
                    placeholder='Search...'
                    fontSize="10pt"
                    _placeholder={{ color: "gray.500" }}
                    _hover={{
                        bg: "white",
                        border: "1px solid",
                        borderColor: "blue.500",
                    }}
                    _focus={{
                        outline: "none",
                        border: "1px solid",
                        borderColor: "blue.500",
                    }}
                    height="35px"
                    color="gray.500" />
            </InputGroup>
        </Flex>
    )
}
export default SearchInput;