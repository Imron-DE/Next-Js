import { Box, Button, Checkbox, Container, Divider, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorMode, useColorModeValue, Spinner, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

function Login() {
  const { toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const formBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const linkColor = useColorModeValue("blue.600", "blue.500");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { Mutate } = useMutation();
  const toast = useToast();
  const router = useRouter();

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async () => {
    if (!payload.email || !payload.password) {
      setError("Harap isi email dan password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Kirim permintaan login ke API
      const response = await Mutate({
        url: "https://service.pace-unv.cloud/api/login",
        payload,
      });

      if (!response?.success) {
        // Jika login gagal, tampilkan pesan error
        toast({
          title: "Login Gagal",
          description: "Email atau password tidak sesuai",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      } else {
        // Jika login sukses, simpan token dan arahkan ke halaman utama
        Cookies.set("user_token", response?.data?.token, { expires: new Date(response?.data?.expired_at), path: "/" });
        router.push("/");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat login:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Silakan coba lagi nanti.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false); // Pastikan loading diatur ke false setelah login selesai
    }
  };

  return (
    <>
      <Heading as="h1" fontSize="4xl" fontWeight="bold" mb={4} textAlign="center" color="green.500" mt={40}>
        Connectify
      </Heading>
      <Box align="center" justify="center" mt={10}>
        <Container maxW="md">
          <Box bg={formBgColor} p={8} borderRadius="lg" boxShadow="lg" border="1px" borderColor={borderColor}>
            <Flex justify="center" mb={6}>
              <Heading as="h1" size="lg" color={useColorModeValue("gray.900", "white")}>
                LOGIN
              </Heading>
            </Flex>
            <Heading as="h2" size="md" mb={6} textAlign="center" color={useColorModeValue("gray.900", "white")}>
              please enter your details
            </Heading>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  value={payload.email}
                  onChange={(event) => setPayload({ ...payload, email: event.target.value })}
                  type="email"
                  placeholder="example@mail.com"
                  bg={useColorModeValue("gray.50", "gray.700")}
                  borderColor={borderColor}
                  _placeholder={{ color: useColorModeValue("gray.400", "gray.400") }}
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    value={payload.password}
                    onChange={(event) => setPayload({ ...payload, password: event.target.value })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    bg={useColorModeValue("gray.50", "gray.700")}
                    borderColor={borderColor}
                    _placeholder={{ color: useColorModeValue("gray.400", "gray.400") }}
                    focusBorderColor="blue.500"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleTogglePasswordVisibility}>
                      {showPassword ? "Sembunyikan" : "Tampilkan"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              {error && (
                <Text color="red.500" textAlign="center">
                  {error}
                </Text>
              )}
              <Flex justify="space-between" align="center">
                <Checkbox>Ingat saya</Checkbox>
                <Link color={linkColor} href="#" fontWeight="medium">
                  Lupa password?
                </Link>
              </Flex>
              <Button onClick={handleSubmit} colorScheme="green" w="full" size="md" isLoading={loading} loadingText="Sedang masuk">
                Masuk
              </Button>
            </Stack>
            <Divider my={4} />
            <Text textAlign="center" color={useColorModeValue("gray.500", "gray.400")}>
              Dont have an account?{" "}
              <Link href="/register" color={linkColor} fontWeight="medium">
                Register
              </Link>
            </Text>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Login;
