import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Progress,
  Spinner,
  useInterval,
  Stack,
  useBreakpointValue
} from '@chakra-ui/react';

const ProcessingIndicator = ({ isProcessing, onComplete }) => {
  const [progressValue, setProgressValue] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Use responsive layout based on screen size
  const direction = useBreakpointValue({ base: "column", md: "row" });
  const stepsLayout = useBreakpointValue({ base: "column", sm: "row" });
  const padding = useBreakpointValue({ base: 4, md: 6 });
  const fontSize = useBreakpointValue({ base: "xs", md: "sm" });
  const spacing = useBreakpointValue({ base: 2, md: 4 });
  
  const steps = [
    { id: 0, name: 'Uploading', range: [0, 25], message: 'Receiving your files...' },
    { id: 1, name: 'Analyzing', range: [25, 50], message: 'Extracting key concepts...' },
    { id: 2, name: 'Processing', range: [50, 75], message: 'Generating study materials...' },
    { id: 3, name: 'Finalizing', range: [75, 100], message: 'Preparing your resources...' }
  ];

  // Simulate processing
  useInterval(() => {
    if (isProcessing && progressValue < 100) {
      const increment = Math.random() * 5 + 1; // Random increment between 1-5%
      const newValue = Math.min(progressValue + increment, 100);
      setProgressValue(newValue);
      
      // Update current step based on progress
      const activeStep = steps.findIndex(
        step => newValue >= step.range[0] && newValue < step.range[1]
      );
      if (activeStep !== -1 && activeStep !== currentStep) {
        setCurrentStep(activeStep);
      }
      
      if (newValue === 100) {
        onComplete();
      }
    }
  }, 500);

  // Reset when processing starts
  useEffect(() => {
    if (isProcessing) {
      setProgressValue(0);
      setCurrentStep(0);
    }
  }, [isProcessing]);

  return (
    <Box 
      mt={4}
      p={padding}
      bg="white"
      borderRadius="xl"
      boxShadow="md"
      borderWidth="1px"
      borderColor="gray.100"
      width="100%"
    >
      {/* Progress Bar */}
      <Progress
        value={progressValue}
        height="12px"
        colorScheme="purple"
        borderRadius="full"
        mb={4}
        hasStripe
        isAnimated
      />
      
      {/* Step Indicators */}
      <Flex 
        justify="space-between" 
        mb={6}
        direction={stepsLayout}
        wrap="wrap"
        gap={spacing}
      >
        {steps.map((step, index) => (
          <Flex 
            key={step.id} 
            direction="column" 
            align="center"
            flex={stepsLayout === "row" ? 1 : "unset"}
            mb={stepsLayout === "column" ? 3 : 0}
          >
            <Box
              w={6}
              h={6}
              borderRadius="full"
              bg={currentStep >= index ? 'purple.500' : 'gray.200'}
              color={currentStep >= index ? 'white' : 'gray.500'}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="bold"
              mb={1}
            >
              {currentStep > index ? '✓' : index + 1}
            </Box>
            <Text 
              fontSize={fontSize}
              fontWeight={currentStep === index ? 'bold' : 'normal'}
              color={currentStep >= index ? 'purple.600' : 'gray.500'}
              textAlign="center"
            >
              {step.name}
            </Text>
          </Flex>
        ))}
      </Flex>
      
      {/* Current Status */}
      <Flex 
        align="center" 
        direction={direction}
        wrap="wrap"
        gap={2}
      >
        <Flex align="center">
          <Spinner 
            size="sm" 
            color="purple.500" 
            mr={3}
            thickness="3px"
            speed="0.65s"
          />
          <Text 
            fontSize={fontSize} 
            fontWeight="medium"
            noOfLines={1}
          >
            {steps[currentStep]?.message}
          </Text>
        </Flex>
        <Text 
          ml={direction === "row" ? "auto" : 0} 
          fontWeight="bold" 
          color="purple.600"
          alignSelf={direction === "column" ? "flex-end" : "center"}
        >
          {Math.round(progressValue)}%
        </Text>
      </Flex>
    </Box>
  );
};

export default React.memo(ProcessingIndicator);