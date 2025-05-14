import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Button,
  Heading,
  Box,
  Flex,
  Text,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Badge,
  SimpleGrid,
  Container,
  useColorModeValue,
  IconButton,
  Center,
  HStack,
  Spinner,
  List,
  ListItem,
  ListIcon,
  useBreakpointValue
} from '@chakra-ui/react';
import { useApp } from '../context/AppContext';
import { renderMermaidDiagram } from '../utils/mermaidUtils';
import ChatSection from './ChatSection';
import { ChevronLeftIcon, ChevronRightIcon, RepeatIcon, CheckCircleIcon } from '@chakra-ui/icons';

const Flashcard = ({ question, answer, isFlipped, onFlip }) => {
  const questionBgColor = useColorModeValue('blue.50', 'blue.700');
  const answerBgColor = useColorModeValue('green.50', 'green.700');
  const textColor = useColorModeValue('gray.800', 'white');
  
  // Responsive height adjustments
  const cardHeight = useBreakpointValue({ base: "200px", sm: "250px", md: "300px" });
  const padding = useBreakpointValue({ base: 3, sm: 4, md: 6 });
  const fontSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });
  const headingSize = useBreakpointValue({ base: "sm", md: "md" });
  
  return (
    <Box
      minHeight={cardHeight}
      display="flex"
      alignItems="center"
      justifyContent="center"
      
      p={{ base: 2, sm: 4, md: 12 }}
      width="100%"
    >
      <Box
        borderRadius="lg"
        boxShadow="xl"
        p={padding}
        width="100%"
        height={cardHeight}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        cursor="pointer"
        onClick={onFlip}
        style={{
          perspective: '1000px',
        }}
      >
        <Box
          position="absolute"
          width="100%"
          height="100%"
          borderRadius="lg"
          boxShadow="lg"
          p={padding}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="medium"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Question side */}
          <Box
            position="absolute"
            width="100%"
            height="100%"
            borderRadius="lg"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bg={questionBgColor}
            color={textColor}
            p={padding}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Heading size={headingSize} mb={3}>Question</Heading>
            <Text fontSize={fontSize} textAlign="center" overflow="auto" px={2}>
              {question}
            </Text>
            <Badge position="absolute" bottom={3} right={3} colorScheme="blue" fontSize="xs">
              Click to flip
            </Badge>
          </Box>
          
          {/* Answer side */}
          <Box
            position="absolute"
            width="100%"
            height="100%"
            borderRadius="lg"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bg={answerBgColor}
            color={textColor}
            p={padding}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <Heading size={headingSize} mb={3}>Answer</Heading>
            <Text fontSize={fontSize} textAlign="center" overflow="auto" px={2}>
              {answer}
            </Text>
            <Badge position="absolute" bottom={3} right={3} colorScheme="green" fontSize="xs">
              Click to flip
            </Badge>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const ResultsSection = ({ option }) => {
  const { state } = useApp();
  const { studyResults, activeResultSection } = state;
  const diagramRef = useRef(null);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const keyPointsBg = useColorModeValue('blue.50', 'blue.900');
  const summaryBg = useColorModeValue('green.50', 'green.900');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  // Responsive values
  const containerPadding = useBreakpointValue({ base: 2, sm: 4, md: 6 });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const iconButtonSize = useBreakpointValue({ base: "md", md: "lg" });
  const quizColumns = useBreakpointValue({ base: 1, md: 2 });

  // State management
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState({});
  const [isRenderingDiagram, setIsRenderingDiagram] = useState(false);
  const [diagramError, setDiagramError] = useState(null);

  const result = studyResults?.[option] || null;

  // Enhanced diagram processing
  const processDiagramCode = (code, language) => {
    if (!code) return code;
  
    // Handle Arabic diagrams
    if (language === 'Arabic') {
      return code
        .replace(/^graph\s+LR/, 'graph RL\ndirection RTL') // Correct RTL handling
        .replace(/<br\s*\/?>/g, '\\n') // Convert line breaks
        .replace(/(["'])(.*?)(["'])/g, (match, p1, p2, p3) => {
          return `${p1}${p2.replace(/"/g, '\\"')}${p3}`;
        });
    }
  
    // Handle French diagrams (optional)
    if (language === 'French') {
      return code
        .replace(/[éèêë]/g, 'e')
        .replace(/[àâ]/g, 'a')
        .replace(/[ùû]/g, 'u');
    }
  
    return code;
  };
  

  // Diagram rendering effect
  useEffect(() => {
    if (option === 'Mindmap' && result?.diagram_code) {
      setIsRenderingDiagram(true);
      setDiagramError(null);

      const renderDiagram = async () => {
        try {
          const processedCode = processDiagramCode(result.diagram_code, result.language);
          await renderMermaidDiagram(processedCode, diagramRef.current);
        } catch (error) {
          console.error("Diagram rendering error:", error);
          setDiagramError(error.message || "Failed to render diagram");
        } finally {
          setIsRenderingDiagram(false);
        }
      };

      const timer = setTimeout(renderDiagram, 100);
      return () => clearTimeout(timer);
    }
  }, [option, result?.diagram_code, result?.language]);

  // Reset states when option changes
  useEffect(() => {
    setCurrentFlashcardIndex(0);
    setShowAnswer(false);
    setQuizAnswers({});
    setShowResults({});
  }, [option]);

  if (!result) {
    return null;
  }

  // Flashcard navigation handlers
  const goToNextFlashcard = () => {
    if (!result.flashcards) return;
    setShowAnswer(false);
    setCurrentFlashcardIndex((prev) => 
      prev === result.flashcards.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevFlashcard = () => {
    if (!result.flashcards) return;
    setShowAnswer(false);
    setCurrentFlashcardIndex((prev) => 
      prev === 0 ? result.flashcards.length - 1 : prev - 1
    );
  };

  const flipFlashcard = () => {
    setShowAnswer(!showAnswer);
  };

  // Quiz answer handlers
  const handleAnswerSelect = (quizIndex, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [quizIndex]: answer
    }));
    setShowResults(prev => ({
      ...prev,
      [quizIndex]: true
    }));
  };

  const isCorrect = (quizIndex) => {
    if (!result.quizzes || !quizAnswers[quizIndex]) return false;
    return quizAnswers[quizIndex] === result.quizzes[quizIndex].correct_answer;
  };

  const renderFlashcards = () => {
    if (!result.flashcards || result.flashcards.length === 0) {
      return <Text>No flashcards available</Text>;
    }

    const currentFlashcard = result.flashcards[currentFlashcardIndex];

    return (
      <VStack spacing={4} width="100%" align="stretch">
        
        
        <Flashcard 
          question={currentFlashcard.question}
          answer={currentFlashcard.answer}
          isFlipped={showAnswer}
          onFlip={flipFlashcard}
        />
          <Box fontWeight="medium" fontSize={fontSize} justifyContent={"center"} textAlign="center">
            Flashcard {currentFlashcardIndex + 1} of {result.flashcards.length}
          </Box>
        <HStack spacing={{ base: 2, md: 4 }} justify="center" >
        
          
          
          <IconButton 
            icon={<ChevronLeftIcon />} 
            aria-label="Previous flashcard" 
            onClick={goToPrevFlashcard}
            colorScheme="blue"
            variant="outline"
            size={iconButtonSize}
          />
          <IconButton 
            icon={<RepeatIcon />} 
            aria-label="Flip card" 
            onClick={flipFlashcard}
            colorScheme="teal"
            size={iconButtonSize}
          />
          <IconButton 
            icon={<ChevronRightIcon />} 
            aria-label="Next flashcard" 
            onClick={goToNextFlashcard}
            colorScheme="blue"
            variant="outline"
            size={iconButtonSize}
          />
        </HStack>
      </VStack>
    );
  };

  const renderQuizzes = () => {
    if (!result.quizzes || result.quizzes.length === 0) {
      return <Text>No quizzes available</Text>;
    }

    return (
      <VStack spacing={6} align="stretch" width="100%">
        {result.quizzes?.map((quiz, index) => (
          <Card key={index} borderWidth="1px" borderColor={borderColor} shadow="md">
            <CardHeader 
              bg="purple.50" 
              borderBottomWidth="1px" 
              borderColor={borderColor}
              p={{ base: 3, md: 4 }}
            >
              <Heading size={headingSize} fontWeight="bold">Quiz Question {index + 1}</Heading>
            </CardHeader>
            <CardBody p={{ base: 3, md: 4 }}>
              <Text fontWeight="medium" mb={3} fontSize={fontSize}>{quiz.question}</Text>
              <Divider my={2} />
              <SimpleGrid columns={quizColumns} spacing={3} mt={3}>
                {Object.entries(quiz.options).map(([key, value]) => {
                  const isSelected = quizAnswers[index] === key;
                  const showResult = showResults[index];
                  const isCorrect = key === quiz.correct_answer;
                  
                  let bgColor = "transparent";
                  if (showResult && isSelected) {
                    bgColor = isCorrect ? "green.100" : "red.100";
                  }
                  
                  return (
                    <Box 
                      key={key}
                      p={{ base: 2, md: 3 }}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={isSelected ? (showResult ? (isCorrect ? "green.500" : "red.500") : "blue.500") : borderColor}
                      bg={bgColor}
                      cursor={!showResults[index] ? "pointer" : "default"}
                      onClick={() => !showResults[index] && handleAnswerSelect(index, key)}
                      _hover={!showResults[index] ? { bg: hoverBgColor } : {}}
                      transition="all 0.2s"
                    >
                      <Flex align="center" justify="space-between" flexWrap="wrap" gap={1}>
                        <Text fontSize={{ base: "sm", md: "md" }}>{key}: {value}</Text>
                        {showResult && isSelected && (
                          <Badge colorScheme={isCorrect ? "green" : "red"} ml={{ base: 0, md: 2 }}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        )}
                      </Flex>
                    </Box>
                  );
                })}
              </SimpleGrid>
              
              {showResults[index] && (
                <Center mt={4}>
                  <Button 
                    onClick={() => {
                      setQuizAnswers(prev => ({ ...prev, [index]: null }));
                      setShowResults(prev => ({ ...prev, [index]: false }));
                    }}
                    colorScheme="blue"
                    size={buttonSize}
                  >
                    Try Again
                  </Button>
                </Center>
              )}
            </CardBody>
          </Card>
        ))}
      </VStack>
    );
  };

  const renderSummary = () => {
    return (
      <Card borderWidth="1px" shadow="md" width="100%" overflow="hidden">
        <CardHeader 
          bg={summaryBg} 
          borderBottomWidth="1px" 
          py={{ base: 3, md: 4 }}
          px={{ base: 3, md: 4 }}
        >
          <Flex 
            justifyContent="space-between" 
            alignItems="center"
            flexDirection={{ base: "column", sm: "row" }}
            gap={2}
          >
            <Heading size={headingSize} color={headingColor}>
              Document Summary
            </Heading>
            <Flex>
              {result.word_count && (
                <Badge ml={2} colorScheme="green" fontSize="sm" px={2} py={1} borderRadius="md">
                  {result.word_count} words
                </Badge>
              )}
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody p={0}>
          <Box 
            p={{ base: 3, md: 6 }}
            className="markdown-summary" 
            dir={result.language === 'Arabic' ? 'rtl' : 'ltr'}
            style={{ textAlign: result.language === 'Arabic' ? 'right' : 'left' }}
          >
            <Box mb={6} p={{ base: 3, md: 5 }} borderRadius="md" bg="white" boxShadow="sm">
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                fontWeight="medium" 
                lineHeight="tall"
              >
                {result.summary || "No summary generated"}
              </Text>
            </Box>
            
            <Box p={{ base: 3, md: 5 }} borderRadius="md" bg={keyPointsBg}>
              <Heading size={headingSize} mb={4} color={headingColor}>Key Points</Heading>
              {result.key_points && result.key_points.length > 0 ? (
                <List spacing={3}>
                  {result.key_points.map((point, idx) => (
                    <ListItem key={idx} display="flex" alignItems="flex-start">
                      <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                      <Text fontWeight="medium" fontSize={fontSize}>{point}</Text>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text>No key points identified</Text>
              )}
            </Box>
          </Box>
        </CardBody>
      </Card>
    );
  };
  const renderChatbot = () => {
    return <ChatSection />;
  };
  const renderMindmap = () => {
    const isArabic = result.language === 'Arabic';
    const isFrench = result.language === 'French';

    return (
      <Card borderWidth="1px" borderColor={borderColor} shadow="md" width="100%">
        <CardHeader 
          bg="orange.50" 
          borderBottomWidth="1px" 
          borderColor={borderColor}
          p={{ base: 3, md: 4 }}
        >
          <Flex 
            justifyContent="space-between" 
            alignItems="center"
            flexDirection={{ base: "column", sm: "row" }}
            gap={2}
          >
            <Heading size={headingSize}>Mind Map</Heading>
            {result.language && (
              <Badge colorScheme="blue">{result.language}</Badge>
            )}
          </Flex>
        </CardHeader>
        <CardBody p={{ base: 3, md: 4 }}>
          {isRenderingDiagram && (
            <Center p={{ base: 6, md: 10 }}>
              <VStack>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text mt={4}>Rendering diagram...</Text>
              </VStack>
            </Center>
          )}
          
          {diagramError && (
            <Box  borderWidth="1px" borderRadius="md" borderColor="red.300" bg="red.50">
              <Heading size="sm" color="red.600" mb={2}>Error Rendering Diagram</Heading>
              <Text fontSize={fontSize}>{diagramError}</Text>
              <Box 
                mt={4} 
                p={3} 
                bg="gray.50" 
                borderRadius="md"
                overflow="auto"
                maxHeight="300px"
              >
                <pre style={{ fontSize: "0.8rem" }}>{result.diagram_code}</pre>
              </Box>
            </Box>
          )}
          
          <Box 
            ref={diagramRef} 
            overflowX="auto"
            dir={isArabic ? 'rtl' : 'ltr'}
            style={{ 
              display: isRenderingDiagram ? 'none' : 'block',
              textAlign: isArabic ? 'right' : 'left'
            }}
          >
            {!isRenderingDiagram && !diagramError && !result.diagram_code && (
              <Text>No diagram available</Text>
            )}
          </Box>
          
          {(isArabic || isFrench) && (
            <Box mt={3} p={2} borderRadius="md" bg="blue.50">
              <Text fontSize="sm" color="blue.600">
                {isArabic ? (
                  "Note: Arabic diagram rendered right-to-left with adjusted formatting"
                ) : (
                  "Note: French characters have been normalized for display"
                )}
              </Text>
            </Box>
          )}
        </CardBody>
      </Card>
    );
  };

  return (
    <Container maxW="container.xl" px={{ base: 2, sm: 4, md: 6 }}>
      <Box 
       w="100%" 
       borderRadius={{ base: "lg", md: "xl", lg: "2xl" }} 
       p={{ base: 4, md: 6, lg: 8 }} 
       mb={{ base: 4, md: 6, lg: 8 }} 
      >
        
        {option === 'Quizzes' && renderQuizzes()}
        {option === 'Summarize' && renderSummary()}
        {option === 'Mindmap' && renderMindmap()}
        {option === 'Chatbot' && renderChatbot()}
        {option === 'Flashcards' && renderFlashcards()}
      </Box>
    </Container>
  );
};

export default React.memo(ResultsSection);