import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Heading,
  Container,
  useColorModeValue,
  FormControl,
  InputGroup,
  InputRightElement,
  Spinner,
  FormLabel,
  Badge,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  Image,
  Progress
} from '@chakra-ui/react';
import {
  ArrowForwardIcon,
  AttachmentIcon,
  MoonIcon,
  SunIcon,
  DeleteIcon,
  RepeatIcon,
  InfoIcon,
  SettingsIcon,
  ChatIcon
} from '@chakra-ui/icons';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  // Move all useColorModeValue calls to the top
  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('blue.600', 'blue.800');
  const userMsgBg = useColorModeValue('blue.500', 'blue.400');
  const botMsgBg = useColorModeValue('gray.100', 'gray.700');
  const botMsgColor = useColorModeValue('gray.800', 'white');
  const messagesBg = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const uploadAreaBg = useColorModeValue('gray.50', 'gray.700');
  const uploadAreaBorderColor = useColorModeValue('blue.300', 'blue.500');

  // Greeting message
  useEffect(() => {
    if (isInitialized && messages.length === 1) {
      setTimeout(() => {
        setMessages([
          ...messages,
          {
            text: "Welcome to Gym Assistant! I'm here to help with your fitness journey. Ask me anything about workouts, nutrition, or recovery techniques.",
            sender: 'bot'
          }
        ]);
      }, 1000);
    }
  }, [isInitialized, messages]);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
        setFile(selectedFile);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a .txt file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        fileInputRef.current.value = null;
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        setIsInitialized(true);
        setMessages([
          { text: "Knowledge base uploaded and processed successfully! How can I help you with your fitness questions?", sender: 'bot' }
        ]);
        toast({
          title: 'Upload successful',
          description: 'Your knowledge base is ready to use',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessages([
        { text: "There was an error uploading the file. Please try again.", sender: 'bot' }
      ]);
      toast({
        title: 'Upload failed',
        description: error.message || 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!inputMessage.trim() || !isInitialized) return;
    
    const userMessage = { text: inputMessage, sender: 'user', timestamp: new Date().toISOString() };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/chat/', {
        message: inputMessage
      });

      const botMessage = { 
        text: response.data.response, 
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        text: "Sorry, I couldn't process your message. Please try again.", 
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      toast({
        title: 'Error',
        description: 'Failed to send message. Check your connection.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    // Save current conversation to history
    if (messages.length > 1) {
      const currentConversation = {
        id: Date.now(),
        title: `Conversation ${conversationHistory.length + 1}`,
        messages: [...messages],
        date: new Date().toLocaleDateString()
      };
      setConversationHistory([currentConversation, ...conversationHistory]);
    }
    
    // Clear current messages but keep the initial message
    setMessages(isInitialized ? [messages[0]] : []);
    
    toast({
      title: 'Chat cleared',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  };

  const tryAgain = async () => {
    if (messages.length <= 1) return;
    
    // Get the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.sender === 'user');
    if (lastUserMessageIndex === -1) return;
    
    const lastUserMessage = [...messages].reverse()[lastUserMessageIndex];
    
    // Remove messages after the last user message
    const newMessages = messages.slice(0, messages.length - lastUserMessageIndex);
    setMessages(newMessages);
    setInputMessage(lastUserMessage.text);
  };

  const quickPrompts = [
    "What's a good full-body workout routine?",
    "How much protein should I eat daily?",
    "What are the best exercises for core strength?",
    "How do I improve my running endurance?"
  ];

  return (
    <Container maxW="1200px" h="100vh" p={0}>
      <Flex direction="column" h="full" bg={bgColor} borderRadius="md" overflow="hidden" boxShadow="xl">
        
        {/* Header */}
        <Box bg={headerBg} p={4} color="white">
          <Flex justify="space-between" align="center">
            <Heading size="md" display="flex" alignItems="center">
              <Text as="span" fontSize="2xl" mr={2}>💪</Text> 
              Gym Assistant Pro
            </Heading>
            <HStack spacing={2}>
              <Tooltip label="Toggle dark mode">
                <IconButton
                  aria-label="Toggle dark mode"
                  icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.300' }}
                />
              </Tooltip>
              {isInitialized && (
                <>
                  <Tooltip label="Clear conversation">
                    <IconButton
                      aria-label="Clear conversation"
                      icon={<DeleteIcon />}
                      onClick={clearChat}
                      size="sm"
                      variant="ghost"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.300' }}
                    />
                  </Tooltip>
                  <Tooltip label="Try again">
                    <IconButton
                      aria-label="Try again"
                      icon={<RepeatIcon />}
                      onClick={tryAgain}
                      size="sm"
                      variant="ghost"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.300' }}
                      isDisabled={messages.length <= 1}
                    />
                  </Tooltip>
                </>
              )}
              <Menu>
                <Tooltip label="Settings">
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<SettingsIcon />}
                    variant="ghost"
                    color="white"
                    size="sm"
                    _hover={{ bg: 'whiteAlpha.300' }}
                  />
                </Tooltip>
                <MenuList>
                  <MenuItem icon={<InfoIcon />}>About</MenuItem>
                  {!isInitialized && (
                    <MenuItem 
                      icon={<AttachmentIcon />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload new file
                    </MenuItem>
                  )}
                  {conversationHistory.length > 0 && (
                    <MenuItem icon={<ChatIcon />}>View history</MenuItem>
                  )}
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>
        
        {!isInitialized ? (
          /* Upload Section */
          <VStack flex="1" justify="center" align="center" p={8} spacing={6}>
            <Box textAlign="center" mb={2}>
              <Image 
                src="/api/placeholder/150/150" 
                alt="Gym Assistant" 
                borderRadius="full"
                fallback={
                  <Flex 
                    w="150px" 
                    h="150px" 
                    bg="blue.500" 
                    borderRadius="full" 
                    justify="center" 
                    align="center"
                  >
                    <Text fontSize="5xl">💪</Text>
                  </Flex>
                }
                mb={4}
              />
              <Heading size="lg" mb={2}>Welcome to Gym Assistant Pro</Heading>
              <Text color="gray.500">Upload your knowledge base to get started</Text>
            </Box>
            
            <FormControl>
              <FormLabel htmlFor="file-upload" cursor="pointer">
                <Flex 
                  align="center" 
                  justify="center" 
                  border="2px dashed" 
                  borderColor={uploadAreaBorderColor}
                  borderRadius="lg" 
                  p={8} 
                  w="full"
                  bg={uploadAreaBg}
                  _hover={{ bg: hoverBg, borderColor: 'blue.500' }}
                  transition="all 0.2s"
                >
                  <VStack spacing={4}>
                    <Box
                      p={4}
                      bg="blue.100"
                      color="blue.600"
                      borderRadius="full"
                      _dark={{
                        bg: 'blue.800',
                        color: 'blue.200'
                      }}
                    >
                      <AttachmentIcon boxSize={10} />
                    </Box>
                    <Text fontSize="lg" fontWeight="medium">Drag and drop or click to upload</Text>
                    <Text fontSize="sm" color="gray.500">Only .txt files are supported</Text>
                  </VStack>
                </Flex>
                <Input 
                  id="file-upload"
                  type="file" 
                  accept=".txt"
                  onChange={handleFileChange}
                  hidden
                  ref={fileInputRef}
                />
              </FormLabel>
            </FormControl>

            {file && (
              <HStack spacing={2} p={2} borderRadius="md" borderWidth="1px" borderColor={borderColor} w="full" justify="center">
                <AttachmentIcon color="blue.500" />
                <Text fontWeight="medium" isTruncated maxW="300px">{file.name}</Text>
                <Badge colorScheme="blue" ml={2}>
                  {(file.size / 1024).toFixed(1)} KB
                </Badge>
              </HStack>
            )}
            
            {isUploading && (
              <Box w="full">
                <Progress value={uploadProgress} size="sm" colorScheme="blue" borderRadius="md" />
                <Text mt={2} fontSize="sm" textAlign="center">{uploadProgress}% uploaded</Text>
              </Box>
            )}
            
            <Button 
              colorScheme="blue" 
              onClick={handleUpload} 
              isDisabled={!file || isUploading}
              isLoading={isUploading}
              loadingText="Processing knowledge base..."
              w="full"
              size="lg"
              fontSize="md"
              height="50px"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              {isUploading ? 'Uploading...' : 'Upload and Initialize'}
            </Button>
          </VStack>
        ) : (
          <>
            {/* Messages Container */}
            <Box flex="1" p={4} overflowY="auto" bg={messagesBg}>
              <VStack spacing={4} align="stretch">
                {messages.map((message, index) => (
                  <Box key={index}>
                    <Flex 
                      alignItems="flex-start"
                      justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                    >
                      {message.sender === 'bot' && (
                        <Avatar 
                          size="sm" 
                          mr={2} 
                          name="Gym Assistant" 
                          src="/api/placeholder/32/32"
                          bg="blue.500"
                          icon={<Text fontSize="xs">💪</Text>}
                        />
                      )}
                      <Box 
                        bg={message.sender === 'user' ? userMsgBg : botMsgBg}
                        color={message.sender === 'user' ? 'white' : botMsgColor}
                        p={3}
                        borderRadius="lg"
                        maxW="70%"
                        boxShadow="sm"
                        borderTopLeftRadius={message.sender === 'bot' ? '2px' : undefined}
                        borderTopRightRadius={message.sender === 'user' ? '2px' : undefined}
                        position="relative"
                        borderWidth={message.isError ? '1px' : '0'}
                        borderColor={message.isError ? 'red.300' : undefined}
                      >
                        <Text>{message.text}</Text>
                        {message.timestamp && (
                          <Text 
                            fontSize="xs" 
                            opacity="0.7" 
                            textAlign={message.sender === 'user' ? 'right' : 'left'}
                            mt={1}
                          >
                            {formatTime(message.timestamp)}
                          </Text>
                        )}
                      </Box>
                      {message.sender === 'user' && (
                        <Avatar 
                          size="sm" 
                          ml={2} 
                          name="User" 
                          bg="gray.500" 
                        />
                      )}
                    </Flex>
                  </Box>
                ))}
                {isLoading && (
                  <Flex alignItems="flex-start">
                    <Avatar 
                      size="sm" 
                      mr={2} 
                      name="Gym Assistant" 
                      src="/api/placeholder/32/32"
                      bg="blue.500"
                      icon={<Text fontSize="xs">💪</Text>}
                    />
                    <Box 
                      bg={botMsgBg} 
                      p={3} 
                      borderRadius="lg" 
                      boxShadow="sm"
                      borderTopLeftRadius="2px"
                    >
                      <HStack spacing={2}>
                        <Spinner size="sm" color="blue.500" />
                        <Text>Analyzing your question...</Text>
                      </HStack>
                    </Box>
                  </Flex>
                )}
                <Box ref={messagesEndRef} />
              </VStack>
            </Box>
            
            {/* Quick Prompts */}
            {messages.length < 3 && (
              <Box p={4} borderTopWidth="1px" borderColor={borderColor}>
                <Text fontSize="sm" mb={2} color="gray.500">Try asking:</Text>
                <Flex wrap="wrap" gap={2}>
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      onClick={() => {
                        setInputMessage(prompt);
                        handleSubmit();
                      }}
                      _hover={{ bg: 'blue.50', _dark: { bg: 'blue.900' } }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </Flex>
              </Box>
            )}
            
            {/* Input Form */}
            <Box as="form" onSubmit={handleSubmit} p={4} borderTopWidth="1px" borderColor={borderColor}>
              <InputGroup size="lg">
                <Input
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about workouts, nutrition, etc..."
                  isDisabled={isLoading}
                  pr="4.5rem"
                  _focus={{ boxShadow: `0 0 0 1px ${userMsgBg}` }}
                  variant="filled"
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="blue"
                    type="submit" 
                    isDisabled={isLoading || !inputMessage.trim()}
                    rightIcon={<ArrowForwardIcon />}
                    borderRadius="lg"
                  >
                    Send
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Text fontSize="xs" color="gray.500" mt={1} textAlign="center">
                Powered by Gym Assistant Pro | Always here to help with your fitness journey
              </Text>
            </Box>
          </>
        )}
      </Flex>
    </Container>
  );
};

export default ChatBot;