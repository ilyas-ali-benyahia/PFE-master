  import { useState, useEffect } from 'react';
  import { supabase } from '../../supabase';
  import { useNavigate } from 'react-router-dom';
  import {
    Box,
    Button,
    Input,
    VStack,
    Text,
    Divider,
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
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useToast,
    Flex,
    Image,
    Spinner
  } from '@chakra-ui/react';
  import { FcGoogle } from 'react-icons/fc';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

  export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [session, setSession] = useState(null);
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
          setSession(session);
          
          if (session) {
            // Use relative path here
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
          setSession(session);
          
          if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && session)) {
            // Use relative path here
            navigate('/dashboards');
          }
        }
      );

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }, [navigate]);

    const handleTabsChange = (index) => {
      setTabIndex(index);
      setMessage({ type: '', content: '' });
    };

    const handleLogin = async (provider) => {
      setLoading(true);
      setMessage({ type: '', content: '' });
      
      try {
        // Get the current site URL dynamically
        const siteUrl = 'https://studyvia.vercel.app';
        
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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        showToast('success', 'Successfully logged in!');
        // Navigation will happen via onAuthStateChange
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
            setTabIndex(0); // Switch to sign in tab
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
            showToast('success', 'Account created successfully!');
            // Navigation will happen via onAuthStateChange
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
              src={require('../../assete/logo.png')} 
              alt="Logo" 
              w={100} 
              borderRadius="full" 
            />
            <Heading size="lg" mb={1}>Welcome</Heading>
            <Text color="gray.500" fontSize="md" textAlign="center">
              {tabIndex === 0 ? 'Sign in to your account' : 'Create a new account'}
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
          
          <Tabs isFitted variant="soft-rounded" colorScheme="blue" index={tabIndex} onChange={handleTabsChange} width="full">
            <TabList mb="1em">
              <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Sign In</Tab>
              <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
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
                </VStack>
              </TabPanel>
              
              <TabPanel p={0}>
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
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    );
  }