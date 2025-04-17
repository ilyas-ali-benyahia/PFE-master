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
} from '@chakra-ui/react';
import { FaFileUpload, FaYoutube, FaLink, FaRegFileAlt } from 'react-icons/fa';
import { MdOutlineDragIndicator } from 'react-icons/md';
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
          // description: 'Failed to process your file. Please try again.',
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
    <Box w="100%" borderRadius="2xl" p={8} mb={8} bg="white" boxShadow="lg">
      <Box justifyItems={'center'}>
      <Heading size="2xl" mb={6} lineHeight="shorter">
        Welcome  <chakra.span color="purple.500"> {state.username}</chakra.span>
      </Heading>
      <Text fontSize="xl" color="gray.700" mb={8}>
        Start learning effortlessly—upload your content and choose a study tool.
      </Text>
      </Box>
      <Tabs isFitted variant="soft-rounded" colorScheme="purple" onChange={setActiveTab} index={activeTab}>
        <TabList bg="gray.100" p={2} borderRadius="lg">
          <Tab _selected={{ bg: 'purple.500', color: 'white' }} fontWeight="medium">
            <Icon as={FaFileUpload} mr={2} />
            Upload File
          </Tab>
          <Tab _selected={{ bg: 'purple.500', color: 'white' }} fontWeight="medium">
            <Icon as={FaYoutube} mr={2} />
            YouTube URL
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={4}>
            <Box
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="purple.200"
              borderRadius="lg"
              p={8}
              textAlign="center"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{ bg: 'purple.100', borderColor: 'purple.500' }}
              onClick={() => fileInputRef.current.click()}
            >
              <Icon as={MdOutlineDragIndicator} boxSize={10} color="purple.500" />
              <Text mt={4} color="purple.500" fontWeight="medium" fontSize="lg">
                 Click to Upload 
              </Text>
              <Text mt={2} color="gray.600" fontSize="sm">
                Supported formats: PDF, DOCX, PPTX, TXT, JPG, PNG
              </Text>
              <Input
                type="file"
                accept=".pdf,.pptx,.docx,.txt,.jpg,.jpeg,.png"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Box>
            {file && (
              <Flex w="full" bg="green.50" p={3} borderRadius="md" align="center" mt={4}>
                <Icon as={FaRegFileAlt} color="green.500" mr={2} />
                <Text color="green.700" fontWeight="medium" isTruncated>
                  {file.name}
                </Text>
              </Flex>
            )}
          </TabPanel>
          <TabPanel p={4}>
            <InputGroup size="lg">
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
              <Button
                colorScheme="red"
                position="absolute"
                right={0}
                onClick={handleYoutubeSubmit}
                zIndex={2}
              >
                <Icon as={FaYoutube} mr={2} />
                Go
              </Button>
            </InputGroup>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {isProcessing && (
        <Box mt={6} w={{ base: "100%", md: "80%", lg: "70%" }} mx="auto">
          <Text mb={2} color="gray.600">Processing your content...</Text>
          <Progress
                  value={progressValue}
                  height="12px"
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