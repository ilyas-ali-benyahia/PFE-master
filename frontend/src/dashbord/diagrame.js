import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Textarea,
  useToast,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose', // Allows for clickable nodes
});

const MermaidDiagramGenerator = () => {
  const [diagramCode, setDiagramCode] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [includeColors, setIncludeColors] = useState(true);
  const [includeClicks, setIncludeClicks] = useState(true);
  const diagramRef = useRef(null);
  const toast = useToast();

  // Function to render the diagram
  const renderDiagram = async () => {
    if (!diagramCode || !diagramRef.current) return;

    try {
      // Clear any existing diagram
      diagramRef.current.innerHTML = '';

      // Render the diagram
      const { svg } = await mermaid.render('mermaid-diagram', diagramCode);
      diagramRef.current.innerHTML = svg;
    } catch (err) {
      setError(`Error rendering diagram: ${err.message}`);
      toast({
        title: 'Rendering Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Generate diagram from API
  const generateDiagram = async () => {
    if (!inputText.trim()) {
      setError('Please enter a text description');
      toast({
        title: 'Input Required',
        description: 'Please enter a text description for your diagram',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      // Send the request to the API
      const response = await axios.post('http://127.0.0.1:8000/agent/generate_diagram/', {
        text: inputText,
        include_colors: includeColors,
        include_clicks: includeClicks
      });
      
      // Get the diagram code from the response
      const receivedDiagramCode = response.data.diagram_code;
      
      if (!receivedDiagramCode) {
        throw new Error('No diagram code received from the API');
      }
      
      setDiagramCode(receivedDiagramCode);
      toast({
        title: 'Success',
        description: 'Diagram generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(`API error: ${errorMessage}`);
      toast({
        title: 'API Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect to render diagram when code changes
  useEffect(() => {
    renderDiagram();
  }, [diagramCode]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">Mermaid Diagram Generator</Heading>

        <FormControl>
          <FormLabel htmlFor="description">Describe your diagram:</FormLabel>
          <Textarea
            id="description"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter a text description of the diagram you want to create..."
            size="lg"
            minH="150px"
          />
        </FormControl>

        <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
          <Checkbox
            isChecked={includeColors}
            onChange={(e) => setIncludeColors(e.target.checked)}
          >
            Include colors
          </Checkbox>

          <Checkbox
            isChecked={includeClicks}
            onChange={(e) => setIncludeClicks(e.target.checked)}
          >
            Include clickable nodes
          </Checkbox>
        </Flex>

        <Button
          onClick={generateDiagram}
          isLoading={loading}
          loadingText="Generating..."
          colorScheme="blue"
          size="lg"
        >
          Generate Diagram
        </Button>

        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>Generated Diagram</Heading>

          {loading ? (
            <Flex justify="center" align="center" minH="300px">
              <Spinner size="xl" />
              <Text ml={4}>Generating diagram...</Text>
            </Flex>
          ) : (
            <Box
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              p={6}
              overflow="auto"
              minH="300px"
              bg="white"
            >
              <div ref={diagramRef} className="mermaid">
                {diagramCode || 'No diagram generated yet'}
              </div>
            </Box>
          )}
        </Box>

        {diagramCode && (
          <Box>
            <Heading as="h2" size="lg" mb={4}>Mermaid Code</Heading>
            <Textarea
              value={diagramCode}
              isReadOnly
              fontFamily="monospace"
              size="md"
              minH="150px"
            />
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default MermaidDiagramGenerator;