// components/ExtractedTextPreview.js
import React from 'react';
import { Box, Heading, Icon, Text } from '@chakra-ui/react';
import { FaRegFileAlt } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const ExtractedTextPreview = () => {
  const { state } = useApp();
  const { generatedText, activeResultSection } = state;

  if (!generatedText || activeResultSection === 'Chatbot') {
    return null;
  }

  return (
    <Box borderRadius="xl" p={6} mb={6} bg="green.50" borderWidth="1px" borderColor="green.200">
      <Heading size="md" mb={3} color="green.700">
        <Icon as={FaRegFileAlt} mr={2} display="inline" />
        API Successfully Extracted Text:
      </Heading>
      <Box maxH="150px" overflowY="auto" p={3} borderRadius="md" bg="white" fontSize="sm" whiteSpace="pre-wrap">
        {generatedText.length > 500 ? generatedText.substring(0, 500) + '...' : generatedText}
      </Box>
    </Box>
  );
};

export default React.memo(ExtractedTextPreview);