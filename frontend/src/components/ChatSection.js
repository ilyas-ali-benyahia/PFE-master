import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Heading,
  InputGroup,
  Input,
  Button,
  Flex,
  Avatar,
  Text,
  useToast,
  Icon,
  Badge,
  Spinner,
  Tooltip,
  IconButton,
  Container
} from '@chakra-ui/react';
import { FaPaperPlane, FaRobot, FaUser, FaEye, FaEyeSlash, FaExpand, FaCompress } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import * as api from '../services/api';
import { supabase } from '../supabase'; // Update this path to your Supabase client

const ChatSection = () => {
  const { state, actions } = useApp();
  const { chatMessages, userMessage, isChatLoading, generatedText } = state;
  const { setUserMessage, addChatMessage, setIsChatLoading } = actions;
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const toast = useToast();
  
  // New state variables
  const [showContent, setShowContent] = useState(true);
  const [expandedChat, setExpandedChat] = useState(false);
  const [chatHeight, setChatHeight] = useState({ base: '250px', md: '300px', lg: '300px' });
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Get the session when component mounts
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setToken(data.session.access_token);
      }
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setToken(session.access_token);
        } else {
          setToken(null);
        }
      }
    );
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleChatSubmit = async () => {
    if (!userMessage.trim()) return;
    
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to use the chat.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    setIsChatLoading(true);
    const userMessageObj = { role: 'user', content: userMessage };
    addChatMessage(userMessageObj);
    setUserMessage('');

    try {
      const response = await api.sendChatMessage(userMessage, token);
      const botMessageObj = { role: 'bot', content: response.response };
      addChatMessage(botMessageObj);
    } catch (error) {
      console.error('Error sending chat message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsChatLoading(false);
      // Focus the input after message is sent
      inputRef.current?.focus();
    }
  };

  const toggleChatExpansion = () => {
    setExpandedChat(!expandedChat);
    setChatHeight(expandedChat ? 
      { base: '250px', md: '300px', lg: '300px' } : 
      { base: '400px', md: '500px', lg: '500px' }
    );
  };

  // Simple toggle for content visibility
  const toggleContentVisibility = () => {
    setShowContent(!showContent);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    // Focus on input when component mounts
    inputRef.current?.focus();
  }, []);

  if (state.studyOptionsActiveTab !== 4) {
    return null; // Only show chat section for the Chatbot option
  }

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box 
      borderRadius="xl" 
      p={{ base: 3, md: 6 }} 
      mt={6} 
      bg="white" 
      boxShadow="lg"
      width="100%"
    >
      <Flex 
        justify="space-between" 
        align={{ base: "start", md: "center" }} 
        mb={6}
        direction={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 0 }}
      >
        <Heading 
          size={{ base: "md", md: "lg" }} 
          color="gray.800"
        >
          Chat with the AI about your content
        </Heading>
        <Flex 
          gap={2} 
          width={{ base: "100%", md: "auto" }}
          justifyContent={{ base: "space-between", md: "flex-end" }}
        >
          <Tooltip label={showContent ? "Hide content" : "Show content"}>
            <Button 
              size={{ base: "xs", md: "sm" }}
              colorScheme="purple"
              variant="outline" 
              leftIcon={showContent ? <FaEyeSlash /> : <FaEye />}
              onClick={toggleContentVisibility}
              flexGrow={{ base: 1, md: 0 }}
            >
              {showContent ? "Hide Content" : "Show Content"}
            </Button>
          </Tooltip>
          <Tooltip label={expandedChat ? "Compress chat" : "Expand chat"}>
            <IconButton
              size={{ base: "xs", md: "sm" }}
              colorScheme="purple"
              variant="outline"
              icon={expandedChat ? <FaCompress /> : <FaExpand />}
              onClick={toggleChatExpansion}
              aria-label={expandedChat ? "Compress chat" : "Expand chat"}
            />
          </Tooltip>
        </Flex>
      </Flex>
      
      <Flex 
        direction={{ base: 'column', lg: 'row' }} 
        gap={4}
      >
        {/* Extracted Text Panel - Only shown when showContent is true */}
        {showContent && (
          <Box 
            flex={1} 
            bg="gray.50" 
            borderRadius="md" 
            p={{ base: 3, md: 4 }} 
            mb={{ base: 4, lg: 0 }}
            width="100%"
          >
            <Flex align="center" mb={3}>
              <Badge colorScheme="blue" mr={2}>Source</Badge>
              <Text fontWeight="bold">Extracted Text</Text>
            </Flex>
            
            <Box 
              maxH={{ base: "200px", md: "300px" }}
              overflowY="auto" 
              p={3} 
              borderRadius="md" 
              borderWidth="1px" 
              borderColor="gray.200"
              bg="white"
            >
              {generatedText ? (
                <Text whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}>{generatedText}</Text>
              ) : (
                <Text color="gray.500" fontStyle="italic" fontSize={{ base: "sm", md: "md" }}>No text extracted yet</Text>
              )}
            </Box>
          </Box>
        )}

        {/* Chat Panel */}
        <Box flex={1} w="100%">
          {/* Chat Messages */}
          <Box 
            ref={chatContainerRef} 
            h={chatHeight}
            overflowY="auto" 
            mb={4} 
            p={{ base: 2, md: 4 }}
            bg="gray.50" 
            borderRadius="md"
            borderWidth="1px" 
            borderColor="gray.200"
            transition="height 0.3s ease"
          >
            {chatMessages.length === 0 ? (
              <Flex direction="column" justify="center" align="center" h="100%" opacity={0.7}>
                <Icon as={FaRobot} fontSize={{ base: "xl", md: "3xl" }} mb={2} color="purple.500" />
                <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>Start a conversation about your content</Text>
              </Flex>
            ) : (
              chatMessages.map((message, index) => (
                <Flex 
                  key={index} 
                  align="flex-start" 
                  mb={4} 
                  direction={message.role === 'user' ? 'row-reverse' : 'row'}
                >
                  <Avatar 
                    size={{ base: "xs", md: "sm" }}
                    icon={<Icon as={message.role === 'user' ? FaUser : FaRobot} />}
                    bg={message.role === 'user' ? 'purple.500' : 'gray.500'} 
                  />
                  <Box
                    ml={message.role === 'user' ? 0 : { base: 1, md: 2 }}
                    mr={message.role === 'user' ? { base: 1, md: 2 } : 0}
                    p={{ base: 2, md: 3 }}
                    bg={message.role === 'user' ? 'purple.100' : 'white'}
                    color="gray.800"
                    borderRadius="lg"
                    maxW={{ base: "75%", md: "80%" }}
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor={message.role === 'user' ? 'purple.200' : 'gray.200'}
                  >
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color="gray.500">
                        {message.role === 'user' ? 'You' : 'AI'} • {formatTimestamp()}
                      </Text>
                    </Flex>
                    <Text 
                      whiteSpace="pre-wrap"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {message.content}
                    </Text>
                  </Box>
                </Flex>
              ))
            )}
            {isChatLoading && (
              <Flex justify="flex-start" align="center" mt={2}>
                <Avatar 
                  size={{ base: "xs", md: "sm" }} 
                  bg="gray.500" 
                  icon={<Icon as={FaRobot} />} 
                />
                <Flex 
                  ml={{ base: 1, md: 2 }}
                  p={{ base: 2, md: 3 }}
                  bg="white" 
                  borderRadius="lg" 
                  align="center"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Spinner size={{ base: "xs", md: "sm" }} mr={2} color="purple.500" />
                  <Text fontSize={{ base: "xs", md: "sm" }}>AI is thinking...</Text>
                </Flex>
              </Flex>
            )}
          </Box>

          {/* Chat Input */}
          <InputGroup size={{ base: "sm", md: "md" }}>
            <Input
              ref={inputRef}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
              pr="4.5rem"
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              borderRadius="full"
              bg="white"
              borderWidth="1px"
              focusBorderColor="purple.400"
              disabled={isChatLoading || !token}
              fontSize={{ base: "sm", md: "md" }}
            />
            <Tooltip label={!token ? "Please log in to chat" : isChatLoading ? "Waiting for response" : "Send message"}>
              <Button
                colorScheme="purple"
                position="absolute"
                right={1}
                top="50%"
                transform="translateY(-50%)"
                zIndex={2}
                onClick={handleChatSubmit}
                isLoading={isChatLoading}
                isDisabled={!userMessage.trim() || isChatLoading || !token}
                borderRadius="full"
                size={{ base: "xs", md: "sm" }}
                p={1}
                width={{ base: "1.5rem", md: "2rem" }}
                height={{ base: "1.5rem", md: "2rem" }}
              >
                <Icon as={FaPaperPlane} fontSize={{ base: "xs", md: "sm" }} />
              </Button>
            </Tooltip>
          </InputGroup>
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(ChatSection);