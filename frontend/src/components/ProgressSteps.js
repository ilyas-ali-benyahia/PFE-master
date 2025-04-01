// components/ProgressSteps.js
import React from 'react';
import { Flex, HStack, Box, Text, Icon } from '@chakra-ui/react';
import { BsArrowRight } from 'react-icons/bs';
import { useApp } from '../context/AppContext';

const ProgressSteps = () => {
  const { state } = useApp();
  const { activeTab } = state;

  const steps = ['Upload', 'Choose Option', 'Get Results'];

  return (
    <Flex mb={6} justify="center">
      <HStack spacing={4}>
        {steps.map((step, index) => (
          <Flex key={step} align="center">
            <Box
              w={6}
              h={6}
              borderRadius="full"
              bg={index <= activeTab ? 'purple.500' : 'gray.200'}
              color={index <= activeTab ? 'white' : 'gray.600'}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="sm"
              fontWeight="bold"
            >
              {index + 1}
            </Box>
            <Text ml={2} fontSize="sm" color={index <= activeTab ? 'gray.800' : 'gray.600'}>
              {step}
            </Text>
            {index < steps.length - 1 && <Icon as={BsArrowRight} ml={4} color="gray.600" />}
          </Flex>
        ))}
      </HStack>
    </Flex>
  );
};

export default React.memo(ProgressSteps);