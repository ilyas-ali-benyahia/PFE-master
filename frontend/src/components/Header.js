// components/Header.js
import React from 'react';
import { Box, Container, Flex, HStack, Text, Button, Icon } from '@chakra-ui/react';
import { Brain } from 'lucide-react';

const Header = () => {
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
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Resources</Button>
            <Button variant="ghost">About</Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default React.memo(Header);