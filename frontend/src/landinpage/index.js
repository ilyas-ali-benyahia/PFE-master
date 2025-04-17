import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  List,
  ListItem,
  ListIcon,
  Stack,
  Text,
  useColorModeValue,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  HStack,
  Badge,
  AspectRatio,
} from '@chakra-ui/react';
import { 
  Brain, 
  Rocket, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Layout,
  FileText,
  MessageSquare,
  Share2, 
  ClipboardList,
  Zap,
  Book,
  Award,
  Hash,
  Play,
  Pause
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from '../components/authentification/login';
import Register from '../components/authentification/rgister';

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
            <Link to="/login"><Button variant="ghost">Sign in</Button></Link> 
            <Link to="/register"><Button colorScheme="purple">Get Started</Button></Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

const Hero = ({ scrollToVideo }) => {
  return (
    <Box bg="purple.50" py={20}>
      <Container maxW="6xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
          <Box>
            <Heading size="2xl" mb={6} lineHeight="shorter">
              Transform Learning with 
              <chakra.span color="purple.500"> AI-Powered</chakra.span> Education
            </Heading>
            <Text fontSize="xl" color="gray.600" mb={8}>
              Upload any content and watch it transform into interactive learning materials. Enhance your 
              understanding with AI-generated flashcards, quizzes, mind maps, summaries, and chatbot assistance.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Link to="/register">
                <Button 
                  size="lg" 
                  colorScheme="purple" 
                  rightIcon={<ArrowRight />}
                >
                  Start Learning Free
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                onClick={scrollToVideo}
                leftIcon={<Play size={16} />}
              >
                Watch Demo
              </Button>
            </Stack>
          </Box>
          <Box>
            <Image 
              src={require("../assete/www.jpg")}
              alt="Learning Dashboard" 
              rounded="lg" 
              shadow="3xl"
            />
          </Box>
        </Grid>
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

// New Video Demo Component
const DemoVideo = ({ videoRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  
  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  return (
    <Box py={20} bg="white" id="demo-video" ref={videoRef}>
      <Container maxW="6xl">
        <VStack spacing={12}>
          <Box textAlign="center">
            <Text color="purple.500" fontWeight="semibold" mb={3}>
              SEE IT IN ACTION
            </Text>
            <Heading mb={4}>Experience StudyVia</Heading>
            <Text color="gray.600" fontSize="lg" maxW="2xl" mb={10}>
              Watch how our platform transforms learning content into interactive materials 
              that enhance comprehension and retention.
            </Text>
          </Box>
          
          <Box 
            borderRadius="xl" 
            overflow="hidden" 
            boxShadow="2xl" 
            bg="gray.900"
            w="full"
            maxW="5xl"
            mx="auto"
            transform="perspective(1000px) rotateX(5deg)"
            _hover={{
              transform: "perspective(1000px) rotateX(0deg)",
              transition: "all 0.3s ease-in-out",
            }}
            transition="all 0.3s ease-in-out"
          >
            <Box p={6} borderBottom="1px" borderColor="gray.700">
              <Flex justify="space-between" align="center">
                <HStack>
                  <Icon as={Brain} color="purple.400" boxSize={6} />
                  <Text color="white" fontWeight="bold" fontSize="lg">StudyVia Demo</Text>
                </HStack>
                <Badge colorScheme="purple" variant="solid" fontSize="sm" px={3} py={1} borderRadius="full">
                  AI-Powered Learning
                </Badge>
              </Flex>
            </Box>
            
            <Box position="relative">
              <AspectRatio ratio={16/9}>
                <video
                  ref={playerRef}
                  src={require("../assete/pfee.mp4")}
                  poster="/api/placeholder/1280/720"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </AspectRatio>
              
              <Flex
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                bg="blackAlpha.700"
                p={4}
                backdropFilter="blur(10px)"
                justify="space-between"
                align="center"
              >
                <Button
                  variant="solid"
                  bg="purple.500"
                  color="white"
                  onClick={handlePlayPause}
                  leftIcon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  size="md"
                  _hover={{ bg: "purple.600" }}
                  borderRadius="full"
                  px={6}
                >
                  {isPlaying ? 'Pause' : 'Play Demo'}
                </Button>
                <Text color="white" fontSize="md" fontWeight="medium">
                  See how StudyVia transforms your learning experience
                </Text>
              </Flex>
            </Box>
            
            <Box p={6} bg="gray.800">
              <Flex justify="space-between" align="center">
                <Text color="gray.300" fontSize="sm">Interactive learning demonstration</Text>
                <HStack>
                  <Icon as={CheckCircle2} color="green.400" size={16} />
                  <Text color="green.400" fontSize="sm" fontWeight="medium">AI-Powered</Text>
                </HStack>
              </Flex>
            </Box>
          </Box>
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

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ilyas Ali benyahia ",
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
    <Box py={20} bg="gray.50">
      <Container maxW="6xl">
        <VStack spacing={12}>
          <Box textAlign="center">
            <Text color="purple.500" fontWeight="semibold" mb={3}>
              TESTIMONIALS
            </Text>
            <Heading mb={4}>Loved by Students and Teachers</Heading>
            <Text color="gray.600" fontSize="lg" maxW="2xl">
              Join the learners who have transformed their education with StudyVia.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {testimonials.map((testimonial, index) => (
              <Box
                key={index}
                bg="white"
                p={8}
                rounded="lg"
                shadow="md"
                position="relative"
              >
                <Icon 
                  as={Star} 
                  color="purple.500" 
                  position="absolute"
                  top={4}
                  right={4}
                />
                <Text color="gray.600" mb={4}>
                  "{testimonial.content}"
                </Text>
                <Text fontWeight="bold">{testimonial.name}</Text>
                <Text color="gray.500" fontSize="sm">
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
    <Box bg="purple.50" py={20}>
      <Container maxW="6xl">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={8}
          align="center"
          justify="space-between"
        >
          <Box maxW="2xl">
            <Heading mb={4}>Ready to Transform Your Learning?</Heading>
            <Text fontSize="lg" color="gray.600">
              Join StudyVia to transform your learning into the best experience. Contact Sales
            </Text>
          </Box>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
            <Link to="/register">
              <Button 
                size="lg" 
                colorScheme="purple" 
                rightIcon={<ArrowRight />}
              >
                Get Learning Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" colorScheme="purple">
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
    <Box bg="white" py={16}>
      <Container maxW="6xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} mb={8}>
          {/* Footer content (commented out in original) */}
        </SimpleGrid>
        
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

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState(null);
  const videoSectionRef = useRef(null);
  
  // Function to scroll to the video section
  const scrollToVideo = () => {
    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Also ensure the video section is visible by setting the active section if needed
    if (activeSection !== null && activeSection !== 'pricing') {
      setActiveSection(null); // Go to home view which includes the video
    }
  };

  // Function to render the appropriate section based on activeSection
  const renderSection = () => {
    switch(activeSection) {
      case 'features':
        return (
          <>
            <Features />
            <DemoVideo videoRef={videoSectionRef} />
          </>
        );
      case 'about':
        return <About />;
      default:
        // Return all sections for default/home view
        return (
          <>
            <Hero scrollToVideo={scrollToVideo} />
            <Features />
            <DemoVideo videoRef={videoSectionRef} />
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

export default LandingPage;