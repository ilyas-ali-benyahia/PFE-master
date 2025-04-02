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
  IconButton
} from '@chakra-ui/react';
import { FaPaperPlane, FaRobot, FaUser, FaEye, FaEyeSlash, FaExpand, FaCompress } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import * as api from '../services/api';

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
  const [chatHeight, setChatHeight] = useState('300px');

  const handleChatSubmit = async () => {
    if (!userMessage.trim()) return;

    setIsChatLoading(true);
    const userMessageObj = { role: 'user', content: userMessage };
    addChatMessage(userMessageObj);
    setUserMessage('');

    try {
      const response = await api.sendChatMessage(userMessage);
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
    setChatHeight(expandedChat ? '300px' : '500px');
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

  if (state.activeTab !== 4) {
    return null; // Only show chat section for the Chatbot option
  }

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box borderRadius="xl" p={6} mt={6} bg="white" boxShadow="lg">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="gray.800">
          Chat with the AI about your content
        </Heading>
        <Flex gap={2}>
          <Tooltip label={showContent ? "Hide content" : "Show content"}>
            <Button 
              size="sm" 
              colorScheme="purple"
              variant="outline" 
              leftIcon={showContent ? <FaEyeSlash /> : <FaEye />}
              onClick={toggleContentVisibility}
            >
              {showContent ? "Hide Content" : "Show Content"}
            </Button>
          </Tooltip>
          <Tooltip label={expandedChat ? "Compress chat" : "Expand chat"}>
            <IconButton
              size="sm"
              colorScheme="purple"
              variant="outline"
              icon={expandedChat ? <FaCompress /> : <FaExpand />}
              onClick={toggleChatExpansion}
              aria-label={expandedChat ? "Compress chat" : "Expand chat"}
            />
          </Tooltip>
        </Flex>
      </Flex>
      
      <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
        {/* Extracted Text Panel - Only shown when showContent is true */}
        {showContent && (
          <Box flex={1} bg="gray.50" borderRadius="md" p={4} mb={{ base: 4, md: 0 }}>
            <Flex align="center" mb={3}>
              <Badge colorScheme="blue" mr={2}>Source</Badge>
              <Text fontWeight="bold">Extracted Text</Text>
            </Flex>
            
            <Box 
              maxH="300px" 
              overflowY="auto" 
              p={3} 
              borderRadius="md" 
              borderWidth="1px" 
              borderColor="gray.200"
              bg="white"
            >
              {generatedText ? (
                <Text whiteSpace="pre-wrap">{generatedText}</Text>
              ) : (
                <Text color="gray.500" fontStyle="italic">No text extracted yet</Text>
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
            p={4} 
            bg="gray.50" 
            borderRadius="md"
            borderWidth="1px" 
            borderColor="gray.200"
            transition="height 0.3s ease"
          >
            {chatMessages.length === 0 ? (
              <Flex direction="column" justify="center" align="center" h="100%" opacity={0.7}>
                <Icon as={FaRobot} fontSize="3xl" mb={2} color="purple.500" />
                <Text color="gray.500">Start a conversation about your content</Text>
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
                    size="sm" 
                    icon={<Icon as={message.role === 'user' ? FaUser : FaRobot} />}
                    bg={message.role === 'user' ? 'purple.500' : 'gray.500'} 
                  />
                  <Box
                    ml={message.role === 'user' ? 0 : 2}
                    mr={message.role === 'user' ? 2 : 0}
                    p={3}
                    bg={message.role === 'user' ? 'purple.100' : 'white'}
                    color="gray.800"
                    borderRadius="lg"
                    maxW="80%"
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor={message.role === 'user' ? 'purple.200' : 'gray.200'}
                  >
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.500">
                        {message.role === 'user' ? 'You' : 'AI'} • {formatTimestamp()}
                      </Text>
                    </Flex>
                    <Text whiteSpace="pre-wrap">{message.content}</Text>
                  </Box>
                </Flex>
              ))
            )}
            {isChatLoading && (
              <Flex justify="flex-start" align="center" mt={2}>
                <Avatar size="sm" bg="gray.500" icon={<Icon as={FaRobot} />} />
                <Flex 
                  ml={2} 
                  p={3} 
                  bg="white" 
                  borderRadius="lg" 
                  align="center"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Spinner size="sm" mr={2} color="purple.500" />
                  <Text fontSize="sm">AI is thinking...</Text>
                </Flex>
              </Flex>
            )}
          </Box>

          {/* Chat Input */}
          <InputGroup size="md">
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
              disabled={isChatLoading}
            />
            <Tooltip label={isChatLoading ? "Waiting for response" : "Send message"}>
              <Button
                colorScheme="purple"
                position="absolute"
                right={1}
                top="50%"
                transform="translateY(-50%)"
                zIndex={2}
                onClick={handleChatSubmit}
                isLoading={isChatLoading}
                isDisabled={!userMessage.trim() || isChatLoading}
                borderRadius="full"
                size="sm"
                p={1}
                width="2rem"
                height="2rem"
              >
                <Icon as={FaPaperPlane} fontSize="sm" />
              </Button>
            </Tooltip>
          </InputGroup>
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(ChatSection);