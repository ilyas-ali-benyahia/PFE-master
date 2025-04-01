import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Progress,
  useToast,
  IconButton,
  useColorModeValue,
  RadioGroup,
  Radio,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { FiUpload, FiDatabase } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight, FaRandom, FaPlus } from "react-icons/fa";
import axios from "axios";

const Flashcard = ({ question, answer, isFlipped, setIsFlipped }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  
  return (
    <Box
      minHeight="400px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      my={6}
    >
      <Box
        bg={bgColor}
        borderRadius="lg"
        boxShadow="xl"
        p={8}
        width="100%"
        height="450px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        cursor="pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          perspective: '1000px',
        }}
      >
        <Box
          position="absolute"
          width="100%"
          height="100%"
          borderRadius="20px"
          boxShadow="lg"
          p="6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <Box
            position="absolute"
            width="100%"
            height="100%"
            borderRadius="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="blue.500"
            color="white"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Text fontSize="lg" lineHeight="1.4">{question}</Text>
          </Box>
          <Box
            position="absolute"
            width="100%"
            height="100%"
            borderRadius="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="green.500"
            color="white"
            transform="rotateY(180deg)"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Text fontSize="lg" lineHeight="1.4">{answer}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const UploadAndExtract = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [textInput, setTextInput] = useState("");
  const BASE_URL = "http://127.0.0.1:8000/api";
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  // Fetch existing quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoadingQuizzes(true);
    try {
      const response = await axios.get(`${BASE_URL}/quizes/show/`);
      if (response.status === 200) {
        setQuizzes(response.data);
      }
    } catch (error) {
      toast({
        title: "Error fetching quizzes",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (quizzes.length === 0) return;
    setCurrentQuestion((prev) => (prev + 1) % quizzes.length);
    setShowFeedback(false);
    setSelectedAnswer(null);
  };

  const handlePrev = () => {
    if (quizzes.length === 0) return;
    setCurrentQuestion((prev) => (prev - 1 + quizzes.length) % quizzes.length);
    setShowFeedback(false);
    setSelectedAnswer(null);
  };

  const handleShuffle = () => {
    if (quizzes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quizzes.length);
    setCurrentQuestion(randomIndex);
    setShowFeedback(false);
    setSelectedAnswer(null);
  };

  const createQuizFromText = async () => {
    if (!textInput.trim()) {
      toast({ 
        title: "Error", 
        description: "Please enter some text", 
        status: "error" 
      });
      return;
    }

    setLoadingQuizzes(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/quizes/create/`,
        { input_text: textInput }
      );
      
      if (response.status === 201 || response.status === 200) {
        setQuizzes(response.data);
        toast({ 
          title: "Success", 
          description: "Quizzes generated successfully", 
          status: "success" 
        });
        setTextInput("");
      }
    } catch (error) {
      toast({
        title: "Error creating quizzes",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingQuizzes(false);
    }
  };









  

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "Error", description: "Please select a file", status: "error" });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload file and extract text
      const response = await axios.post(`${BASE_URL}/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      // Generate flashcards
      const flashcardResponse = await axios.post(`${BASE_URL}/cards/create/`, {
        input_text: response.data.extracted_text,
      });
      setFlashcards(flashcardResponse.data);

      // Generate quizzes
      const quizResponse = await axios.post(`${BASE_URL}/quizes/create/`, {
        input_text: response.data.extracted_text,
      });
      setQuizzes(quizResponse.data);
      
      toast({ 
        title: "Success", 
        description: "Content generated successfully", 
        status: "success" 
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error.message, 
        status: "error" 
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePrevCard = () => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    setCurrentCard((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  const handleNextCard = () => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    setCurrentCard((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
  };

  const handleRandomCard = () => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    setCurrentCard(randomIndex);
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center">Learning Assistant</Heading>
        
        <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
          <TabList>
            <Tab>Document Upload</Tab>
            <Tab>Quiz Generation</Tab>
          </TabList>
          
          <TabPanels>
            {/* Document Upload Tab */}
            <TabPanel>
              <Box
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="md"
                p={6}
                textAlign="center"
                mb={4}
              >
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  display="none"
                  id="file-upload"
                />
                <Button
                  as="label"
                  htmlFor="file-upload"
                  leftIcon={<FiUpload />}
                  colorScheme="blue"
                  mb={2}
                >
                  Select Document
                </Button>
                <Text>{file ? file.name : "No file selected"}</Text>
              </Box>
              
              <Button 
                onClick={handleUpload} 
                isLoading={uploading} 
                loadingText="Uploading..."
                colorScheme="blue"
                isDisabled={!file}
                width="full"
              >
                Generate Learning Content
              </Button>
              
              {uploading && <Progress value={uploadProgress} size="sm" colorScheme="blue" />}
            </TabPanel>
            
            {/* Quiz Generation Tab */}
            <TabPanel>
              <VStack spacing={4}>
                <Heading size="md">Generate Quizzes from Text</Heading>
                <Box width="full">
                  <Input
                    placeholder="Enter text to generate quizzes from..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    size="md"
                    mb={3}
                  />
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme="blue"
                    onClick={createQuizFromText}
                    isLoading={loadingQuizzes}
                    loadingText="Generating..."
                    width="full"
                  >
                    Create Quizzes
                  </Button>
                </Box>
                
                <HStack width="full" mt={2}>
                  <Button
                    leftIcon={<FiDatabase />}
                    colorScheme="green"
                    onClick={fetchQuizzes}
                    isLoading={loadingQuizzes}
                    loadingText="Loading..."
                    width="full"
                  >
                    Load Saved Quizzes
                  </Button>
                </HStack>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Flashcards Section */}
        {flashcards.length > 0 && (
          <>
            <Heading as="h2" size="lg" textAlign="center" mt={8} mb={4}>
              Flashcards
            </Heading>
            <Flashcard 
              question={flashcards[currentCard]?.question || ""}
              answer={flashcards[currentCard]?.answer || ""}
              isFlipped={isFlipped} 
              setIsFlipped={setIsFlipped} 
            />
            
            <Box display="flex" justifyContent="center" gap={4}>
              <IconButton
                icon={<FaChevronLeft />}
                onClick={handlePrevCard}
                aria-label="Previous card"
              />
              <IconButton
                icon={<FaRandom />}
                onClick={handleRandomCard}
                aria-label="Random card"
              />
              <IconButton
                icon={<FaChevronRight />}
                onClick={handleNextCard}
                aria-label="Next card"
              />
            </Box>
            
            <Text textAlign="center">
              {flashcards.length > 0 ? `Card ${currentCard + 1} of ${flashcards.length}` : "No flashcards available"}
            </Text>
          </>
        )}
        
        {/* Quiz Section */}
        {quizzes.length > 0 && (
          <>
            <Heading as="h2" size="lg" textAlign="center" mt={8} mb={4}>
              Quiz
            </Heading>
            <Box 
              width="full" 
              mx="auto"
              bg={bgColor}
              borderRadius="lg"
              boxShadow="xl"
              p={6}
            >
              {quizzes[currentQuestion] ? (
                <>
                  <Text fontSize="xl" fontWeight="bold" mb={4} color={textColor}>
                    {quizzes[currentQuestion].question}
                  </Text>
                  <RadioGroup 
                    mt={4} 
                    onChange={handleAnswerSelect} 
                    value={selectedAnswer}
                  >
                    <VStack align="stretch" spacing={3}>
                      {quizzes[currentQuestion].options?.map((option, index) => (
                        <Box key={index}>
                          <Radio value={option} colorScheme="teal">
                            {option}
                          </Radio>
                        </Box>
                      ))}
                    </VStack>
                  </RadioGroup>

                  {/* Feedback */}
                  {showFeedback && (
                    <Text 
                      mt={4} 
                      fontSize="lg" 
                      fontWeight="bold" 
                      color={selectedAnswer === quizzes[currentQuestion].correctAnswer ? "green.500" : "red.500"}
                    >
                      {selectedAnswer === quizzes[currentQuestion].correctAnswer 
                        ? "Correct!" 
                        : `Incorrect! The correct answer is ${quizzes[currentQuestion].correctAnswer}.`}
                    </Text>
                  )}
                </>
              ) : (
                <Text>No quiz questions available</Text>
              )}
            </Box>

            {/* Navigation and Shuffle Buttons */}
            <HStack spacing={4} mt={4} justify="center">
              <IconButton
                icon={<FaChevronLeft />}
                aria-label="Previous question"
                onClick={handlePrev}
                isDisabled={quizzes.length === 0}
              />
              <IconButton
                icon={<FaRandom />}
                aria-label="Shuffle questions"
                onClick={handleShuffle}
                isDisabled={quizzes.length === 0}
              />
              <Text>
                {quizzes.length > 0 ? `${currentQuestion + 1} / ${quizzes.length}` : "No quizzes"}
              </Text>
              <IconButton
                icon={<FaChevronRight />}
                aria-label="Next question"
                onClick={handleNext}
                isDisabled={quizzes.length === 0}
              />
            </HStack>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default UploadAndExtract;