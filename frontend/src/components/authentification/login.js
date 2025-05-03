import { useState, useEffect } from 'react';
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
  Spinner, Divider,
  InputRightElement,
  IconButton,
  useToast,
  Flex,
  Image,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('blue.50', 'blue.900');

  // Check for authentication status on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Save user info to localStorage
          localStorage.setItem('userInfo', JSON.stringify({
            token: session.access_token,
            user: session.user
          }));
          // Redirect to dashboard
          navigate('/dashboards');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setAuthChecking(false);
      }
    };
    
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          // Save user info to localStorage when signed in
          localStorage.setItem('userInfo', JSON.stringify({
            token: session.access_token,
            user: session.user
          }));
          navigate('/dashboards');
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Save user info to localStorage
      if (data && data.session) {
        localStorage.setItem('userInfo', JSON.stringify({
          token: data.session.access_token,
          user: data.user
        }));
      }
      
      showToast('success', 'Successfully logged in!');
      // Navigate to dashboard
      navigate('/dashboards');
    } catch (error) {
      showToast('error', error.message);
      setMessage({ type: 'error', content: error.message });
      setLoading(false);
    }
  };

  const showToast = (status, description) => {
    toast({
      title: status === 'success' ? 'Success' : 'Error',
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({ type: 'error', content: 'Please enter your email address' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', content: '' });
    
    try {
      // Get the current site URL dynamically
      const siteUrl = window.location.origin;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });
      
      if (error) throw error;
      
      showToast('success', 'Password reset email sent!');
      setMessage({ type: 'success', content: 'Check your email for the password reset link' });
    } catch (error) {
      showToast('error', error.message);
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (authChecking) {
    return (
      <Container centerContent maxW="md" py={20}>
        <VStack spacing={6}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Checking authentication...</Text>
        </VStack>
      </Container>
    );
  }
  
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
          <Heading size="lg" mb={1}>Welcome Back</Heading>
          <Text color="gray.500" fontSize="md" textAlign="center">
            Sign in to your account
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
        
        <VStack as="form" onSubmit={handleEmailLogin} spacing={4} w="full">
          <FormControl id="login-email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              height="45px"
            />
          </FormControl>
          
          <FormControl id="login-password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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
          
          <Text 
            alignSelf="flex-end" 
            fontSize="sm" 
            color="blue.500" 
            cursor="pointer" 
            fontWeight="medium"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </Text>
          
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="full"
            isLoading={loading}
            loadingText="Signing In"
            height="50px"
            mt={2}
          >
            Sign In
          </Button>
          
          <Text mt={4} textAlign="center">
            Don't have an account?{" "}
            <Text
              as="span"
              color="blue.500"
              fontWeight="medium"
              cursor="pointer"
              onClick={() => navigate('/register')}
            >
              Sign up
            </Text>
          </Text>
        </VStack>
      </VStack>
    </Container>
  );
}
