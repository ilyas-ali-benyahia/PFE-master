import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  HStack,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { 
  Brain, 
  FileText, 
  Layout,
  MessageSquare,
  Share2, 
  ClipboardList,
  ArrowRight, 
  Star,
  Menu as MenuIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import UploadSection from './UploadSection';

const Header = ({ setActiveSection }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="white" py={{ base: 3, md: 4 }} borderBottom="1px" borderColor="gray.100" position="sticky" top="0" zIndex="sticky">
      <Container maxW="6xl">
        <Flex justify="space-between" align="center">
          <HStack spacing={{ base: 1, md: 2 }}>
            <Icon as={Brain} color="purple.500" boxSize={{ base: 6, md: 8 }} />
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="purple.500">
              StudyVia
            </Text>
          </HStack>
          
          {/* Desktop Navigation */}
          <HStack spacing={{ base: 4, md: 8 }} display={{ base: 'none', md: 'flex' }}>
            <Button variant="ghost" size={{ base: "sm", md: "md" }} onClick={() => setActiveSection('home')}>Home</Button>
            <Button variant="ghost" size={{ base: "sm", md: "md" }} onClick={() => setActiveSection('features')}>Features</Button>
            <Button variant="ghost" size={{ base: "sm", md: "md" }} onClick={() => setActiveSection('about')}>About</Button>
          </HStack>
          
          {/* Mobile Navigation Button */}
          <IconButton
            aria-label="Open menu"
            icon={<MenuIcon />}
            variant="ghost"
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
          />
          
          {/* Mobile Navigation Drawer */}
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">
                <HStack spacing={2}>
                  <Icon as={Brain} color="purple.500" boxSize={6} />
                  <Text fontSize="xl" fontWeight="bold" color="purple.500">StudyVia</Text>
                </HStack>
              </DrawerHeader>
              <DrawerBody pt={4}>
                <VStack spacing={4} align="stretch">
                  <Button variant="ghost" onClick={() => {
                    setActiveSection('home');
                    onClose();
                  }}>Home</Button>
                  <Button variant="ghost" onClick={() => {
                    setActiveSection('features');
                    onClose();
                  }}>Features</Button>
                  <Button variant="ghost" onClick={() => {
                    setActiveSection('about');
                    onClose();
                  }}>About</Button>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      </Container>
    </Box>
  );
};

