import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Text, Spinner, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@chakra-ui/react";
import usePost from "@/hooks/usePost";
import useReplies from "@/hooks/useReplies"; // Import hooks untuk komentar
import PostForm from "@/components/PostForm";
import PostCard from "@/components/PostCard";
import EditPostModal from "@/components/EditPostModal";
import DeletePostModal from "@/components/DeletePostModal";
import Layout from "@/components/Layouts";

const Beranda = () => {
  const router = useRouter();
  const { postsList, newPost, setNewPost, addPost, editingPostId, setEditingPostId, editedPost, setEditedPost, updatePost, isLoading, error, postToDelete, setPostToDelete, handleLikePost, handleUnlikePost, deletePost } = usePost();

  // Logika untuk komentar
  const [activePostId, setActivePostId] = useState(null);
  const [isRepliesModalOpen, setRepliesModalOpen] = useState(false);

  const { repliesList, repliesCount, isLoading: isRepliesLoading, error: repliesError, payload, createReply, deleteReply, setPayload } = useReplies(activePostId);

  const toggleLike = (post) => {
    if (post.is_like_post) {
      handleUnlikePost(post.id);
    } else {
      handleLikePost(post.id);
    }
  };

  const openRepliesModal = (postId) => {
    setActivePostId(postId); // Set active postId saat membuka modal
    setRepliesModalOpen(true);
  };

  const closeRepliesModal = () => {
    setRepliesModalOpen(false);
    setActivePostId(null); // Reset activePostId ketika modal ditutup
  };

  const handleAddReply = async () => {
    await createReply(); // Menambahkan komentar
  };

  const navigateToProfile = (userId) => {
    router.push(`/profile/${userId}`);
  };

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Layout>
      <Box
        maxW="800px" // Lebar maksimum untuk Box
        mt={0} // Margin untuk memberikan ruang di sekitar Box
        p={6} // Padding untuk memberikan ruang di dalam Box
        mx="auto" // Mengatur margin kiri dan kanan otomatis untuk memusatkan Box
        borderWidth={1} // Border tipis untuk Box
        borderRadius="md" // Sudut membulat untuk tampilan modern
        boxShadow="lg" // Menambahkan bayangan untuk efek kedalaman
      >
        {/* Form to add a new post */}
        <PostForm newPost={newPost} setNewPost={setNewPost} addPost={addPost} />

        {/* List of Posts */}
        {postsList.length === 0 ? (
          <Box textAlign="center" mt="10">
            <Text color="gray.500">No posts available</Text>
          </Box>
        ) : (
          postsList.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              toggleLike={toggleLike}
              onEditOpen={() => {
                setEditingPostId(post.id);
                setEditedPost(post.description);
              }}
              onDeleteOpen={() => setPostToDelete(post.id)}
              onCommentsOpen={() => openRepliesModal(post.id)} // Menangani klik komentar
              setPostToDelete={setPostToDelete}
              onUserClick={navigateToProfile}
            />
          ))
        )}

        {/* Edit Post Modal */}
        <EditPostModal isOpen={!!editingPostId} onClose={() => setEditingPostId(null)} editedPost={editedPost} setEditedPost={setEditedPost} updatePost={updatePost} editingPostId={editingPostId} />

        {/* Delete Post Modal */}
        <DeletePostModal isOpen={!!postToDelete} onClose={() => setPostToDelete(null)} deletePost={deletePost} postToDelete={postToDelete} />

        {/* Comments Modal */}
        <Modal isOpen={isRepliesModalOpen} onClose={closeRepliesModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Komentar</ModalHeader>
            <ModalBody>
              {isRepliesLoading ? (
                <Spinner size="lg" />
              ) : repliesError ? (
                <Text color="red.500">{repliesError}</Text>
              ) : (
                <>
                  {repliesList.length === 0 ? (
                    <Text color="gray.500">Belum ada komentar.</Text>
                  ) : (
                    repliesList.map((reply) => (
                      <Box key={reply.id} mb={4} p={3} border="1px solid #ddd" borderRadius="md">
                        <Text fontSize="sm" color="blue.500">
                          {reply.user.username}
                        </Text>
                        <Text>{reply.text}</Text>
                        <Button size="sm" colorScheme="red" mt={2} onClick={() => deleteReply(reply.id)}>
                          Hapus
                        </Button>
                      </Box>
                    ))
                  )}
                </>
              )}
              <Input placeholder="Tambah komentar..." value={payload.text} onChange={(e) => setPayload((prev) => ({ ...prev, text: e.target.value }))} mt={4} />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleAddReply}>
                Tambahkan
              </Button>
              <Button ml={2} onClick={closeRepliesModal}>
                Tutup
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
};

export default Beranda;
