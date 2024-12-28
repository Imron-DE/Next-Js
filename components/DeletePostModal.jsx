import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text } from "@chakra-ui/react";

const DeletePostModal = ({ isOpen, onClose, deletePost, postToDelete }) => (
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
          onClick={() => {
            deletePost(postToDelete);
            onClose();
          }}
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

export default DeletePostModal;
