import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Textarea } from "@chakra-ui/react";

const EditPostModal = ({ isOpen, onClose, editedPost, setEditedPost, updatePost, editingPostId }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Edit Post</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Textarea value={editedPost} onChange={(e) => setEditedPost(e.target.value)} placeholder="Edit your post" size="lg" />
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="blue"
          mr={3}
          onClick={() => {
            updatePost(editingPostId, editedPost);
            onClose();
          }}
        >
          Save
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default EditPostModal;
