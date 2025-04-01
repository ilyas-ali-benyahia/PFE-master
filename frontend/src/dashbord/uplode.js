// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Heading,
//   Input,
//   Button,
//   Flex,
//   Text,
//   VStack,
//   HStack,
//   useColorModeValue,
//   Icon,
//   InputGroup,
//   InputLeftElement,
//   useToast,
//   SimpleGrid,
//   Tabs,
//   TabList,
//   TabPanels,
//   Tab,
//   TabPanel,
//   Progress,
//   Container,
//   useBreakpointValue,
//   useDisclosure,
//   chakra,
//   Collapse,
//   Skeleton,
//   Tooltip,
//   Avatar,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
// } from '@chakra-ui/react';
// import { Brain } from 'lucide-react';
// import { 
//   FaFileUpload, 
//   FaYoutube, 
//   FaLink, 
//   FaRegFileAlt, 
//   FaSitemap, 
//   FaFileAlt, 
//   FaRobot,
//   FaChevronRight,
//   FaUser,
//   FaBell,
//   FaHistory,
//   FaEllipsisV,
//   FaPaperPlane,
// } from 'react-icons/fa';
// import { 
//   BsLightningCharge, 
//   BsQuestionCircle, 
//   BsArrowRight,
//   BsCheckCircleFill
// } from 'react-icons/bs';
// import { MdOutlineDragIndicator } from 'react-icons/md';
// import Confetti from 'react-confetti';
// import mermaid from 'mermaid';

// // Initialize Mermaid
// mermaid.initialize({
//   startOnLoad: false,
//   theme: 'default',
//   securityLevel: 'loose', // Allows for clickable nodes
// });

// const TransformLearningApp = () => {
//   // State variables
//   const [username, setUsername] = useState('Ali Benyahia Ilyas');
//   const [file, setFile] = useState(null);
//   const [youtubeUrl, setYoutubeUrl] = useState('');
//   const [showStudyOptions, setShowStudyOptions] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [progressValue, setProgressValue] = useState(0);
//   const [generatedText, setGeneratedText] = useState('');
//   const [studyResults, setStudyResults] = useState({});
//   const [activeResultSection, setActiveResultSection] = useState(null);

//   // Chat state
//   const [chatMessages, setChatMessages] = useState([]);
//   const [userMessage, setUserMessage] = useState('');
//   const [isChatLoading, setIsChatLoading] = useState(false);

//   // Refs and hooks
//   const fileInputRef = useRef(null);
//   const chatContainerRef = useRef(null);
//   const diagramRef = useRef(null);
//   const toast = useToast();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const isMobile = useBreakpointValue({ base: true, md: false });

//   // Color mode values
//   const bgColor = useColorModeValue('purple.50', 'gray.900');
//   const cardBgColor = useColorModeValue('white', 'gray.800');
//   const primaryColor = useColorModeValue('purple.500', 'purple.300');
//   const borderColor = useColorModeValue('purple.200', 'purple.600');
//   const textColor = useColorModeValue('gray.800', 'gray.100');
//   const subtleTextColor = useColorModeValue('gray.600', 'gray.400');
//   const highlightColor = useColorModeValue('purple.100', 'purple.800');

//   // Study options
//   const studyOptions = [
//     { name: 'Flashcards', icon: BsLightningCharge, color: 'yellow.400', endpoint: 'generate' },
//     { name: 'Quizzes', icon: BsQuestionCircle, color: 'green.400', endpoint: 'generate_quizzes' },
//     { name: 'Mindmap', icon: FaSitemap, color: 'blue.400', endpoint: 'generate_diagram' },
//     { name: 'Summarize', icon: FaFileAlt, color: 'purple.400', endpoint: 'generate_summary' },
//     { name: 'Chatbot', icon: FaRobot, color: 'pink.400', endpoint: 'text' },
//   ];

//   // Function to render the Mermaid diagram
//   const renderDiagram = async (diagramCode) => {
//     if (!diagramCode || !diagramRef.current) return;

//     try {
//       // Clear any existing diagram
//       diagramRef.current.innerHTML = '';

