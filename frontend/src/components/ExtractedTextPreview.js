// components/ExtractedTextPreview.js
import React from 'react';
import { Box, Heading, Icon, Text, Flex } from '@chakra-ui/react';
import { FaRegFileAlt } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const ExtractedTextPreview = () => {
  const { state } = useApp();
  const { generatedText, activeResultSection } = state;

  if (!generatedText || activeResultSection === 'Chatbot') {
    return null;
  }

  return (
    <Box 
      borderRadius="xl" 
      p={{ base: 4, md: 6 }} 
      mb={{ base: 4, md: 6 }} 
      bg="green.50" 
      borderWidth="1px" 
      borderColor="green.200"
      width="100%"
    >
      <Flex 
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        mb={{ base: 2, md: 3 }}
      >
        <Icon 
          as={FaRegFileAlt} 
          mr={{ base: 0, md: 2 }} 
          mb={{ base: 1, md: 0 }}
          color="green.700"
          boxSize={{ base: "16px", md: "20px" }}
        />
        <Heading 
          size={{ base: "sm", md: "md" }} 
          color="green.700"
        >
          API Successfully Extracted Text:
        </Heading>
      </Flex>
      <Box 
        maxH={{ base: "120px", md: "150px" }} 
        overflowY="auto" 
        p={{ base: 2, md: 3 }} 
        borderRadius="md" 
        bg="white" 
        fontSize={{ base: "xs", md: "sm" }} 
        whiteSpace="pre-wrap"
        borderWidth="1px"
        borderColor="gray.100"
      >
        {generatedText.length > 500 ? generatedText.substring(0, 500) + '...' : generatedText}
      </Box>
    </Box>
  );
};

export default React.memo(ExtractedTextPreview);