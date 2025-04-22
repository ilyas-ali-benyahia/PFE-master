import { useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  useColorModeValue,
  Container,
  Heading,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Flex,
  Image,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('blue.50', 'blue.900');

  const handleLogin = async (provider) => {
    setLoading(true);
    setMessage({ type: '', content: '' });
    
    try {
      // Get the current site URL dynamically
      const siteUrl = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${siteUrl}/dashboards`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      showToast('error', error.message);
      setMessage({ type: 'error', content: error.message });
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });
    
    if (password.length < 6) {
      setMessage({ type: 'error', content: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }
    
    try {
      // Get the current site URL dynamically
      const siteUrl = window.location.origin;
      
      // First create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username, // Store username in user metadata
          },
          emailRedirectTo: `${siteUrl}/dashboards` // Add explicit redirect URL
        },
      });

      if (error) throw error;
      
      // If successful signup, also store in profiles table
      if (data.user) {
        // Handle case where user might already exist but isn't confirmed
        if (data.user.identities?.length === 0) {
          showToast('info', 'This email is already registered. Please sign in instead.');
          navigate('/login');
          setLoading(false);
          return;
        }
        
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              username, 
              email,
              created_at: new Date().toISOString(),
            }
          ])
          .select();
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Continue with auth flow even if profile creation fails
        }
        
        if (data.session) {
          // User is automatically signed in (no email confirmation required)
          // Save user info to localStorage
          localStorage.setItem('userInfo', JSON.stringify({
            token: data.session.access_token,
            user: data.user
          }));
          
          showToast('success', 'Account created successfully!');
          navigate('/dashboards');
        } else {
          // User needs to confirm email
          showToast('success', 'Please check your email for confirmation!');
          setMessage({ type: 'success', content: 'Check your email for the confirmation link!' });
          setLoading(false);
        }
      }
    } catch (error) {
      showToast('error', error.message);
      setMessage({ type: 'error', content: error.message });
      setLoading(false);
    }
  };

  const showToast = (status, description) => {
    toast({
      title: status === 'success' ? 'Success' : status === 'info' ? 'Information' : 'Error',
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container maxW="md" py={8}>
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
      <VStack 
        spacing={6} 
        bg={bgColor} 
        p={8} 
        borderRadius="xl" 
        boxShadow="lg" 
        border="1px" 
        borderColor={borderColor}
      >
        <Flex direction="column" align="center" justify="center" w="full">
          <Image 
            src="/api/placeholder/80/80" 
            alt="Logo" 
            mb={2} 
            borderRadius="full" 
          />
          <Heading size="lg" mb={1}>Get Started</Heading>
          <Text color="gray.500" fontSize="md" textAlign="center">
            Create a new account
          </Text>
        </Flex>
        
        {message.content && (
          <Alert status={message.type} borderRadius="md" variant="left-accent">
            <AlertIcon />
            {message.content}
          </Alert>
        )}
        
        <Button
          leftIcon={<FcGoogle />}
          onClick={() => handleLogin('google')}
          isLoading={loading}
          loadingText="Processing..."
          size="lg"
          w="full"
          variant="outline"
          height="50px"
          fontSize="md"
          _hover={{ bg: highlightColor }}
        >
          Continue with Google
        </Button>
        
        <Box w="full" textAlign="center">
          <Divider my={3} />
          <Text fontSize="sm" color="gray.500" mt={2}>
            or continue with email
          </Text>
        </Box>
        
        <VStack as="form" onSubmit={handleSignUp} spacing={4} w="full">
          <FormControl id="signup-username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              height="45px"
            />
          </FormControl>
          
          <FormControl id="signup-email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              height="45px"
            />
          </FormControl>
          
          <FormControl id="signup-password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                height="45px"
              />
              <InputRightElement h="full">
                <IconButton
                  size="sm"
                  variant="ghost"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          
          <Text fontSize="xs" color="gray.500" alignSelf="flex-start">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>
          
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="full"
            isLoading={loading}
            loadingText="Creating Account"
            height="50px"
            mt={2}
          >
            Create Account
          </Button>
          
          <Text mt={4} textAlign="center">
            Already have an account?{" "}
            <Text
              as="span"
              color="blue.500"
              fontWeight="medium"
              cursor="pointer"
              onClick={() => navigate('/login')}
            >
              Sign in
            </Text>
          </Text>
        </VStack>
      </VStack>
    </Container>
  );
}
