import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text, Spinner, useToast } from "@chakra-ui/react";
import { useState } from "react";

const DeletePostModal = ({ isOpen, onClose, deletePost, postToDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false); // State to track the deletion process
  const toast = useToast(); // Toast notification

  const handleDeletePost = async () => {
    setIsDeleting(true); // Start deletion process
    try {
      await deletePost(postToDelete); // Call deletePost function to delete the post
      toast({
        title: "Post deleted.",
        description: "Your post was successfully deleted.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "There was an issue deleting your post.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false); // End deletion process
      onClose(); // Close modal after deletion
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to delete this post?</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={handleDeletePost} // Use handleDeletePost for the deletion
            isLoading={isDeleting} // Show spinner while deleting
            loadingText="Deleting..."
          >
            Delete
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeletePostModal;
