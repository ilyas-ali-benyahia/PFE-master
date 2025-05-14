// components/StudyOptions.js
import React, { useCallback, useRef, useEffect, useState } from 'react';
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
  useBreakpointValue,
  VStack,
  useDisclosure,
  Collapse,
  IconButton,
  Badge,
  Container,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  Button,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  Drawer
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaSitemap, FaFileAlt, FaRobot, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsLightningCharge, BsQuestionCircle, BsInfoCircle } from 'react-icons/bs';
import { useApp } from '../context/AppContext';
import * as api from '../services/api';
import ResultsSection from './ResultsSection';
import { motion, AnimatePresence } from 'framer-motion';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const StudyOptions = () => {
  const { state, actions } = useApp();
  const { generatedText, isProcessing, studyOptionsActiveTab, studyResults } = state;
  const { setIsProcessing, addStudyResult, setstudyOptionsActiveTab } = actions;
  
  const toast = useToast();
  const resultsRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(true);
  
  // Mobile drawer controls
  const { isOpen: isOptionsOpen, onToggle: onOptionsToggle, onClose: onOptionsClose, onOpen: onOptionsOpen } = useDisclosure({ defaultIsOpen: false });
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const tabListBg = useColorModeValue('gray.100', 'gray.700');
  
  // Responsive design settings
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const iconSize = useBreakpointValue({ base: 5, sm: 5, md: 6 });
  const textSize = useBreakpointValue({ base: 'sm', sm: 'md' });
  const useDrawer = useBreakpointValue({ base: true, md: false });

  const pulseAnimation = `${pulse} 2s infinite ease-in-out`;

  const studyOptions = [
    { 
      name: 'Flashcards', 
      icon: BsLightningCharge, 
      color: 'yellow.400', 
      endpoint: 'generate',
      description: 'Create interactive flashcards to test your knowledge'
    },
    { 
      name: 'Quizzes', 
      icon: BsQuestionCircle, 
      color: 'green.400', 
      endpoint: 'generate_quizzes',
      description: 'Generate practice questions and tests'
    },
    { 
      name: 'Mindmap', 
      icon: FaSitemap, 
      color: 'blue.400', 
      endpoint: 'generate_diagram',
      description: 'Visualize concepts and their relationships'
    },
    { 
      name: 'Summarize', 
      icon: FaFileAlt, 
      color: 'purple.400', 
      endpoint: 'generate_summary',
      description: 'Create concise summaries of your content'
    },
    { 
      name: 'Chatbot', 
      icon: FaRobot, 
      color: 'pink.400', 
      endpoint: 'text',
      description: 'Ask questions and get instant answers'
    },
  ];

  const resultExists = (optionName) => {
    return studyResults && studyResults[optionName] !== undefined && studyResults[optionName] !== null;
  };

  const findFirstAvailableResultIndex = () => {
    for (let i = 0; i < studyOptions.length; i++) {
      if (resultExists(studyOptions[i].name)) {
        return i;
      }
    }
    return 0;
  };

  const hasAnyResults = () => {
    return studyResults && Object.keys(studyResults).some(key => studyResults[key] !== null);
  };

  const handleStudyOptionClick = useCallback(async (option) => {
    if (isProcessing) return;

    const optionIndex = studyOptions.findIndex(o => o.name === option.name);
    setstudyOptionsActiveTab(optionIndex);
    setSelectedOption(option.name);
    setIsProcessing(true);
    setShowHint(false);
    
    toast({
      title: `Processing ${option.name}`,
      description: `Generating ${option.name.toLowerCase()}...`,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    });

    try {
      const result = await api.generateStudyContent(option.endpoint, generatedText);
      addStudyResult(option.name, result);
      
      // Close drawer on mobile after selecting an option
      if (useDrawer) {
        onOptionsClose();
      }
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (error) {
      console.error(`Error generating ${option.name}:`, error);
      toast({
        title: 'Error',
        description: `Failed to generate ${option.name}.`,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setIsProcessing(false);
      setSelectedOption(null);
    }
  }, [isProcessing, setIsProcessing, generatedText, addStudyResult, setstudyOptionsActiveTab, toast, useDrawer, onOptionsClose]);

  const handleTabChange = (index) => {
    setstudyOptionsActiveTab(index);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  // Scroll to results when tab changes
  useEffect(() => {
    if (studyOptionsActiveTab !== -1 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [studyOptionsActiveTab]);

  // Hide hint after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Set active tab based on available results
  useEffect(() => {
    if (hasAnyResults()) {
      if (studyOptionsActiveTab === -1 || studyOptionsActiveTab === undefined) {
        const firstAvailableIndex = findFirstAvailableResultIndex();
        setstudyOptionsActiveTab(firstAvailableIndex);
      }
    } else {
      setstudyOptionsActiveTab(0);
    }
  }, [studyResults, studyOptionsActiveTab, setstudyOptionsActiveTab]);

  if (!state.showStudyOptions) {
    return null;
  }
  
  // Render study options in a responsive grid or drawer
  const renderStudyOptions = () => {
    const optionsList = (
      <Box width="100%">
        {studyOptions.map((option) => (
          <Tooltip 
            key={option.name} 
            label={option.description}
            placement="top"
            hasArrow
            bg={option.color}
            color="white"
            isDisabled={isMobile}
          >
            <Box
              as={motion.div}
              p={3}
              mb={3}
              borderRadius="xl"
              bg={bgColor}
              borderWidth="2px"
              borderColor={borderColor}
              cursor="pointer"
              transition="all 0.2s ease"
              _hover={{ 
                transform: { base: 'none', md: 'translateY(-3px)' }, 
                boxShadow: 'md', 
                borderColor: option.color,
                bg: hoverBg
              }}
              onClick={() => handleStudyOptionClick(option)}
              width="100%"
              height="auto"
              position="relative"
              role="group"
              animation={selectedOption === option.name ? pulseAnimation : 'none'}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              _after={resultExists(option.name) ? {
                content: '""',
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '10px',
                height: '10px',
                borderRadius: 'full',
                bg: 'green.400',
                boxShadow: '0 0 0 2px white'
              } : {}}
            >
              <Flex 
                align="center" 
                width="100%" 
                justifyContent="flex-start"
              >
                <Box
                  p={2}
                  borderRadius="full"
                  bg={`${option.color}15`}
                  transition="all 0.3s ease"
                  mr={3}
                  _groupHover={{ bg: `${option.color}30` }}
                >
                  <Icon 
                    as={option.icon} 
                    boxSize={iconSize} 
                    color={option.color}
                  /> 
                </Box>
                
                <Text 
                  fontSize={textSize} 
                  fontWeight="semibold" 
                  color={headingColor}
                  textAlign="left"
                >
                  {option.name}
                </Text>
                
                {selectedOption === option.name && isProcessing && (
                  <Badge 
                    colorScheme="purple" 
                    variant="subtle" 
                    borderRadius="full"
                    px={2}
                    ml="auto"
                  >
                    Processing...
                  </Badge>
                )}
              </Flex>
            </Box>
          </Tooltip>
        ))}
      </Box>
    );

    if (useDrawer) {
      return (
        <>
          <Button
            leftIcon={<FaChevronDown />}
            onClick={onOptionsOpen}
            colorScheme="purple"
            variant="outline"
            width="100%"
            mb={4}
            borderRadius="lg"
          >
            Open Study Options
          </Button>

          <Drawer 
            placement="bottom" 
            onClose={onOptionsClose} 
            isOpen={isOptionsOpen}
            size="md"
          >
            <DrawerOverlay />
            <DrawerContent borderTopRadius="xl">
              <DrawerHeader borderBottomWidth="1px">
                <Flex justify="space-between" align="center">
                  <Text>Study Options</Text>
                  <IconButton 
                    icon={<FaChevronDown />} 
                    onClick={onOptionsClose}
                    aria-label="Close options"
                    size="sm"
                    variant="ghost"
                  />
                </Flex>
              </DrawerHeader>
              <DrawerBody p={4} maxHeight="70vh">
                {optionsList}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      );
    }

    return (
      <Box 
        borderRadius="xl"
        overflow="hidden"
        boxShadow="sm"
        width="100%"
        bg={tabListBg}
        p={3}
      >
        <Flex
          wrap="wrap"
          gap={3}
          justify="space-around"
        >
          {studyOptions.map((option) => (
            <Tooltip 
              key={option.name} 
              label={option.description}
              placement="top"
              hasArrow
              bg={option.color}
              color="white"
            >
              <Box
                as={motion.div}
                p={4}
                borderRadius="xl"
                bg={bgColor}
                borderWidth="2px"
                borderColor={borderColor}
                cursor="pointer"
                transition="all 0.2s ease"
                _hover={{ 
                  transform: 'translateY(-3px)', 
                  boxShadow: 'md', 
                  borderColor: option.color,
                  bg: hoverBg
                }}
                onClick={() => handleStudyOptionClick(option)}
                width={{ base: "45%", sm: "30%", lg: "18%" }}
                minWidth="150px"
                height="90px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                position="relative"
                role="group"
                animation={selectedOption === option.name ? pulseAnimation : 'none'}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                _after={resultExists(option.name) ? {
                  content: '""',
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '10px',
                  height: '10px',
                  borderRadius: 'full',
                  bg: 'green.400',
                  boxShadow: '0 0 0 2px white'
                } : {}}
              >
               <Box
                  p={3}
                  borderRadius="xl"
                  bg={`${option.color}15`}
                  transition="all 0.3s ease"
                  mb={3}
                  textAlign="center"
                  _groupHover={{ bg: `${option.color}30` }}
                >
                  <Icon 
                    as={option.icon} 
                    boxSize={iconSize} 
                    color={option.color} 
                    mb={1}
                  />
                  <Text 
                    fontSize={textSize} 
                    fontWeight="semibold" 
                    color={headingColor}
                    noOfLines={1}
                  >
                    {option.name}
                  </Text>
                </Box>

                
                
                
                {selectedOption === option.name && isProcessing && (
                  <Badge 
                    colorScheme="purple" 
                    variant="subtle" 
                    borderRadius="full"
                    px={2}
                    position="absolute"
                    bottom="-8px"
                    left="50%"
                    transform="translateX(-50%)"
                    boxShadow="sm"
                  >
                    Processing...
                  </Badge>
                )}
              </Box>
            </Tooltip>
          ))}
        </Flex>
      </Box>
    );
  };
  
  return (
    <Container maxW="container.xl" px={{ base: 2, md: 4 }}>
      <Box 
        w="100%" 
        borderRadius={{ base: "lg", md: "xl" }} 
        p={{ base: 3, md: 6 }} 
        mb={{ base: 4, md: 6 }}
      >
        <VStack spacing={4} align="stretch">
          <Flex 
            justify="space-between" 
            align="center" 
            mb={{ base: 2, md: 4 }}
            direction={{ base: 'column', sm: 'row' }}
            gap={2}
          >
            <MotionFlex 
              align="center" 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heading 
                size={headingSize} 
                color={headingColor}
                textAlign={{ base: 'center', sm: 'left' }}
                fontWeight="bold"
              >
                Transform Your Study Experience
              </Heading>
              <Tooltip label="Choose how you'd like to interact with your content" placement="top">
                <Icon 
                  as={BsInfoCircle} 
                  ml={2} 
                  color="purple.400" 
                  boxSize={5} 
                  cursor="help" 
                />
              </Tooltip>
            </MotionFlex>
          </Flex>
          
          {showHint && (
            <AnimatePresence>
              <MotionBox
                bg="purple.50"
                p={3}
                borderRadius="md"
                border="1px dashed"
                borderColor="purple.200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                mb={4}
              >
                <Flex align="center">
                  <Icon as={BsInfoCircle} color="purple.500" mr={2} />
                  <Text fontSize="sm" color="purple.700">
                    Select any option to transform your content.
                  </Text>
                </Flex>
              </MotionBox>
            </AnimatePresence>
          )}
          
          {/* Render study options */}
          {renderStudyOptions()}
          
          {hasAnyResults() && (
            <>
              <Divider my={4} borderColor={borderColor} />
              
              <MotionBox 
                ref={resultsRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                width="100%"
                maxWidth="100%"
                overflowX="auto"
              >
                <Tabs 
                  isFitted 
                  variant="soft-rounded" 
                  colorScheme="purple" 
                  onChange={handleTabChange} 
                  index={studyOptionsActiveTab}
                  isLazy
                >
                  <TabList 
                    overflowX="auto" 
                    pb={2}
                    display="flex"
                    flexWrap={{ base: "nowrap", md: "wrap" }}
                    sx={{
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": {
                        display: "none"
                      }
                    }}
                  >
                    
                  </TabList>
                  
                  <TabPanels>
                    {studyOptions.map((option) => (
                      <TabPanel key={option.name} p={{ base: 2, sm: 3, md: 4 }}>
                        <Flex align="center" mb={3}>
                          <Box
                            p={2}
                            borderRadius="full"
                            bg={`${option.color}20`}
                            mr={3}
                          >
                            <Icon as={option.icon} boxSize={5} color={option.color} />
                          </Box>
                          <Heading size="md" color={headingColor}>
                            {option.name} Results
                          </Heading>
                        </Flex>
                        
                        <Box>
                          {resultExists(option.name) ? (
                            <ResultsSection option={option.name} />
                          ) : (
                            <Alert status="info" borderRadius="md" mt={4}>
                              <AlertIcon />
                              <Text fontSize="sm">
                                No results available yet. Click the {option.name} button above to generate content.
                              </Text>
                            </Alert>
                          )}
                        </Box>
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </MotionBox>
            </>
          )}
        </VStack>
      </Box>
    </Container>
  );
};

export default React.memo(StudyOptions);