//       // Render the diagram
//       const { svg } = await mermaid.render('mermaid-diagram', diagramCode);
//       diagramRef.current.innerHTML = svg;
//     } catch (err) {
//       console.error('Error rendering diagram:', err);
//       toast({
//         title: 'Rendering Error',
//         description: err.message,
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     }
//   };

//   // Effect to render diagram when code changes
//   useEffect(() => {
//     if (studyResults.Mindmap?.diagram_code) {
//       renderDiagram(studyResults.Mindmap.diagram_code);
//     }
//   }, [studyResults.Mindmap?.diagram_code]);

//   // Simulated progress
//   useEffect(() => {
//     if (isProcessing) {
//       const interval = setInterval(() => {
//         setProgressValue(prev => {
//           if (prev >= 100) {
//             clearInterval(interval);
//             return 100;
//           }
//           return prev + 10;
//         });
//       }, 200);
//       return () => clearInterval(interval);
//     }
//   }, [isProcessing]);

//   // Reset progress when done processing
//   useEffect(() => {
//     if (progressValue >= 100) {
//       setTimeout(() => {
//         setIsProcessing(false);
//         setProgressValue(0);
//       }, 500);
//     }
//   }, [progressValue]);

//   // Handle file upload
//   const handleFileChange = async (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setIsProcessing(true);
//       setShowStudyOptions(true);

//       const formData = new FormData();
//       formData.append('file', selectedFile);

//       try {
//         const response = await axios.post('http://127.0.0.1:8000/agent/upload/', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });

//         if (response.data?.extracted_text) {
//           setGeneratedText(response.data.extracted_text);
//           setIsProcessing(false);
//           toast({
//             title: 'Success!',
//             description: 'Your content is ready for transformation.',
//             status: 'success',
//             duration: 3000,
//             isClosable: true,
//             position: 'top',
//           });
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         setIsProcessing(false);
//         toast({
//           title: 'Error',
//           description: 'Failed to process your file. Please try again.',
//           status: 'error',
//           duration: 3000,
//           isClosable: true,
//           position: 'top',
//         });
//       }
//     }
//   };

//   // Handle YouTube URL submission
//   const handleYoutubeSubmit = async () => {
//     if (youtubeUrl && youtubeUrl.includes('youtube.com')) {
//       setIsProcessing(true);
//       setShowStudyOptions(true);

//       try {
//         const response = await axios.post('http://127.0.0.1:8000/agent/upload/', {
//           youtube_url: youtubeUrl,
//         }, {
//           headers: { 'Content-Type': 'application/json' },
//         });

//         if (response.data?.extracted_text) {
//           setGeneratedText(response.data.extracted_text);
//           setIsProcessing(false);
//           toast({
//             title: 'Success!',
//             description: 'Your content is ready for transformation.',
//             status: 'success',
//             duration: 3000,
//             isClosable: true,
//             position: 'top',
//           });
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         setIsProcessing(false);
//         toast({
//           title: 'Error',
//           description: 'Failed to process YouTube video. Please try again.',
//           status: 'error',
//           duration: 3000,
//           isClosable: true,
//           position: 'top',
//         });
//       }
//     } else {
//       toast({
//         title: 'Invalid URL',
//         description: 'Please enter a valid YouTube URL',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//         position: 'top',
//       });
//     }
//   };

//   // Handle study option click
//   const handleStudyOptionClick = async (option) => {
//     setIsProcessing(true);
//     toast({
//       title: `Processing ${option.name}`,
//       description: `Generating content with ${option.name}...`,
//       status: 'info',
//       duration: 3000,
//       isClosable: true,
//       position: 'top',
//     });

//     try {
//       const payload = { text: generatedText };
//       const response = await axios.post(`http://127.0.0.1:8000/agent/${option.endpoint}/`, payload);

//       if (response.data) {
//         setStudyResults((prev) => ({
//           ...prev,
//           [option.name]: response.data,
//         }));
//         setIsProcessing(false);
//         toast({
//           title: 'Success!',
//           description: `${option.name} generated successfully.`,
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//           position: 'top',
//         });
//       }
//     } catch (error) {
//       console.error(`Error generating ${option.name}:`, error);
//       setIsProcessing(false);
//       toast({
//         title: 'Error',
//         description: `Failed to generate ${option.name}. Please try again.`,
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//         position: 'top',
//       });
//     }
//   };

