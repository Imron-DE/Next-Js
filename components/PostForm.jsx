import { Button, Textarea, Box, Spinner, useToast } from "@chakra-ui/react";
import { useState } from "react";

const PostForm = ({ newPost, setNewPost, addPost }) => {
  const toast = useToast(); // Toast notification
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle the submitting process

  const handleAddPost = async () => {
    setIsSubmitting(true);
    try {
      await addPost(); // Call the addPost function to add the new post
      toast({
        title: "Post added.",
        description: "Your post was successfully added.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setNewPost(""); // Clear the post input after successful submission
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "There was an issue adding your post.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      mb={6}
      maxW="600px" // Lebar maksimal untuk Box
      w="100%" // Membuat Box responsif
      p={6} // Padding untuk memberi ruang di dalam Box
      mx="auto" // Memusatkan Box secara horizontal
      borderWidth={1} // Menambahkan border tipis
      borderRadius="md" // Sudut membulat untuk efek modern
      boxShadow="lg" // Bayangan untuk efek kedalaman
    >
      {/* Textarea untuk menulis postingan */}
      <Textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="What's on your mind?"
        size="lg"
        mb={4}
        resize="none" // Menonaktifkan resize pada Textarea
        borderRadius="md" // Sudut membulat pada Textarea
        _focus={{ borderColor: "teal.500" }} // Mengubah warna border saat fokus
      />

      {/* Button untuk memposting */}
      <Button
        onClick={handleAddPost} // Use the handleAddPost function
        colorScheme="teal"
        isDisabled={!newPost.trim()} // Disable tombol jika input kosong atau hanya berisi spasi
        w="full" // Membuat tombol memiliki lebar penuh sesuai Box
        borderRadius="md" // Sudut membulat pada tombol
        _hover={{ bg: "teal.600" }} // Mengubah warna latar belakang saat hover
        _active={{ bg: "teal.700" }} // Mengubah warna latar belakang saat tombol ditekan
        _focus={{ boxShadow: "outline" }} // Menambahkan efek fokus pada tombol
      >
        {isSubmitting ? <Spinner size="sm" /> : "Post"} {/* Show spinner when submitting */}
      </Button>
    </Box>
  );
};

export default PostForm;
