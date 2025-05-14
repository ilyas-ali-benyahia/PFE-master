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
  Text,
  useColorModeValue,
  VStack,
  HStack,
  SimpleGrid,
  Image,
  Link as ChakraLink,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/react';
import { 
  Brain,
  FileText,
  Layout,
  MessageSquare,
  MessageCircle,
  Share2,
  ClipboardList,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ setActiveSection }) => {
  // Add mobile menu functionality
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="white" py={4} borderBottom="1px" borderColor="gray.100">
      <Container maxW="6xl">
        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
             <Image 
                          src={require('../assete/logo.png')} 
                          boxSize={8} 
                        />
            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
              StudyVia
            </Text>
          </HStack>
          
          {/* Desktop navigation - only displayed on md screens and up */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <Button variant="ghost" onClick={() => setActiveSection('pricing')}>Home</Button>
            <Button variant="ghost" onClick={() => setActiveSection('features')}>Features</Button>           
            <Button variant="ghost" onClick={() => setActiveSection('about')}>About</Button>
            <ChakraLink href="https://docs.google.com/forms/d/e/1FAIpQLSfoKScbGuUK53iGPOojANyrVXizVkF2iZglM85sjCxJ4LltsA/viewform?usp=sharing" isExternal>
              <Button leftIcon={<Icon as={MessageCircle} />} colorScheme="teal" variant="outline">
                Feedback
              </Button>
            </ChakraLink>
          </HStack>
          
          {/* Desktop CTA buttons */}
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Link to="/"><Button colorScheme="purple">Logout</Button></Link>
          </HStack>
          
          {/* Mobile menu button */}
          <IconButton
            aria-label="Open menu"
            icon={<Icon as={Menu} />}
            variant="ghost"
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
          />

          {/* Mobile drawer menu */}
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Menu</DrawerHeader>
              <DrawerBody>
                <VStack spacing={4} align="stretch">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setActiveSection('pricing');
                      onClose();
                    }}>
                    Home
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setActiveSection('features');
                      onClose();
                    }}>
                    Features
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setActiveSection('about');
                      onClose();
                    }}>
                    About
                  </Button>
                  <ChakraLink 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfoKScbGuUK53iGPOojANyrVXizVkF2iZglM85sjCxJ4LltsA/viewform?usp=sharing" 
                    isExternal
                    w="100%"
                  >
                    <Button 
                      leftIcon={<Icon as={MessageCircle} />} 
                      colorScheme="teal" 
                      variant="outline"
                      w="100%"
                    >
                      Feedback
                    </Button>
                  </ChakraLink>
                  <Link to="/" style={{ width: '100%' }}>
                    <Button colorScheme="purple" w="100%">Logout</Button>
                  </Link>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
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
                in education. Driven by a passion for innovation, they set out to create a smarter, more efficient learning experience powered by AI
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
          align={{ base: 'center', md: 'flex-start' }}
          borderTopWidth={1}
          borderColor="gray.200"
          pt={8}
        >
          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={4}>
            <HStack spacing={2}>
            <Image 
                          src={require('../assete/logo.png')} 
                          boxSize={10}
                        />
              <Text fontSize="xl" fontWeight="bold" color="purple.500">
                StudyVia
              </Text>
            </HStack>
            <Text color="gray.600">
              © {new Date().getFullYear()} StudyVia. All rights reserved.
            </Text>
            <ChakraLink 
            // https://docs.google.com/forms/d/1ujVnRl-aSCFXsxrk2yFIWHsrKaR4BpLx2W7ohcJ0SSY/edit
              href="https://docs.google.com/forms/d/e/1FAIpQLSfoKScbGuUK53iGPOojANyrVXizVkF2iZglM85sjCxJ4LltsA/viewform?usp=sharing" 
              isExternal
              color="purple.500"
              display="flex"
              alignItems="center"
            >
              <Icon as={MessageCircle} mr={2} />
              Share your feedback
            </ChakraLink>
          </VStack>
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

const App = () => {
  const bgColor = useColorModeValue('purple.50', 'gray.900');
  const [activeSection, setActiveSection] = useState('home');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

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
            <Box w="100%" minH="100vh" bg={bgColor} color="gray.800">
              <Flex flex={1} justifyContent="center" alignItems="center" py={8}>
                <Container maxW="container.xl">
                  <UploadSection onFileUpload={handleFileUpload} />
                  <StudyOptions selectedFile={selectedFile} />
                  <ResultsSection selectedFile={selectedFile} />
                </Container>
              </Flex>
            </Box>
          </AppProvider>
        );
    }
  };

  return (
    <Box>
      <Header setActiveSection={setActiveSection} />
      {renderSection()}
      <Footer />
    </Box>
  );
};

export default App;