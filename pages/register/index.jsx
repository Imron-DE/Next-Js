import { Box, Button, Container, Divider, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorMode, useColorModeValue, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { useRouter } from "next/router";

function Register() {
  const { toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const formBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const linkColor = useColorModeValue("blue.600", "blue.500");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
    hobby: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { Mutate } = useMutation();
  const toast = useToast();
  const router = useRouter();

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async () => {
    if (!payload.name || !payload.email || !payload.dob || !payload.phone || !payload.hobby || !payload.password) {
      setError("Harap isi semua data.");
      return;
    }
    setError("");

    // Validasi tanggal lahir
    if (new Date(payload.dob) > new Date()) {
      setError("Tanggal lahir tidak valid.");
      return;
    }

    setLoading(true);

    const response = await Mutate({
      url: "https://service.pace-unv.cloud/api/register",
      payload,
    });

    if (!response?.success) {
      toast({
        title: "Registrasi Gagal",
        description: response?.message || "Terjadi kesalahan.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Registrasi Berhasil",
        description: "Silakan login untuk melanjutkan.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
      <Container maxW="md">
        <Box bg={formBgColor} p={8} borderRadius="lg" boxShadow="lg" border="1px" borderColor={borderColor}>
          <Flex justify="center" mb={6}>
            <Heading as="h1" size="lg" color={useColorModeValue("gray.900", "white")}>
              REGISTER
            </Heading>
          </Flex>
          <Heading as="h2" size="md" mb={6} textAlign="center" color={useColorModeValue("gray.900", "white")}>
            Buat akun baru Anda
          </Heading>
          <Stack spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel>Name*</FormLabel>
              <Input
                value={payload.name}
                onChange={(event) => setPayload({ ...payload, name: event.target.value })}
                placeholder="Name ..."
                bg={useColorModeValue("gray.50", "gray.700")}
                borderColor={borderColor}
                focusBorderColor="blue.500"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email*</FormLabel>
              <Input
                value={payload.email}
                onChange={(event) => setPayload({ ...payload, email: event.target.value })}
                type="email"
                placeholder="Email ..."
                bg={useColorModeValue("gray.50", "gray.700")}
                borderColor={borderColor}
                focusBorderColor="blue.500"
              />
            </FormControl>
            <FormControl id="dob" isRequired>
              <FormLabel>Dob</FormLabel>
              <Input value={payload.dob} onChange={(event) => setPayload({ ...payload, dob: event.target.value })} type="date" bg={useColorModeValue("gray.50", "gray.700")} borderColor={borderColor} focusBorderColor="blue.500" />
            </FormControl>
            <FormControl id="phone">
              <FormLabel>Phone</FormLabel>
              <Input
                value={payload.phone}
                onChange={(event) => setPayload({ ...payload, phone: event.target.value })}
                placeholder="Phone ..."
                bg={useColorModeValue("gray.50", "gray.700")}
                borderColor={borderColor}
                focusBorderColor="blue.500"
              />
            </FormControl>
            <FormControl id="hobby">
              <FormLabel>Hobby</FormLabel>
              <Input
                value={payload.hobby}
                onChange={(event) => setPayload({ ...payload, hobby: event.target.value })}
                placeholder="Hobby ..."
                bg={useColorModeValue("gray.50", "gray.700")}
                borderColor={borderColor}
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
            <Button onClick={handleSubmit} colorScheme="blue" w="full" size="md" isLoading={loading} loadingText="Sedang daftar">
              Daftar
            </Button>
          </Stack>
          <Divider my={4} />
          <Text textAlign="center" color={useColorModeValue("gray.500", "gray.400")}>
            Sudah punya akun?{" "}
            <Link href="/login" color={linkColor} fontWeight="medium">
              Masuk
            </Link>
          </Text>
        </Box>
      </Container>
    </Flex>
  );
}

export default Register;
