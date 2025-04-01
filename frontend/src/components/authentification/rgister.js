import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container,
  InputGroup,
  InputRightElement,
  Icon,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { Eye, EyeOff, Brain, Mail, Lock, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation for password match
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
  
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        'http://localhost:8000/api/register/', 
        { username, email, password }, 
        config
      );
      
      toast({
        title: 'Registration Successful',
        description: "Your account has been created!",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  
      localStorage.setItem("userInfo", JSON.stringify(data)); // Store login info
      navigate('/dashboards'); // Redirect to dashboard
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || error.response?.data?.username || error.response?.data?.email || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box
        as="video"
        autoPlay
        muted
        loop
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        objectFit="cover"
        zIndex={-1}
      >
        <source src={require('../../assete/dribbble.mp4')} type="video/mp4" />
      </Box>

      <VStack spacing={8} align="center">
        <Flex align="center">
          <Icon as={Brain} color="purple.500" boxSize={8} mr={2} />
          <Heading color="purple.600">StudyVia</Heading>
        </Flex>
        
        <Box
          w="full"
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
        >
          <VStack spacing={6} align="flex-start">
            <Heading size="lg">Create your account</Heading>
            <Text color="gray.600">
              Join StudyVia and start your AI-powered learning journey
            </Text>
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4} align="flex-start" width="full">
                <FormControl isRequired>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <InputGroup>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      focusBorderColor="purple.500"
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <InputGroup>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      focusBorderColor="purple.500"
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      focusBorderColor="purple.500"
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        size="sm"
                        tabIndex="-1"
                      >
                        <Icon as={showPassword ? EyeOff : Eye} color="gray.500" />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      focusBorderColor="purple.500"
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        size="sm"
                        tabIndex="-1"
                      >
                        <Icon as={showConfirmPassword ? EyeOff : Eye} color="gray.500" />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                
                <Button 
                  type="submit" 
                  colorScheme="purple" 
                  width="full" 
                  size="lg"
                  isLoading={isLoading}
                  mt={4}
                >
                  Create Account
                </Button>
              </VStack>
            </form>
            
            <Divider />
            
            <Text textAlign="center" w="full">
              Already have an account?{' '}
              <Link as={RouterLink} to="/login" color="purple.500" fontWeight="semibold">
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}