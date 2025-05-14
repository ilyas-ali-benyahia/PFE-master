// components/UploadSection.js
import React, { useRef, useCallback } from 'react';
import {
  Box,
  Text,
  Icon,
  Heading,
  chakra,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputLeftElement,
  Button,
  Progress,
  Flex,
  useToast,
  Stack,
  Container,
  Center,
  VStack,
  Image,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FaFileUpload, FaYoutube, FaLink, FaRegFileAlt, FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileAlt, FaFileImage } from 'react-icons/fa';
import { MdOutlineDragIndicator, MdCloudUpload } from 'react-icons/md';

import { useApp } from '../context/AppContext';
import * as api from '../services/api';

const UploadSection = () => {
  const { state, actions } = useApp();
  const { file, youtubeUrl, isProcessing, progressValue, activeTab, showStudyOptions } = state;
  const { setFile, setYoutubeUrl, setActiveTab, setIsProcessing, setProgressValue, setGeneratedText, setShowStudyOptions } = actions;
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileChange = useCallback(async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsProcessing(true);

      try {
        const data = await api.uploadFile(selectedFile);
        if (data?.extracted_text) {
          setGeneratedText(data.extracted_text);
          setShowStudyOptions(true); // Show study options after upload
          toast({
            title: 'Success!',
            description: 'Your content is ready for transformation.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      } finally {
        setIsProcessing(false);
      }
    }
  }, [setFile, setIsProcessing, setGeneratedText, setShowStudyOptions, toast]);

  const handleYoutubeSubmit = useCallback(async () => {
    if (youtubeUrl && youtubeUrl.includes('youtube.com')) {
      setIsProcessing(true);

      try {
        const data = await api.uploadYoutubeUrl(youtubeUrl);
        if (data?.extracted_text) {
          setGeneratedText(data.extracted_text);
          setShowStudyOptions(true); // Show study options after upload
          toast({
            title: 'Success!',
            description: 'Your content is ready for transformation.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to process YouTube video. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid YouTube URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  }, [youtubeUrl, setIsProcessing, setGeneratedText, setShowStudyOptions, toast]);

  return (
    <Box 
      w="100%" 
      borderRadius={{ base: "lg", md: "xl", lg: "2xl" }} 
      p={{ base: 4, md: 6, lg: 8 }} 
      mb={{ base: 4, md: 6, lg: 8 }} 
      

    >
      <Box textAlign={{ base: "center", md: "left" }}>
        <Heading 
          size={{ base: "xl", md: "xl", lg: "xl" }} 
          mb={{ base: 3, md: 4, lg: 6 }} 
          lineHeight="shorter"
          textAlign={"center"}
        >
          Welcome <chakra.span color="purple.500"> {state.username}</chakra.span>
        </Heading>
        <Text 
          fontSize={{ base: "md", md: "lg", lg: "xl" }} 
          color="gray.700" 
          mb={{ base: 4, md: 6, lg: 8 }}
          textAlign={"center"}
        >
          Start learning effortlessly—upload your content and choose a study tool.
        </Text>
      </Box>
      
      <Tabs 
        isFitted 
        variant="soft-rounded" 
        colorScheme="purple" 
        onChange={setActiveTab} 
        index={activeTab}
      >
        <TabList 
          bg="gray.100" 
          p={{ base: 1, md: 2 }} 
          borderRadius="lg" 
          flexDirection={{ base: "column", sm: "row" }}
        >
          <Tab 
            _selected={{ bg: 'purple.500', color: 'white' }} 
            fontWeight="medium"
            py={{ base: 2, md: 2 }}
            fontSize={{ base: "sm", md: "md" }}
          >
            <Icon as={FaFileUpload} mr={2} />
            <Text display={{ base: "none", sm: "inline" }}>Upload File</Text>
            <Text display={{ base: "inline", sm: "none" }}>File</Text>
          </Tab>
          <Tab 
            _selected={{ bg: 'purple.500', color: 'white' }} 
            fontWeight="medium"
            py={{ base: 2, md: 2 }}
            fontSize={{ base: "sm", md: "md" }}
          >
            <Icon as={FaYoutube} mr={2} />
            <Text display={{ base: "none", sm: "inline" }}>YouTube URL</Text>
            <Text display={{ base: "inline", sm: "none" }}>YouTube</Text>
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={{ base: 2, md: 4 }}>
          <Box
                  borderWidth="2px"
                  borderStyle="dashed"
                  borderColor="purple.200"
                  borderRadius={{ base: "lg", md: "xl" }}
                  p={{ base: 4, sm: 6, md: 8 }}
                  textAlign="center"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{ 
                    bg: 'purple.50', 
                    borderColor: 'purple.500', 
                    transform: 'scale(1.01)',
                    boxShadow: 'md'
                  }}
                  onClick={() => fileInputRef.current.click()}
                  bg="gray.50"
                  position="relative"
                  overflow="hidden"
                >
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center"
                    position="relative"
                    zIndex="2"
                  >
                    <Icon 
                      as={MdCloudUpload} 
                      boxSize={{ base: 10, sm: 12, md: 16 }} 
                      color="purple.500" 
                      mb={{ base: 3, md: 4 }}
                    />
                    <Text 
                      color="purple.600" 
                      fontWeight="bold" 
                      fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                      mb={{ base: 2, md: 3 }}
                    >
                      Click to Upload 
                    </Text>
                    <Text 
                      color="gray.700" 
                      fontSize={{ base: "xs", sm: "sm", md: "md" }}
                      mb={{ base: 3, md: 4 }}
                    >
                      Drag & drop files or click to browse
                    </Text>
                    
                    <Grid 
                      templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(5, 1fr)" }}
                      gap={{ base: 2, md: 3 }}
                      mt={{ base: 2, md: 4 }}
                      w="full"
                      maxW="md"
                      justifyItems="center"
                    >
                      <GridItem>
                        <VStack spacing={1}>
                          <Icon as={FaFilePdf} color="red.500" boxSize={{ base: 5, md: 6 }} />
                          <Text fontSize="xs" color="gray.600">PDF</Text>
                        </VStack>
                      </GridItem>
                      <GridItem>
                        <VStack spacing={1}>
                          <Icon as={FaFileWord} color="blue.500" boxSize={{ base: 5, md: 6 }} />
                          <Text fontSize="xs" color="gray.600">DOCX</Text>
                        </VStack>
                      </GridItem>
                      <GridItem>
                        <VStack spacing={1}>
                          <Icon as={FaFilePowerpoint} color="orange.500" boxSize={{ base: 5, md: 6 }} />
                          <Text fontSize="xs" color="gray.600">PPTX</Text>
                        </VStack>
                      </GridItem>
                      <GridItem display={{ base: "none", md: "block" }}>
                        <VStack spacing={1}>
                          <Icon as={FaFileAlt} color="gray.500" boxSize={{ base: 5, md: 6 }} />
                          <Text fontSize="xs" color="gray.600">TXT</Text>
                        </VStack>
                      </GridItem>
                      <GridItem display={{ base: "none", md: "block" }}>
                        <VStack spacing={1}>
                          <Icon as={FaFileImage} color="green.500" boxSize={{ base: 5, md: 6 }} />
                          <Text fontSize="xs" color="gray.600">JPG/PNG</Text>
                        </VStack>
                      </GridItem>
                    </Grid>
                  </Flex>
                  
                  {/* Background decorative elements */}
                  <Box 
                    position="absolute"
                    top="10%"
                    left="5%"
                    width="40px"
                    height="40px"
                    borderRadius="full"
                    bg="purple.100"
                    opacity="0.3"
                    zIndex="1"
                  />
                  <Box 
                    position="absolute"
                    bottom="15%"
                    right="10%"
                    width="60px"
                    height="60px"
                    borderRadius="full"
                    bg="purple.100"
                    opacity="0.4"
                    zIndex="1"
                  />
                  <Box 
                    position="absolute"
                    top="40%"
                    right="5%"
                    width="30px"
                    height="30px"
                    borderRadius="full"
                    bg="purple.200"
                    opacity="0.3"
                    zIndex="1"
                  />
                  <Box 
                    position="absolute"
                    bottom="5%"
                    left="15%"
                    width="25px"
                    height="25px"
                    borderRadius="full"
                    bg="purple.200"
                    opacity="0.3"
                    zIndex="1"
                  />
                  
                  <Input
                    type="file"
                    accept=".pdf,.pptx,.docx,.txt,.jpg,.jpeg,.png"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </Box>
                {file && (
                  <Flex 
                    w="full" 
                    bg="green.50" 
                    p={{ base: 3, md: 4 }}
                    borderRadius="md" 
                    align="center" 
                    mt={{ base: 3, md: 4 }}
                    borderLeft="4px solid"
                    borderColor="green.500"
                    boxShadow="sm"
                    role="group"
                  >
                    <Icon as={FaRegFileAlt} color="green.500" boxSize={{ base: 5, md: 6 }} mr={{ base: 3, md: 4 }} />
                    <Box flex="1">
                      <Text 
                        color="green.700" 
                        fontWeight="bold" 
                        fontSize={{ base: "sm", md: "md" }}
                        isTruncated
                      >
                        {file.name}
                      </Text>
                      <Text
                        color="green.600"
                        fontSize="xs"
                        display={{ base: "none", sm: "block" }}
                      >
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process
                      </Text>
                    </Box>
                    
                  </Flex>
                )}
          </TabPanel>
          
          <TabPanel p={{ base: 2, md: 4 }}>
            <Stack spacing={4}>
              <InputGroup size={{ base: "md", md: "lg" }}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaLink} color="gray.400" />
                </InputLeftElement>
                <Input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Enter YouTube URL"
                  pr="4.5rem"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'purple.500' }}
                />
              </InputGroup>
              <Button
                colorScheme="red"
                w={{ base: "full", md: "auto" }}
                alignSelf={{ base: "stretch", md: "flex-end" }}
                onClick={handleYoutubeSubmit}
              >
                <Icon as={FaYoutube} mr={2} />
                Process Video
              </Button>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {isProcessing && (
        <Box 
          mt={{ base: 4, md: 6 }} 
          w={{ base: "100%", md: "80%", lg: "70%" }} 
          mx="auto"
        >
          <Text 
            mb={2} 
            color="gray.600"
            fontSize={{ base: "sm", md: "md" }}
          >
            Processing your content...
          </Text>
          <Progress
            value={progressValue}
            height={{ base: "8px", md: "12px" }}
            colorScheme="purple"
            borderRadius="full"
            mb={4}
            hasStripe
            isAnimated
          />
        </Box>
      )}
    </Box>
  );
};

export default React.memo(UploadSection);