//   // Handle chat message submission
//   const handleChatSubmit = async () => {
//     if (!userMessage.trim()) return;

//     setIsChatLoading(true);
//     const userMessageObj = { role: 'user', content: userMessage };
//     setChatMessages((prev) => [...prev, userMessageObj]);
//     setUserMessage('');

//     try {
//       const response = await axios.post('http://127.0.0.1:8000/agent/chat/', {
//         message: userMessage,
//       });

//       if (response.data?.response) {
//         const botMessageObj = { role: 'bot', content: response.data.response };
//         setChatMessages((prev) => [...prev, botMessageObj]);
//       }
//     } catch (error) {
//       console.error('Error sending chat message:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to send message. Please try again.',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//         position: 'top',
//       });
//     } finally {
//       setIsChatLoading(false);
//     }
//   };

//   // Scroll to bottom of chat when new messages are added
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [chatMessages]);

//   return (
//     <Box 
//       w="100vw" 
//       minH="100vh"
//       bg={bgColor} 
//       color={textColor}
//       transition="all 0.3s ease"
//       display="flex"
//       flexDirection="column"
//     >
//       {/* Header */}
//       <Box bg="white" py={4} borderBottom="1px" borderColor="gray.100">
//         <Container maxW="6xl">
//           <Flex justify="space-between" align="center">
//             <HStack spacing={2}>
//               <Icon as={Brain} color="purple.500" boxSize={8} />
//               <Text fontSize="2xl" fontWeight="bold" color="purple.500">
//                 WayLearn
//               </Text>
//             </HStack>
//             <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
//               <Button variant="ghost">Features</Button>
//               <Button variant="ghost">Pricing</Button>
//               <Button variant="ghost">Resources</Button>
//               <Button variant="ghost">About</Button>
//             </HStack>
//           </Flex>
//         </Container>
//       </Box>

//       {/* Main Content */}
//       <Flex 
//         flex={1} 
//         position="relative"
//         justifyContent="center"
//         alignItems="center"
//         flexDirection="column"
//         py={8}
//       >
//         <Container maxW="container.xl" position="relative" zIndex={1}>
//           {/* Step-by-Step Progress Indicator */}
//           <Flex mb={6} justify="center">
//             <HStack spacing={4}>
//               {['Upload', 'Choose Option', 'Get Results'].map((step, index) => (
//                 <Flex key={step} align="center">
//                   <Box
//                     w={6}
//                     h={6}
//                     borderRadius="full"
//                     bg={index <= activeTab ? primaryColor : 'gray.200'}
//                     color={index <= activeTab ? 'white' : 'gray.600'}
//                     display="flex"
//                     alignItems="center"
//                     justifyContent="center"
//                     fontSize="sm"
//                     fontWeight="bold"
//                   >
//                     {index + 1}
//                   </Box>
//                   <Text ml={2} fontSize="sm" color={index <= activeTab ? textColor : subtleTextColor}>
//                     {step}
//                   </Text>
//                   {index < 2 && <Icon as={BsArrowRight} ml={4} color={subtleTextColor} />}
//                 </Flex>
//               ))}
//             </HStack>
//           </Flex>

//           {/* Upload Section */}
//           <Box 
//             w="100%"
//             borderRadius="2xl" 
//             p={8} 
//             mb={8}
//             bg={cardBgColor}
//             boxShadow="lg"
//           >
//             <Heading size="2xl" mb={6} lineHeight="shorter">
//               Welcome to <chakra.span color="purple.500">WayLearn</chakra.span>, {username}
//             </Heading>
//             <Text fontSize="xl" color={subtleTextColor} mb={8}>
//               Start learning effortlessly—upload your content and choose a study tool.
//             </Text>

