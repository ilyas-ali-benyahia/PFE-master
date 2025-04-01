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
  Divider,
} from '@chakra-ui/react';
import { Eye, EyeOff, Brain, User, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // setIsLoading(true);
  
    try {
      // const config = { headers: { "Content-Type": "application/json" } };
      // const { data } = await axios.post('/api/login/', { username, password }, config);
      
      // toast({
      //   title: 'Login Successful',
      //   description: "Welcome back!",
      //   status: 'success',
      //   duration: 3000,
      //   isClosable: true,
      // });
  
      // localStorage.setItem("userInfo", JSON.stringify(data));
      navigate('/dashboards');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.message || 'Invalid username or password.',
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
        <Icon as={Brain} color="purple.500" boxSize={8} />
        <Heading color="purple.600">StudyVia</Heading>
        
        <Box
          w="full"
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
        >
          <VStack spacing={6} align="flex-start">
            <Heading size="lg">Sign in to your account</Heading>
            <Text color="gray.600">
              Welcome back to StudyVia
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
                      placeholder="Enter your username"
                      leftElement={<Icon as={User} color="gray.500" />}
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
                      placeholder="Enter your password"
                      focusBorderColor="purple.500"
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        // onClick={() => setShowPassword(!showPassword)}
                        size="sm"
                        tabIndex="-1"
                      >
                        <Icon as={showPassword ? EyeOff : Eye} color="gray.500" />
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
                  Sign In
                </Button>
              </VStack>
            </form>
            
            <Divider />
            
            <Text textAlign="center" w="full">
              Don't have an account?{' '}
              <Link as={RouterLink} to="/register" color="purple.500" fontWeight="semibold">
                Create an account
              </Link>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}