import Link from "next/link";
import { Box, Flex, HStack, IconButton, Button, Menu, MenuButton, MenuItem, MenuList, useDisclosure, useColorModeValue, Stack, Spinner, Avatar } from "@chakra-ui/react";
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
    <Box bg={useColorModeValue("white", "gray.800")} px={4} shadow="md" width="100%" position="fixed" top={0} zIndex={1000}>
      <Flex maxW="container.lg" mx="auto" h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Box color="green.500" fontSize="xl" fontWeight="bold">
          <Link href="/">Connectify</Link>
        </Box>

        {/* User Dropdown */}
        <Flex alignItems="center">
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
              display="flex"
              alignItems="center"
              gap={3} // Jarak antara Avatar dan teks
              colorScheme="green"
              _hover={{ bg: "green.100" }}
            >
              {/* Avatar */}
              <Avatar size="sm" name={data?.data?.name || "User"} src={data?.data?.avatarUrl || ""} mr={2} />

              {/* Nama atau Loading Spinner */}
              {isLoading ? <Spinner size="sm" /> : data?.data?.name || "User"}
            </MenuButton>

            <MenuList placement="left-start">
              <MenuItem>
                <Link href="/" _hover={{ textDecoration: "underline" }} color={router.pathname === "/" ? "green.600" : "green.500"}>
                  Home
                </Link>
              </MenuItem>
              <MenuItem>
                <Link href="/profile" _hover={{ textDecoration: "underline" }} color={router.pathname === "/profile" ? "green.600" : "green.500"}>
                  Profile
                </Link>
              </MenuItem>
              <MenuItem>
                <Link href="/notifications" _hover={{ textDecoration: "underline" }} color={router.pathname === "/notifications" ? "green.600" : "green.500"}>
                  Notifications
                </Link>
              </MenuItem>
              <MenuItem onClick={handleLogout} color="red.500">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
