import { Box, Text, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="green.500" color="white" p={4} textAlign="center">
      <Text fontSize="sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</Text>
      <Text fontSize="sm">
        <Link color="blue.600" href="/privacy-policy">
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link color="blue.600" href="/terms-of-service">
          Terms of Service
        </Link>
      </Text>
    </Box>
  );
};

export default Footer;