//             <Tabs isFitted variant="soft-rounded" colorScheme="purple" onChange={setActiveTab} w={{ base: "100%", md: "80%", lg: "70%" }} mx="auto">
//               <TabList bg="gray.100" p={2} borderRadius="lg">
//                 <Tab _selected={{ bg: primaryColor, color: 'white' }} fontWeight="medium">
//                   <Icon as={FaFileUpload} mr={2} />
//                   Upload File
//                 </Tab>
//                 <Tab _selected={{ bg: primaryColor, color: 'white' }} fontWeight="medium">
//                   <Icon as={FaYoutube} mr={2} />
//                   YouTube URL
//                 </Tab>
//               </TabList>
//               <TabPanels>
//                 <TabPanel p={4}>
//                   <Box
//                     borderWidth="2px"
//                     borderStyle="dashed"
//                     borderColor={borderColor}
//                     borderRadius="lg"
//                     p={8}
//                     textAlign="center"
//                     cursor="pointer"
//                     transition="all 0.3s ease"
//                     _hover={{ bg: highlightColor, borderColor: primaryColor }}
//                     onClick={() => fileInputRef.current.click()}
//                   >
//                     <Icon as={MdOutlineDragIndicator} boxSize={10} color={primaryColor} />
//                     <Text mt={4} color={primaryColor} fontWeight="medium" fontSize="lg">
//                       Drag & Drop or Click to Upload
//                     </Text>
//                     <Text mt={2} color={subtleTextColor} fontSize="sm">
//                       Supported formats: PDF, DOCX, PPTX, TXT, JPG, PNG
//                     </Text>
//                     <Input
//                       type="file"
//                       accept=".pdf,.pptx,.docx,.txt,.jpg,.jpeg,.png"
//                       hidden
//                       ref={fileInputRef}
//                       onChange={handleFileChange}
//                     />
//                   </Box>
                  
//                   {file && (
//                     <Flex w="full" bg="green.50" p={3} borderRadius="md" align="center" mt={4}>
//                       <Icon as={FaRegFileAlt} color="green.500" mr={2} />
//                       <Text color="green.700" fontWeight="medium" isTruncated>
//                         {file.name}
//                       </Text>
//                     </Flex>
//                   )}
//                 </TabPanel>
//                 <TabPanel p={4}>
//                   <InputGroup size="lg">
//                     <InputLeftElement pointerEvents="none">
//                       <Icon as={FaLink} color="gray.400" />
//                     </InputLeftElement>
//                     <Input 
//                       value={youtubeUrl}
//                       onChange={(e) => setYoutubeUrl(e.target.value)}
//                       placeholder="Enter YouTube URL" 
//                       pr="4.5rem"
//                       borderColor="gray.300"
//                       _focus={{ borderColor: primaryColor }}
//                     />
//                     <Button
//                       colorScheme="red"
//                       position="absolute"
//                       right={0}
//                       onClick={handleYoutubeSubmit}
//                       zIndex={2}
//                     >
//                       <Icon as={FaYoutube} mr={2} />
//                       Go
//                     </Button>
//                   </InputGroup>
//                 </TabPanel>
//               </TabPanels>
//             </Tabs>
            
//             {isProcessing && (
//               <Box mt={6} w={{ base: "100%", md: "80%", lg: "70%" }} mx="auto">
//                 <Text mb={2} color={subtleTextColor}>Processing your content...</Text>
//                 <Progress 
//                   value={progressValue} 
//                   size="sm" 
//                   colorScheme="purple" 
//                   borderRadius="full" 
//                   hasStripe 
//                   isAnimated
//                 />
//               </Box>
//             )}
//           </Box>

//           {/* Study Options Section */}
//           {showStudyOptions && (
//             <>
//               {/* Extracted Text Preview */}
//               {generatedText && (
//                 <Box 
//                   borderRadius="xl" 
//                   p={6} 
//                   mb={6}
//                   bg="green.50" 
//                   borderWidth="1px"
//                   borderColor="green.200"
//                 >
//                   <Heading size="md" mb={3} color="green.700">
//                     <Icon as={FaRegFileAlt} mr={2} display="inline" />
//                     API Successfully Extracted Text:
//                   </Heading>
//                   <Box 
//                     maxH="150px" 
//                     overflowY="auto" 
//                     p={3} 
//                     borderRadius="md" 
//                     bg="white" 
//                     fontSize="sm"
//                     whiteSpace="pre-wrap"
//                   >
//                     {generatedText.length > 500 
//                       ? generatedText.substring(0, 500) + '...' 
//                       : generatedText}
//                   </Box>
//                 </Box>
//               )}

