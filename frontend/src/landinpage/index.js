import React, { useState } from 'react';
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
  Hash
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

const Hero = () => {
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
              <Button size="lg" variant="outline">
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



// const Resources = () => {
//   const resources = [
//     {
//       icon: Book,
//       title: "Learning Guides",
//       description: "Step-by-step guides on how to maximize your learning with StudyVia's AI tools."
//     },
//     {
//       icon: FileText,
//       title: "Blog Articles",
//       description: "Insights on education, AI, and learning methodologies from our experts."
//     },
//     {
//       icon: Layout,
//       title: "Tutorials",
//       description: "Video and written tutorials to help you make the most of our platform."
//     },
//     {
//       icon: MessageSquare,
//       title: "Community Forum",
//       description: "Connect with other learners and share tips, resources, and success stories."
//     },
//     {
//       icon: Award,
//       title: "Case Studies",
//       description: "Real-world examples of how StudyVia has transformed learning outcomes."
//     },
//     {
//       icon: Hash,
//       title: "API Documentation",
//       description: "Technical resources for developers integrating with our platform."
//     }
//   ];

//   return (
//     <Box py={20} bg="gray.50" id="resources">
//       <Container maxW="6xl">
//         <VStack spacing={12}>
//           <Box textAlign="center">
//             <Text color="purple.500" fontWeight="semibold" mb={3}>
//               RESOURCES
//             </Text>
//             <Heading mb={4}>Knowledge Hub</Heading>
//             <Text color="gray.600" fontSize="lg" maxW="2xl">
//               Explore our collection of resources to enhance your learning journey.
//             </Text>
//           </Box>

//           <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
//             {resources.map((resource, index) => (
//               <VStack
//                 key={index}
//                 align="start"
//                 p={6}
//                 bg="white"
//                 rounded="xl"
//                 shadow="md"
//                 borderWidth="1px"
//                 borderColor="gray.200"
//                 _hover={{
//                   transform: "translateY(-4px)",
//                   shadow: "xl",
//                   transition: "all 0.3s ease-in-out",
//                 }}
//               >
//                 <Flex
//                   w={12}
//                   h={12}
//                   align="center"
//                   justify="center"
//                   rounded="xl"
//                   bg="purple.100"
//                   color="purple.600"
//                   mb={4}
//                 >
//                   <Icon as={resource.icon} size={24} />
//                 </Flex>
//                 <Text fontWeight="bold" fontSize="lg">
//                   {resource.title}
//                 </Text>
//                 <Text color="gray.600">{resource.description}</Text>
//                 <Button variant="link" colorScheme="purple" mt={4} rightIcon={<ArrowRight size={16} />}>
//                   Explore
//                 </Button>
//               </VStack>
//             ))}
//           </SimpleGrid>
//         </VStack>
//       </Container>
//     </Box>
//   );
// };

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
          {/* <Stack spacing={4}>
            <HStack spacing={2}>
              <Icon as={Brain} color="purple.500" boxSize={8} />
              <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                StudyVia
              </Text>
            </HStack>
            <Text color="gray.600">
              Transforming education through AI-powered learning tools.
            </Text>
          </Stack> */}
          
          {/* <Stack spacing={4}>
            <Text fontWeight="bold">Product</Text>
            <Button variant="link" color="gray.600">Features</Button>
            <Button variant="link" color="gray.600">Pricing</Button>
            <Button variant="link" color="gray.600">Resources</Button>
          </Stack>
          
          <Stack spacing={4}>
            <Text fontWeight="bold">Company</Text>
            <Button variant="link" color="gray.600">About</Button>
            <Button variant="link" color="gray.600">Blog</Button>
            <Button variant="link" color="gray.600">Careers</Button>
          </Stack>
          
          <Stack spacing={4}>
            <Text fontWeight="bold">Legal</Text>
            <Button variant="link" color="gray.600">Privacy</Button>
            <Button variant="link" color="gray.600">Terms</Button>
            <Button variant="link" color="gray.600">Security</Button>
          </Stack> */}
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

  // Function to render the appropriate section based on activeSection
  const renderSection = () => {
    switch(activeSection) {
      case 'features':
        return <Features />;
     
      
      case 'about':
        return <About />;
      default:
        // Return all sections for default/home view
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

export default LandingPage;