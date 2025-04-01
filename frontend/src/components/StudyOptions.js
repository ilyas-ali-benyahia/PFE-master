// components/StudyOptions.js
import React, { useCallback, useRef } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip,
  Icon,
  Text,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { FaSitemap, FaFileAlt, FaRobot } from 'react-icons/fa';
import { BsLightningCharge, BsQuestionCircle } from 'react-icons/bs';
import { useApp } from '../context/AppContext';
import * as api from '../services/api';
import ResultsSection from './ResultsSection';

const StudyOptions = () => {
  const { state, actions } = useApp();
  const { generatedText, isProcessing, activeTab } = state;
  const { setIsProcessing, addStudyResult, setActiveTab } = actions;
  const toast = useToast();
  const resultsRef = useRef(null);

  const studyOptions = [
    { name: 'Flashcards', icon: BsLightningCharge, color: 'yellow.400', endpoint: 'generate' },
    { name: 'Quizzes', icon: BsQuestionCircle, color: 'green.400', endpoint: 'generate_quizzes' },
    { name: 'Mindmap', icon: FaSitemap, color: 'blue.400', endpoint: 'generate_diagram' },
    { name: 'Summarize', icon: FaFileAlt, color: 'purple.400', endpoint: 'generate_summary' },
    { name: 'Chatbot', icon: FaRobot, color: 'pink.400', endpoint: 'text' },
  ];

  const handleStudyOptionClick = useCallback(async (option) => {
    if (isProcessing) return;

    setIsProcessing(true);
    toast({
      title: `Processing ${option.name}`,
      description: `Generating content with ${option.name}...`,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });

    try {
      const result = await api.generateStudyContent(option.endpoint, generatedText);
      addStudyResult(option.name, result);
      setActiveTab(studyOptions.indexOf(option)); // Set active tab
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' }); // Auto-scroll to results
      toast({
        title: 'Success!',
        description: `${option.name} generated successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      console.error(`Error generating ${option.name}:`, error);
      toast({
        title: 'Error',
        description: `Failed to generate ${option.name}. Please try again.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, setIsProcessing, generatedText, addStudyResult, setActiveTab, toast]);

  if (!state.showStudyOptions) {
    return null; // Hide study options until upload is complete
  }
  if (resultsRef.current) {
    resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  return (
    <Box borderRadius="xl" p={6} bg="white" boxShadow="lg">
      <Heading size="lg" mb={6} color="gray.800">
        Choose Your Study Transformation
      </Heading>
      <Tabs isFitted variant="soft-rounded" colorScheme="purple" onChange={setActiveTab} index={activeTab}>
        <TabList bg="gray.100" p={2} borderRadius="lg">
          {studyOptions.map((option) => (
            <Tooltip key={option.name} label={`Generate ${option.name}`} placement="top">
              <Tab
               
                p={6}
              borderRadius="2xl"

              bg="white"
              borderWidth="3px"
              borderColor="gray.200"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg', borderColor: option.color }}
              onClick={() => handleStudyOptionClick(option)}
              ml={2}
              mr={2}
              >
                 <Flex align="center" mb={4}>
                <Icon as={option.icon} boxSize={6} color={option.color} mr={3} />
                <Text fontSize="lg" fontWeight="medium" color="gray.800">
                  {option.name}
                </Text>
              </Flex>
              </Tab>
            </Tooltip>
          ))}
        </TabList>
        <TabPanels>
          {studyOptions.map((option) => (
            <TabPanel key={option.name} p={4}ref={resultsRef}>
              
              <ResultsSection option={option.name} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default React.memo(StudyOptions); 