//               {/* Study Options Grid */}
//               <Box 
//                 borderRadius="xl" 
//                 p={6} 
//                 bg={cardBgColor}
//                 boxShadow="lg"
//               >
//                 <Heading size="lg" mb={6} color={textColor}>
//                   Choose Your Study Transformation
//                 </Heading>
//                 <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
//                   {studyOptions.map((option) => (
//                     <Tooltip key={option.name} label={option.description} placement="top">
//                       <Box
//                         p={6}
//                         borderRadius="xl"
//                         bg="white"
//                         borderWidth="1px"
//                         borderColor="gray.200"
//                         cursor="pointer"
//                         transition="all 0.3s ease"
//                         _hover={{ 
//                           transform: 'translateY(-4px)', 
//                           boxShadow: 'lg',
//                           borderColor: option.color,
//                         }}
//                         onClick={() => handleStudyOptionClick(option)}
//                       >
//                         <Flex align="center" mb={4}>
//                           <Icon as={option.icon} boxSize={6} color={option.color} mr={3} />
//                           <Text fontSize="lg" fontWeight="medium" color={textColor}>
//                             {option.name}
//                           </Text>
//                         </Flex>
                        
//                       </Box>
//                     </Tooltip>
//                   ))}
//                 </SimpleGrid>
//               </Box>

//               {/* Study Results */}
//               {Object.keys(studyResults).length > 0 && (
//                 <Box 
//                   borderRadius="xl" 
//                   p={6} 
//                   mt={6}
//                   bg={cardBgColor}
//                   boxShadow="lg"
//                 >
//                   <Heading size="lg" mb={6} color={textColor}>
//                     Study Results
//                   </Heading>
//                   {Object.entries(studyResults).map(([optionName, result]) => (
//                     <Box key={optionName} mb={6}>
//                       <Flex justify="space-between" align="center">
//                         <Heading size="md" mb={3} color={textColor}>
//                           {optionName}
//                         </Heading>
//                         <Button size="sm" onClick={() => setActiveResultSection(activeResultSection === optionName ? null : optionName)}>
//                           {activeResultSection === optionName ? 'Hide' : 'Show'}
//                         </Button>
//                       </Flex>
//                       <Collapse in={activeResultSection === optionName}>
//                         <Box 
//                           p={3} 
//                           borderRadius="md" 
//                           bg="white" 
//                           borderWidth="1px"
//                           borderColor="gray.200"
//                         >
//                           {optionName === 'Flashcards' && (
//                             <VStack align="start" spacing={3}>
//                               {result.flashcards?.map((flashcard, index) => (
//                                 <Box key={index} p={3} bg="gray.50" borderRadius="md" w="100%">
//                                   <Text fontWeight="bold">Q: {flashcard.question}</Text>
//                                   <Text>A: {flashcard.answer}</Text>
//                                 </Box>
//                               ))}
//                             </VStack>
//                           )}
                         
//                           {optionName === 'Quizzes' && (
//                             <VStack align="start" spacing={3}>
//                               {result.quizzes?.map((quiz, index) => (
//                                 <Box key={index} p={3} bg="gray.50" borderRadius="md" w="100%">
//                                   <Text fontWeight="bold">Q: {quiz.question}</Text>
//                                   <Text>A: {quiz.options.A|| quiz.options.أ}</Text>
//                                   <Text>B: {quiz.options.B|| quiz.options.ب}</Text>
//                                   <Text>C: {quiz.options.C|| quiz.options.ج}</Text>
//                                   <Text>D: {quiz.options.D|| quiz.options.د}</Text>
//                                   <Text color="green.500">Correct Answer: {quiz.correct_answer}</Text>
//                                 </Box>
//                               ))}
//                             </VStack>
//                           )}
//                           {optionName === 'Summarize' && (
//                             <VStack align="start" spacing={3}>
//                               <Text fontWeight="bold">Summary:</Text>
//                               <Text>{result.summary}</Text>
//                               <Text fontWeight="bold">Key Points:</Text>
//                               <VStack align="start" spacing={2}>
//                                 {result.key_points?.map((point, index) => (
//                                   <Text key={index}>• {point}</Text>
//                                 ))}
//                               </VStack>
//                             </VStack>
//                           )}
//                           {optionName === 'Mindmap' && (
//                             <Box>
//                               <Text fontWeight="bold">Diagram:</Text>
//                               <Box w="100%" h="100%" bg="white" borderRadius="md" p={4}>
//                                 <div ref={diagramRef} className="mermaid">
//                                   {result.diagram_code || 'No diagram generated yet'}
//                                 </div>
//                               </Box>
//                             </Box>
//                           )}
//                           {optionName === 'Chatbot' && (
//                             <Box>
//                               <Text fontWeight="bold">Response:</Text>
//                               <Text>{result.response}</Text>
//                             </Box>
//                           )}
//                         </Box>
//                       </Collapse>
//                     </Box>
//                   ))}
//                 </Box>
//               )}

