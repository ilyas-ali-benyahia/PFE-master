
import React, { useState, useEffect } from 'react';
import { AppProvider } from '../context/AppContext';
import UploadSection from '../components/UploadSection';
import StudyOptions from '../components/StudyOptions';
import ResultsSection from '../components/ResultsSection';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  List,
  ListItem,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  useDisclosure,
  Collapse,
  IconButton,
  Divider,
  Tooltip,
  Badge,
  SimpleGrid,
  Image
} from '@chakra-ui/react';
import { 
  Brain,
  FileText,
  ChevronDown,
  ChevronUp,
  History,
  X,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  Layout,
  MessageSquare,
  Share2,
  ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ setActiveSection }) => {
  return (
    <Box bg="white" py={4} borderBottom="1px" borderColor="gray.100">
      <Container maxW="6xl">
        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
            <Icon as={Brain} color="purple.500" boxSize={8} />
            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
              StudyVia
            </Text>
          </HStack>
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          <Button variant="ghost" onClick={() => setActiveSection('pricing')}>Home</Button>
            <Button variant="ghost" onClick={() => setActiveSection('features')}>Features</Button>            
            {/* <Button variant="ghost" onClick={() => setActiveSection('resources')}>Resources</Button> */}
            <Button variant="ghost" onClick={() => setActiveSection('about')}>About</Button>
          </HStack>
          <HStack spacing={4}>
            
            <Link to="/"><Button colorScheme="purple">Logout</Button></Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};



const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart Content Processing",
      description: "Upload PDFs, images, audio, or videos—our AI analyzes and extracts key concepts instantly."
    },
    {
      icon: Layout,
      title: "Adaptive Flashcards",
      description: "Convert your notes into dynamic, interactive flashcards customized to your learning style."
    },
    {
      icon: Brain,
      title: "AI-Powered Quizzes",
      description: "Generate tailored quizzes that challenge and reinforce your understanding."
    },
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Engage in interactive Q&A sessions with your study materials for deeper comprehension."
    },
    {
      icon: Share2,
      title: "Mind Map Generation",
      description: "Simplify complex topics with AI-generated mind maps that enhance retention and clarity."
    },
    {
      icon: ClipboardList,
      title: "Concise Summaries",
      description: "Get AI-driven summaries that highlight key ideas for quick and effective revision."
    }
  ];
  

  return (
    <Box py={20} bg="gray.50" id="features">
      <Container maxW="6xl">
        <VStack spacing={12}>
          <Box textAlign="center">
            <Text color="purple.500" fontWeight="semibold" mb={3}>
              FEATURES
            </Text>
            <Heading mb={4}>Unlock the Power of AI Learning</Heading>
            <Text color="gray.600" fontSize="lg" maxW="2xl">
              Our AI-driven platform transforms any content into an engaging and interactive learning experience.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {features.map((feature, index) => (
              <VStack
                key={index}
                align="start"
                p={6}
                bg="white"
                rounded="xl"
                shadow="md"
                borderWidth="1px"
                borderColor="gray.200"
                _hover={{
                  transform: "translateY(-4px)",
                  shadow: "xl",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <Flex
                  w={12}
                  h={12}
                  align="center"
                  justify="center"
                  rounded="xl"
                  bg="purple.100"
                  color="purple.600"
                  mb={4}
                >
                  <Icon as={feature.icon} size={24} />
                </Flex>
                <Text fontWeight="bold" fontSize="lg">
                  {feature.title}
                </Text>
                <Text color="gray.600">{feature.description}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};


const About = () => {
  const team = [
    {
      name: "Ilyas Ali benyahia ",
      role: "Computer Student",
      bio: "A university student at Hassiba Ben Boali University, Chlef, specializing in Computer Science."
    },
    {
      name: "Nassima Bousahba",
      role: "Computer Teacher",
      bio: "A professor at Hassiba Ben Boali University, Chlef, specializing in Computer Science"
    },
    {
      name: "Ayoub allai",
      role: "Computer Student",
      bio: "A university student at Hassiba Ben Boali University, Chlef, specializing in Computer Science."
    }
  ];

  return (
    <Box py={20} bg="white" id="about">
      <Container maxW="6xl">
        <VStack spacing={16}>
          <VStack spacing={8} textAlign="center">
            <Text color="purple.500" fontWeight="semibold">
              ABOUT US
            </Text>
            <Heading>Our Mission</Heading>
            <Text color="gray.600" fontSize="lg" maxW="3xl">
              At StudyVia, we believe that education should be accessible, engaging, and effective for everyone. 
              Our mission is to transform the way people learn by harnessing the power of artificial intelligence 
              to create personalized learning experiences that adapt to individual needs and preferences.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12} w="full" alignItems="center">
            <Box>
              <Heading size="lg" mb={6}>Our Story</Heading>
              <Text color="gray.600" mb={4}>
                our platform  was founded  by master's students and a research supervisor  who recognized the immense potential of artificial intelligence
                in education.Driven by apassion for innovation, they set out to createa smarter, more efficient learning experience powered by AI
              </Text>
              <Text color="gray.600" mb={4}>
                After months of research and development, we created a platform that can transform any content into 
                interactive learning materials tailored to individual learning styles.
              </Text>
              <Text color="gray.600">
                Today, StudyVia serves students, teachers, and any learners, helping them learn more 
                effectively and efficiently through the power of AI.
              </Text>
            </Box>
            <Image 
              src={require("../assete/www.jpg")} 
              alt="Team working" 
              rounded="lg" 
              shadow="lg" 
            />
          </SimpleGrid>

          <VStack spacing={8} w="full">
            <Heading>Leadership Team</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {team.map((member, index) => (
                <VStack
                  key={index}
                  p={6}
                  bg="white"
                  rounded="xl"
                  shadow="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  spacing={4}
                  align="center"
                >
                  <Box 
                    w={20} 
                    h={20} 
                    bg="purple.100" 
                    rounded="full" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                  >
                    <Text fontSize="2xl" color="purple.500">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </Box>
                  <Text fontWeight="bold" fontSize="lg">
                    {member.name}
                  </Text>
                  <Text color="purple.500" fontSize="sm" fontWeight="medium">
                    {member.role}
                  </Text>
                  <Text color="gray.600" textAlign="center">
                    {member.bio}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

const Footer = () => {
  return (
    <Box bg="white" py={16}>
      <Container maxW="6xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          borderTopWidth={1}
          borderColor="gray.200"
          pt={8}
        >
          <Text color="gray.600">
            © {new Date().getFullYear()} StudyVia. All rights reserved.
          </Text>
          <HStack spacing={4} mt={{ base: 4, md: 0 }}>
            <Button variant="ghost" size="sm">Twitter</Button>
            <Button variant="ghost" size="sm">LinkedIn</Button>
            <Button variant="ghost" size="sm">Facebook</Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

// Example files that won't persist in localStorage
const exampleFiles = [
  {
    id: 'example1',
    name: 'Biology-Chapter1.pdf',
    type: 'pdf',
    isExample: true,
    content: 'This is an example PDF file about Biology Chapter 1'
  },
  {
    id: 'example2',
    name: 'Chemistry-Reactions.jpg',
    type: 'image',
    isExample: true,
    content: 'This is an example image showing chemical reactions'
  },
  {
    id: 'example3',
    name: 'Physics-Lecture.mp4',
    type: 'video',
    isExample: true,
    content: 'This is an example video lecture about Physics'
  }
];

// Get files from localStorage or initialize with empty array
const getStoredFiles = () => {
  try {
    const stored = localStorage.getItem('uploadedFiles');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const FileIcon = ({ type }) => {
  const icons = {
    'image': FileImage,
    'video': FileVideo,
    'audio': FileAudio,
    'pdf': FileText,
    'zip': FileArchive,
    'default': File
  };
  
  const IconComponent = icons[type] || icons['default'];
  return <Icon as={IconComponent} />;
};

const FileHistorySidebar = ({ files, onSelectFile, onRemoveFile, isOpen, onToggle }) => {
  return (
    <Box 
      position="absolute" 
      left="0" 
      top="20"
      bottom="52"
      w={isOpen ? "300px" : "60px"}
      bg="white"
      boxShadow="lg"
      transition="all 0.3s ease"
      zIndex="sticky"
    >
      <Flex direction="column" h="100%" borderRight="1px" borderColor="gray.200">
        <Flex 
          p={4} 
          align="center" 
          justify={isOpen ? "space-between" : "center"}
          borderBottom="1px" 
          borderColor="gray.200"
          cursor="pointer"
          onClick={onToggle}
        >
          {isOpen ? (
            <>
              <HStack>
                <Icon as={History} color="purple.500" />
                <Text fontWeight="bold">File History</Text>
              </HStack>
              <Icon as={ChevronDown} />
            </>
          ) : (
            <Tooltip label="Show History" placement="right">
              <Icon as={History} color="purple.500" />
            </Tooltip>
          )}
        </Flex>
        
        <Collapse in={isOpen} animateOpacity>
          <Box flex="1" overflowY="auto" p={2}>
            {/* Example Files Section */}
            <Box mb={4}>
              <Text fontSize="xs" color="gray.500" mb={2} px={2}>
                EXAMPLE FILES
              </Text>
              <List spacing={2}>
                {exampleFiles.map((file) => (
                  <ListItem key={file.id}>
                    <Flex
                      align="center"
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: 'purple.50' }}
                      cursor="pointer"
                      onClick={() => onSelectFile(file)}
                    >
                      <Box color="purple.500" mr={3}>
                        <FileIcon type={file.type} />
                      </Box>
                      <Text flex="1" isTruncated fontSize="sm">
                        {file.name}
                      </Text>
                      <Badge colorScheme="purple" fontSize="xs">Example</Badge>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* User Files Section */}
            <Divider my={2} />
            <Box>
              <Text fontSize="xs" color="gray.500" mb={2} px={2}>
                YOUR FILES
              </Text>
              {files.length === 0 ? (
                <Text fontSize="sm" color="gray.500" px={2} py={4}>
                  No files uploaded yet
                </Text>
              ) : (
                <List spacing={2}>
                  {files.map((file, index) => (
                    <ListItem key={index}>
                      <Flex
                        align="center"
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: 'purple.50' }}
                        bg={file.isSelected ? 'purple.100' : 'transparent'}
                        cursor="pointer"
                        onClick={() => onSelectFile(file, index)}
                      >
                        <Box color="purple.500" mr={3}>
                          <FileIcon type={file.type} />
                        </Box>
                        <Text 
                          flex="1" 
                          isTruncated 
                          fontSize="sm"
                          fontWeight={file.isSelected ? "bold" : "normal"}
                        >
                          {file.name}
                        </Text>
                        <IconButton
                          icon={<X size={16} />}
                          size="xs"
                          variant="ghost"
                          aria-label="Remove file"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFile(index);
                          }}
                        />
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </Collapse>
        
        {isOpen && (
          <Box p={4} borderTop="1px" borderColor="gray.200">
            <Text fontSize="xs" color="gray.500">
              {files.length} {files.length === 1 ? 'file' : 'files'} stored
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

const App = () => {
  const bgColor = useColorModeValue('purple.50', 'gray.900');
  const [activeSection, setActiveSection] = useState('home');
  const [uploadedFiles, setUploadedFiles] = useState(getStoredFiles());
  const [selectedFile, setSelectedFile] = useState(null);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  // Save to localStorage whenever uploadedFiles changes
  useEffect(() => {
    try {
      // Only save files that aren't examples
      const filesToStore = uploadedFiles.filter(file => !file.isExample);
      localStorage.setItem('uploadedFiles', JSON.stringify(filesToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [uploadedFiles]);

  const handleFileUpload = (file) => {
    const newFile = { 
      ...file, 
      isSelected: true,
      id: Date.now().toString() // Add unique ID
    };
    setUploadedFiles(prev => [
      newFile,
      ...prev.map(f => ({ ...f, isSelected: false }))
    ]);
    setSelectedFile(newFile);
  };

  const handleSelectFile = (file, index) => {
    if (file.isExample) {
      // Handle example file selection
      setSelectedFile(file);
    } else {
      // Handle user file selection
      setUploadedFiles(prev => 
        prev.map((f, i) => ({ 
          ...f, 
          isSelected: i === index 
        }))
      );
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (prev[index].isSelected) {
        setSelectedFile(newFiles[0] || null);
        if (newFiles[0]) {
          newFiles[0].isSelected = true;
        }
      }
      return newFiles;
    });
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'features':
        return <Features />;
      case 'about':
        return <About />;
      case 'home':
      default:
        return (
          <AppProvider>
            <Box w="100vw" minH="100vh" bg={bgColor} color="gray.800">
              <FileHistorySidebar 
               
                files={uploadedFiles} 
                onSelectFile={handleSelectFile}
                onRemoveFile={handleRemoveFile}
                isOpen={isOpen}
                onToggle={onToggle}
              />
               
              <Box 
                ml={isOpen ? "300px" : "60px"} 
                transition="all 0.3s ease"
                p={4}
              >
                <Flex flex={1} justifyContent="center" alignItems="center" py={8}>
                  <Container maxW="container.xl">
                    <UploadSection onFileUpload={handleFileUpload} />
                    <StudyOptions selectedFile={selectedFile} />
                    <ResultsSection selectedFile={selectedFile} />
                  </Container>
                </Flex>
              </Box>
            </Box>
          </AppProvider>
        );
    }
  };

  return (
    <Box>
       <Header  setActiveSection={setActiveSection} />
      {renderSection()}
      <Footer />
    </Box>
  );
};

export default App;