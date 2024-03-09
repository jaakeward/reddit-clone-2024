import { Stack, Button, Flex, Input, Image } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
    selectedFile?: string;
    onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedTab: (value: string) => void;
    setSelectedFile: (value: string) => void;

};

const ImageUpload: React.FC<ImageUploadProps> = ({
    selectedFile, onSelectImage, setSelectedFile, setSelectedTab

}) => {
    const selectedFileRef = useRef<HTMLInputElement>(null);

    return (
        < Flex justify={'center'} align={'center'} width={'100%'}>
            {selectedFile ?
                <><Stack spacing={3}>
                    <Image src={selectedFile}
                        maxWidth={'400px'}
                        maxHeight={'400px'} />
                    <Stack direction={'row'} justify={'center'}>
                        <Button
                            height={'28px'}
                            onClick={() => setSelectedTab('Post')}>Back to Post</Button>
                        < Button
                            height={'28px'}
                            onClick={() => setSelectedFile("")}> Remove</Button>
                    </Stack>
                </Stack>
                </> :
                <Flex justify={'center'}
                    align={'center'}
                    p={20}
                    border={'1px dashed'}
                    borderColor={'gray.200'}
                    width={'100%'}
                    borderRadius={4}>
                    <Button variant={'outline'}
                        height={'28px'}
                        onClick={() => { selectedFileRef.current?.click(); }}>
                        Upload
                    </Button>
                    <Input type='file'
                        ref={selectedFileRef}
                        hidden
                        onChange={onSelectImage}
                    />
                </Flex>}
        </Flex >
    )
}
export default ImageUpload;