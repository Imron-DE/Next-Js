import { Box, Button, Flex, Avatar, Text, IconButton, useDisclosure, Spinner, useToast, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaShare, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/router";

const PostCard = ({ post, toggleLike, onEditOpen, onDeleteOpen, setPostToDelete, onCommentsOpen }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
  const [comments, setComments] = useState(post.comments || []); // Comments list for the post
  const router = useRouter(); // Access router
  const { id } = router.query; // Mendapatkan ID pengguna yang aktif pada URL
  const toast = useToast(); // Toast notification
  const [isLikeLoading, setIsLikeLoading] = useState(false); // State for loading like action
  const [isDeleteLoading, setIsDeleteLoading] = useState(false); // State for loading delete action

  const navigateToProfile = (userId) => {
    // Menavigasi ke halaman profil pengguna dengan userId yang diklik
    router.push(`/profile/${userId}`);
  };

  const handleLike = async () => {
    setIsLikeLoading(true);
    try {
      await toggleLike(post); // Call the toggleLike function passed as a prop
      toast({
        title: post.is_like_post ? "Unliked" : "Liked",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "There was an issue with liking this post.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await setPostToDelete(post.id); // Set the post to delete
      await onDeleteOpen(); // Open delete modal (assuming this triggers a delete action in the parent component)
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "There was an issue deleting this post.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Box
      mb={4} // Margin bottom
      p={6} // Increased padding (1.5rem = 24px)
      borderRadius="lg" // Larger rounded corners
      boxShadow="xl" // Larger shadow
      bg="white.100" // Gray background
      width="100%" // Full width of the container
      maxW="700px" // Maximum width (adjust as needed)
      mx="auto"
      shadow={"lg"}
    >
      <Flex align="center" mb={4}>
        <Avatar name={post.user.name} src={`https://api.adorable.io/avatars/150/${post.user.email}.png`} />
        <Box ml={4}>
          {/* Disable link if the username is the same as the active username */}
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={post.user.id === id ? "gray.500" : "blue.500"}
            _hover={{ textDecoration: post.user.id === id ? "none" : "underline" }}
            onClick={() => post.user.id !== id && navigateToProfile(post.user.id)} // Navigate to profile only if it's not the current user's profile
            cursor={post.user.id === id ? "not-allowed" : "pointer"}
          >
            {post.user.name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {new Date(post.created_at).toLocaleString()}
          </Text>
        </Box>
      </Flex>

      <Text fontSize="xl" mb={4}>
        {post.description}
      </Text>
      {/* Increased font size for post description */}

      <Flex align="center" mb={4} position="relative">
        {/* Like Button */}
        <Button
          leftIcon={post.is_like_post ? <FaThumbsDown /> : <FaThumbsUp />}
          onClick={handleLike}
          colorScheme={post.is_like_post ? "red" : "blue"}
          variant="outline"
          size="sm"
          aria-label={post.is_like_post ? "Unlike" : "Like"}
          mr={2}
          isLoading={isLikeLoading}
        >
          {isLikeLoading ? <Spinner size="sm" /> : post.is_like_post ? "Unlike" : "Like"}
        </Button>
        <Text ml={2}>{Number(post.likes_count) || 0} Likes</Text>

        {/* Comment Button */}
        <IconButton icon={<FaComment />} onClick={onCommentsOpen} colorScheme="green" aria-label="Comment" ml={4} />
        <Text ml={2}>{post.replies_count} Comments</Text>

        {/* Share Button */}
        <IconButton icon={<FaShare />} onClick={() => alert("Share functionality is not implemented yet")} colorScheme="yellow" aria-label="Share" ml={4} />

        {/* Menu Button with Ellipsis Icon at the Top Right */}
        <Box position="absolute" top={0} right={0}>
          <Menu>
            <MenuButton as={IconButton} icon={<FaEllipsisV />} colorScheme="gray" aria-label="Post Options" />
            <MenuList>
              <MenuItem onClick={onEditOpen} color="blue.500">
                Edit
              </MenuItem>
              <MenuItem onClick={handleDelete} color="red.500" isLoading={isDeleteLoading} loadingText="Deleting">
                {isDeleteLoading ? <Spinner size="sm" /> : "Delete"}
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default PostCard;