//               {/* Chat Section */}
//               <Box 
//                 borderRadius="xl" 
//                 p={6} 
//                 mt={6}
//                 bg={cardBgColor}
//                 boxShadow="lg"
//               >
//                 <Heading size="lg" mb={6} color={textColor}>
//                 Chat with the AI about your content
//                 </Heading>
//                 <Box 
//                   ref={chatContainerRef}
//                   maxH="300px"
//                   overflowY="auto"
//                   mb={4}
//                   p={4}
//                   bg="gray.50"
//                   borderRadius="md"
//                 >
//                   {chatMessages.map((message, index) => (
//                     <Flex 
//                       key={index} 
//                       align="flex-start"
//                       mb={4}
//                       direction={message.role === 'user' ? 'row-reverse' : 'row'}
//                     >
//                       <Avatar 
//                         size="sm"
//                         name={message.role === 'user' ? username : 'AI'}
//                         bg={message.role === 'user' ? primaryColor : 'gray.500'}
//                       />
//                       <Box 
//                         ml={message.role === 'user' ? 0 : 2}
//                         mr={message.role === 'user' ? 2 : 0}
//                         p={3}
//                         bg={message.role === 'user' ? primaryColor : 'gray.200'}
//                         color={message.role === 'user' ? 'white' : 'gray.800'}
//                         borderRadius="lg"
//                         maxW="70%"
//                       >
//                         <Text>{message.content}</Text>
//                       </Box>
//                     </Flex>
//                   ))}
//                 </Box>
//                 <InputGroup>
//                   <Input
//                     value={userMessage}
//                     onChange={(e) => setUserMessage(e.target.value)}
//                     placeholder="Type your message..."
//                     pr="4.5rem"
//                     onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
//                   />
//                   <Button
//                     colorScheme="purple"
//                     position="absolute"
//                     right={0}
//                     onClick={handleChatSubmit}
//                     isLoading={isChatLoading}
//                   >
//                     <Icon as={FaPaperPlane} />
//                   </Button>
//                 </InputGroup>
//               </Box>
//             </>
//           )}
//         </Container>

//         {/* Confetti Animation */}
//         {progressValue === 100 && (
//           <Confetti
//             width={window.innerWidth}
//             height={window.innerHeight}
//             recycle={false}
//           />
//         )}
//       </Flex>
//     </Box>
//   );
// };

// export default TransformLearningApp;

// App.js
import React from 'react';
import { Box, Flex, Container, useColorModeValue } from '@chakra-ui/react';
import { AppProvider } from '../context/AppContext';
import Header from '../components/Header';
import UploadSection from '../components/UploadSection';
import StudyOptions from '../components/StudyOptions';
import ResultsSection from '../components/ResultsSection';
import ChatSection from '../components/ChatSection';
import ProgressSteps from '../components/ProgressSteps';
import ExtractedTextPreview from '../components/ExtractedTextPreview';
// 
const App = () => {
  const bgColor = useColorModeValue('purple.50', 'gray.900');

  return (
    <AppProvider>
      <Box w="100vw" minH="100vh" bg={bgColor} color="gray.800">
        <Header />
        <Flex flex={1} justifyContent="center" alignItems="center" py={8}>
          <Container maxW="container.xl">
            <UploadSection />
            <StudyOptions />
            <ResultsSection />
          </Container>
        </Flex>
      </Box>
    </AppProvider>
  );
};

export default App;