const Hero = () => {
  return (
    <Box py={{ base: 10, md: 20 }} bg="purple.50">
      <Container maxW="6xl">
        <Stack 
          direction={{ base: 'column', lg: 'row' }} 
          spacing={{ base: 8, md: 10 }}
          align="center"
        >
          <VStack 
            spacing={{ base: 4, md: 6 }} 
            flex={1} 
            align={{ base: 'center', lg: 'flex-start' }}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            <Text 
              color="purple.600" 
              fontWeight="bold" 
              fontSize={{ base: "md", md: "lg" }}
            >
              AI-POWERED LEARNING PLATFORM
            </Text>
            <Heading 
              size={{ base: "xl", md: "2xl" }} 
              lineHeight="shorter"
            >
              Transform Any Content Into Interactive Learning Materials
            </Heading>
            <Text 
              fontSize={{ base: "md", md: "lg" }} 
              color="gray.600"
            >
              Upload your study materials and let our AI transform them into flashcards, 
              quizzes, summaries, and more to enhance your learning experience.
            </Text>
            <Stack 
              direction={{ base: 'column', md: 'row' }} 
              spacing={4} 
              w={{ base: 'full', md: 'auto' }}
            >
              <Button 
                colorScheme="purple" 
                size={{ base: "md", md: "lg" }}
                w={{ base: 'full', md: 'auto' }}
                rightIcon={<ArrowRight />}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                colorScheme="purple" 
                size={{ base: "md", md: "lg" }}
                w={{ base: 'full', md: 'auto' }}
              >
                Learn More
              </Button>
            </Stack>
          </VStack>
          <Box 
            flex={1} 
            position="relative"
            display={{ base: 'none', md: 'block' }}
          >
            <Image 
              src="/api/placeholder/600/400" 
              alt="AI Learning"
              rounded="lg" 
              shadow="xl"
              w="full"
            />
          </Box>
        </Stack>
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
    <Box py={{ base: 12, md: 20 }} bg="gray.50" id="features">
      <Container maxW="6xl">
        <VStack spacing={{ base: 8, md: 12 }}>
          <Box textAlign="center" px={{ base: 4, md: 0 }}>
            <Text color="purple.500" fontWeight="semibold" mb={{ base: 2, md: 3 }}>
              FEATURES
            </Text>
            <Heading mb={{ base: 3, md: 4 }} size={{ base: "lg", md: "xl" }}>
              Unlock the Power of AI Learning
            </Heading>
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }} maxW="2xl">
              Our AI-driven platform transforms any content into an engaging and interactive learning experience.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 8 }} w="full">
            {features.map((feature, index) => (
              <VStack
                key={index}
                align="start"
                p={{ base: 5, md: 6 }}
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
                height="100%"
              >
                <Flex
                  w={{ base: 10, md: 12 }}
                  h={{ base: 10, md: 12 }}
                  align="center"
                  justify="center"
                  rounded="xl"
                  bg="purple.100"
                  color="purple.600"
                  mb={4}
                >
                  <Icon as={feature.icon} size={{ base: 20, md: 24 }} />
                </Flex>
                <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>
                  {feature.title}
                </Text>
                <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                  {feature.description}
                </Text>
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
      name: "Ilyas Ali benyahia",
      role: "Computer Student",
      bio: "A university student at Hassiba Ben Boali University, Chlef, specializing in Computer Science."
    },
    {
      name: "Nassima Bousahba",
      role: "Computer Teacher",
      bio: "A professor at Hassiba Ben Boali University, Chlef, specializing in Computer Science."
    },
    {
      name: "Ayoub allai",
      role: "Computer Student",
      bio: "A university student at Hassiba Ben Boali University, Chlef, specializing in Computer Science."
    }
  ];

  return (
    <Box py={{ base: 12, md: 20 }} bg="white" id="about">
      <Container maxW="6xl">
        <VStack spacing={{ base: 10, md: 16 }}>
          <VStack spacing={{ base: 5, md: 8 }} textAlign="center" px={{ base: 4, md: 0 }}>
            <Text color="purple.500" fontWeight="semibold">
              ABOUT US
            </Text>
            <Heading size={{ base: "lg", md: "xl" }}>Our Mission</Heading>
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }} maxW="3xl">
              At StudyVia, we believe that education should be accessible, engaging, and effective for everyone. 
              Our mission is to transform the way people learn by harnessing the power of artificial intelligence 
              to create personalized learning experiences that adapt to individual needs and preferences.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 8, md: 12 }} w="full" alignItems="center">
            <Box>
              <Heading size={{ base: "md", md: "lg" }} mb={{ base: 4, md: 6 }}>Our Story</Heading>
              <Text color="gray.600" mb={4} fontSize={{ base: "sm", md: "md" }}>
                Our platform was founded by master's students and a research supervisor who recognized the immense potential of artificial intelligence
                in education. Driven by a passion for innovation, they set out to create a smarter, more efficient learning experience powered by AI.
              </Text>
              <Text color="gray.600" mb={4} fontSize={{ base: "sm", md: "md" }}>
                After months of research and development, we created a platform that can transform any content into 
                interactive learning materials tailored to individual learning styles.
              </Text>
              <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                Today, StudyVia serves students, teachers, and learners, helping them learn more 
                effectively and efficiently through the power of AI.
              </Text>
            </Box>
            <Box 
              display="flex" 
              justifyContent={{ base: "center", md: "flex-end" }}
              mt={{ base: 6, md: 0 }}
            >
              <Image 
                src="/api/placeholder/500/300" 
                alt="Team working" 
                rounded="lg" 
                shadow="lg"
                maxW={{ base: "90%", md: "100%" }}
              />
            </Box>
          </SimpleGrid>

          <VStack spacing={{ base: 6, md: 8 }} w="full">
            <Heading size={{ base: "lg", md: "xl" }}>Leadership Team</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 5, md: 8 }} w="full">
              {team.map((member, index) => (
                <VStack
                  key={index}
                  p={{ base: 4, md: 6 }}
                  bg="white"
                  rounded="xl"
                  shadow="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  spacing={{ base: 3, md: 4 }}
                  align="center"
                  height="100%"
                >
                  <Box 
                    w={{ base: 16, md: 20 }} 
                    h={{ base: 16, md: 20 }} 
                    bg="purple.100" 
                    rounded="full" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                  >
                    <Text fontSize={{ base: "xl", md: "2xl" }} color="purple.500">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </Box>
                  <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} textAlign="center">
                    {member.name}
                  </Text>
                  <Text color="purple.500" fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
                    {member.role}
                  </Text>
                  <Text color="gray.600" textAlign="center" fontSize={{ base: "xs", md: "sm" }}>
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

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ilyas Ali benyahia",
      role: "Computer Student",
      content: "StudyVia transformed how I study. The AI-generated flashcards saved me countless hours of preparation time."
    },
    {
      name: "Nassima Bousahba",
      role: "Computer Teacher",
      content: "I use StudyVia to create interactive materials for my students. The results have been incredible!"
    },
    {
      name: "Ayoub allai",
      role: "Computer Student",
      content: "The content chat feature is like having a personal tutor available 24/7. Absolutely game-changing."
    }
  ];

  return (
    <Box py={{ base: 12, md: 20 }} bg="gray.50">
      <Container maxW="6xl">
        <VStack spacing={{ base: 8, md: 12 }}>
          <Box textAlign="center" px={{ base: 4, md: 0 }}>
            <Text color="purple.500" fontWeight="semibold" mb={{ base: 2, md: 3 }}>
              TESTIMONIALS
            </Text>
            <Heading mb={{ base: 3, md: 4 }} size={{ base: "lg", md: "xl" }}>
              Loved by Students and Teachers
            </Heading>
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }} maxW="2xl">
              Join the learners who have transformed their education with StudyVia.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 8 }}>
            {testimonials.map((testimonial, index) => (
              <Box
                key={index}
                bg="white"
                p={{ base: 6, md: 8 }}
                rounded="lg"
                shadow="md"
                position="relative"
                height="100%"
              >
                <Icon 
                  as={Star} 
                  color="purple.500" 
                  position="absolute"
                  top={4}
                  right={4}
                  size={{ base: 18, md: 24 }}
                />
                <Text color="gray.600" mb={4} fontSize={{ base: "sm", md: "md" }}>
                  "{testimonial.content}"
                </Text>
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                  {testimonial.name}
                </Text>
                <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                  {testimonial.role}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

const CTA = () => {
  return (
    <Box bg="purple.50" py={{ base: 12, md: 20 }}>
      <Container maxW="6xl">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 6, md: 8 }}
          align="center"
          justify="space-between"
          px={{ base: 4, md: 0 }}
        >
          <Box maxW="2xl">
            <Heading mb={{ base: 3, md: 4 }} size={{ base: "lg", md: "xl" }}>
              Ready to Transform Your Learning?
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
              Join StudyVia to transform your learning into the best experience. Contact Sales
            </Text>
          </Box>
          <Stack 
            direction={{ base: 'column', sm: 'row' }} 
            spacing={4}
            width={{ base: "100%", md: "auto" }}
          >
            <Link to="/register" style={{ width: '100%' }}>
              <Button 
                size={{ base: "md", md: "lg" }} 
                colorScheme="purple" 
                rightIcon={<ArrowRight />}
                width={{ base: "100%", md: "auto" }}
              >
                Get Learning Free
              </Button>
            </Link>
            <Button 
              size={{ base: "md", md: "lg" }} 
              variant="outline" 
              colorScheme="purple"
              width={{ base: "100%", md: "auto" }}
            >
              Contact the team
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

const Footer = () => {
  return (
    <Box bg="white" py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          borderTopWidth={1}
          borderColor="gray.200"
          pt={{ base: 6, md: 8 }}
        >
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} textAlign={{ base: "center", md: "left" }}>
            © {new Date().getFullYear()} StudyVia. All rights reserved.
          </Text>
          <HStack spacing={{ base: 2, md: 4 }} mt={{ base: 4, md: 0 }}>
            <Button variant="ghost" size={{ base: "xs", md: "sm" }}>Twitter</Button>
            <Button variant="ghost" size={{ base: "xs", md: "sm" }}>LinkedIn</Button>
            <Button variant="ghost" size={{ base: "xs", md: "sm" }}>Facebook</Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch(activeSection) {
      case 'features':
        return <Features />;
      case 'about':
        return <About />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <Features />
            <Testimonials />
            <CTA />
          </>
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

export default React.memo(LandingPage);