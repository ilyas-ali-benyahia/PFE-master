// // components/ProgressSteps.js
// import React from 'react';
// import { Flex, HStack, Box, Text, Icon } from '@chakra-ui/react';
// import { BsArrowRight } from 'react-icons/bs';
// import { useApp } from '../context/AppContext';

// const ProgressSteps = () => {
//   const { state } = useApp();
//   const { activeTab } = state;

//   const steps = ['Upload', 'Choose Option', 'Get Results'];

//   return (
//     <Flex mb={6} justify="center">
//       <HStack spacing={4}>
//         {steps.map((step, index) => (
//           <Flex key={step} align="center">
//             <Box
//               w={6}
//               h={6}
//               borderRadius="full"
//               bg={index <= activeTab ? 'purple.500' : 'gray.200'}
//               color={index <= activeTab ? 'white' : 'gray.600'}
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               fontSize="sm"
//               fontWeight="bold"
//             >
//               {index + 1}
//             </Box>
//             <Text ml={2} fontSize="sm" color={index <= activeTab ? 'gray.800' : 'gray.600'}>
//               {step}
//             </Text>
//             {index < steps.length - 1 && <Icon as={BsArrowRight} ml={4} color="gray.600" />}
//           </Flex>
//         ))}
//       </HStack>
//     </Flex>
//   );
// };

// export default React.memo(ProgressSteps);
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Progress,
  Spinner,
  useInterval
} from '@chakra-ui/react';

 const ProcessingIndicator = ({ isProcessing, onComplete }) => {
  const [progressValue, setProgressValue] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
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
      mt={8}
      p={6}
      bg="white"
      borderRadius="xl"
      boxShadow="md"
      borderWidth="1px"
      borderColor="gray.100"
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
      <Flex justify="space-between" mb={6}>
        {steps.map((step, index) => (
          <Flex key={step.id} direction="column" align="center">
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
              fontSize="sm"
              fontWeight={currentStep === index ? 'bold' : 'normal'}
              color={currentStep >= index ? 'purple.600' : 'gray.500'}
            >
              {step.name}
            </Text>
          </Flex>
        ))}
      </Flex>
      
      {/* Current Status */}
      <Flex align="center">
        <Spinner 
          size="sm" 
          color="purple.500" 
          mr={3}
          thickness="3px"
          speed="0.65s"
        />
        <Text fontSize="md" fontWeight="medium">
          {steps[currentStep]?.message}
        </Text>
        <Text ml="auto" fontWeight="bold" color="purple.600">
          {Math.round(progressValue)}%
        </Text>
      </Flex>
    </Box>
  );
};

// Usage example:
export default React.memo(ProcessingIndicator)