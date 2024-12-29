import Link from "next/link";
import { Box, Flex, HStack, IconButton, Button, Menu, MenuButton, MenuItem, MenuList, useDisclosure, useColorModeValue, Stack, Spinner } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useQueries } from "@/hooks/useQueries";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { Mutate } = useMutation();
  const { data, isLoading } = useQueries({
    prefixUrl: "https://service.pace-unv.cloud/api/user/me",
    headers: {
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    },
  });

  const handleLogout = async () => {
    const response = await Mutate({
      url: "https://service.pace-unv.cloud/api/logout",
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });

    if (!response?.success) {
      console.error("Failed to logout:");
    } else {
      Cookies.remove("user_token");
      router.push("/login");
    }
  };

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      px={4}
      shadow="md"
      width="100%" // Pastikan navbar mengikuti lebar container
      position="fixed"
      top={0}
      zIndex={1000}
    >
      <Flex
        maxW="container.lg" // Tentukan lebar maksimal container agar tetap responsif
        mx="auto" // Tengah-kan elemen container
        h={16}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Logo */}
        <Box color="green.500" fontSize="xl" fontWeight="bold">
          <Link href="/">SocialApp</Link>
        </Box>

        {/* Navigation Links */}
        <HStack spacing={8} alignItems="center" display={{ base: "none", md: "flex" }} color="green.500">
          <Link href="/" _hover={{ textDecoration: "underline" }}>
            Home
          </Link>
          <Link href="/profile" _hover={{ textDecoration: "underline" }}>
            Profile
          </Link>
          <Link href="/notifications" _hover={{ textDecoration: "underline" }}>
            Notifications
          </Link>
        </HStack>

        {/* User Dropdown */}
        <Flex alignItems="center">
          <Menu>
            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0} colorScheme="blue">
              {isLoading ? <Spinner size="sm" /> : data?.data?.name || "User"}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout} color="red.500">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {/* Mobile Navigation Toggle */}
        <IconButton size="md" icon={isOpen ? <CloseIcon /> : <HamburgerIcon />} aria-label="Open Menu" display={{ md: "none" }} onClick={isOpen ? onClose : onOpen} />
      </Flex>

      {/* Mobile Navigation */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4} color="white">
            <Link href="/" _hover={{ textDecoration: "underline" }}>
              Home
            </Link>
            <Link href="/profile" _hover={{ textDecoration: "underline" }}>
              Profile
            </Link>
            <Link href="/notifications" _hover={{ textDecoration: "underline" }}>
              Notifications
            </Link>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Header;
