import { Box, Text, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="gray.800" color="white" p={4} textAlign="center">
      <Text fontSize="sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</Text>
      <Text fontSize="sm">
        <Link color="teal.400" href="/privacy-policy">
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link color="teal.400" href="/terms-of-service">
          Terms of Service
        </Link>
      </Text>
    </Box>
  );
};

export default Footer;
