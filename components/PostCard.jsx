import { Box, Button, Flex, Avatar, Text, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, FormControl, FormLabel, Textarea, useDisclosure, useToast } from "@chakra-ui/react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaShare, FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";

const PostCard = ({ post, toggleLike, onEditOpen, onDeleteOpen, setPostToDelete, onUserClick, onCommentsOpen }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [comments, setComments] = useState(post.comments || []); // Comments list for the post
  const [isCommentLoading, setIsCommentLoading] = useState(false); // For comment loading state
  const toast = useToast(); // For showing success/error messages

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
          <Text onClick={() => onUserClick(post.user.id)} fontSize="lg" fontWeight="bold" textAlign="left" _hover={{ textDecoration: "underline", cursor: "pointer", color: "green.500" }}>
            {post.user.name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {new Date(post.created_at).toLocaleString()}
          </Text>
        </Box>
        <br />
      </Flex>
      <Text fontSize="xl" mb={4}>
        {post.description}
      </Text>{" "}
      {/* Increased font size for post description */}
      <Flex align="center" mb={4}>
        <Button
          leftIcon={post.is_like_post ? <FaThumbsDown /> : <FaThumbsUp />}
          onClick={() => toggleLike(post)}
          colorScheme={post.is_like_post ? "red" : "blue"}
          variant="outline"
          size="sm"
          aria-label={post.is_like_post ? "Unlike" : "Like"}
          mr={2}
        >
          {post.is_like_post ? "Unlike" : "Like"}
        </Button>
        <Text ml={2}>{Number(post.likes_count) || 0} Likes</Text>

        <IconButton icon={<FaComment />} onClick={onCommentsOpen} colorScheme="green" aria-label="Comment" ml={4} />
        <Text ml={2}>{post.replies_count} Comments</Text>
        <IconButton icon={<FaShare />} onClick={() => alert("Share functionality is not implemented yet")} colorScheme="yellow" aria-label="Share" ml={4} />
        <IconButton icon={<FaEdit />} onClick={onEditOpen} colorScheme="blue" aria-label="Edit" ml={4} />
        <Button
          colorScheme="red"
          size="sm"
          ml="auto"
          onClick={() => {
            setPostToDelete(post.id);
            onDeleteOpen();
          }}
        >
          Delete
        </Button>
      </Flex>
    </Box>
  );
};

export default PostCard;
