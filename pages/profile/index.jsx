import { Box, Text, Spinner, VStack, Card, CardBody, Heading, Stack, Divider, Avatar, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@chakra-ui/react";
import usePost from "@/hooks/usePost";
import useReplies from "@/hooks/useReplies"; // Pastikan path ini benar
import PostForm from "@/components/PostForm";
import PostCard from "@/components/PostCard";
import EditPostModal from "@/components/EditPostModal";
import DeletePostModal from "@/components/DeletePostModal";
import Layout from "@/components/Layouts";
import { useState } from "react";

const Profile = () => {
  const { userData, myPostsList, newPost, setNewPost, addPost, editingPostId, setEditingPostId, editedPost, setEditedPost, updatePost, isLoading, error, postToDelete, setPostToDelete, handleLikePost, handleUnlikePost, deletePost } =
    usePost("me");

  // Logika untuk komentar
  const [activePostId, setActivePostId] = useState(null);
  const [isRepliesModalOpen, setRepliesModalOpen] = useState(false);

  const { repliesList, repliesCount, isLoading: isRepliesLoading, error: repliesError, setError, createReply, deleteReply, setReplyText, replyText, fetchReplies } = useReplies();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Tanggal Tidak Valid" : date.toLocaleString();
  };

  const toggleLike = (post) => {
    if (post.is_like_post) {
      handleUnlikePost(post.id);
    } else {
      handleLikePost(post.id);
    }
  };

  const openRepliesModal = (postId) => {
    setActivePostId(postId); // Set active postId saat membuka modal
    fetchReplies(postId);
    setRepliesModalOpen(true);
  };

  // Fungsi menutup modal balasan
  const closeRepliesModal = () => {
    setRepliesModalOpen(false);
    setActivePostId(null); // Reset activePostId ketika modal ditutup
  };

  // Menambahkan balasan
  const handleAddReply = async () => {
    if (!replyText.trim()) {
      setError("Balasan tidak boleh kosong.");
      return;
    }

    if (activePostId) {
      await createReply(activePostId);
      setReplyText(""); // Bersihkan setelah berhasil
    } else {
      setError("postId tidak ditemukan.");
    }
  };

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Layout>
      <Box
        w="80%"
        mt={10}
        p={6}
        mx="auto"
        borderWidth={1}
        borderRadius="md"
        boxShadow="lg"
        marginTop={-4}
        marginBottom={-4}
        maxH="755px" // Tinggi maksimal elemen
        maxW="auto"
        overflowY="auto"
      >
        {/* User Data Card */}
        {userData && (
          <Card mx="auto" mb="6" maxW="lg">
            <CardBody>
              <Heading size="md" mb="4" textAlign="center">
                User Profile
              </Heading>
              <Stack direction="row" align="center" spacing="4" mb="4">
                <Avatar name={userData.name || "No Name"} width={"100px"} height={"100px"} />
                <Text fontSize="xl" fontWeight="bold">
                  {userData.name || "Anonymous"}
                </Text>
              </Stack>
              <VStack align="start" spacing={2}>
                <Text>
                  <strong>Email:</strong> {userData.email || "N/A"}
                </Text>
                <Text>
                  <strong>Date of Birth:</strong> {userData.dob || "N/A"}
                </Text>
                <Text>
                  <strong>Phone:</strong> {userData.phone || "N/A"}
                </Text>
                <Text>
                  <strong>Hobby:</strong> {userData.hobby || "N/A"}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Post Form */}
        <PostForm newPost={newPost} setNewPost={setNewPost} addPost={addPost} />

        {/* User's Posts */}
        {myPostsList.length === 0 ? (
          <Box textAlign="center" mt="10">
            <Text color="gray.500">No posts available</Text>
          </Box>
        ) : (
          myPostsList.map((post) => {
            return (
              <PostCard
                key={post.id}
                post={post}
                toggleLike={toggleLike}
                onEditOpen={() => {
                  setEditingPostId(post.id);
                  setEditedPost(post.description);
                }}
                onDeleteOpen={() => setPostToDelete(post.id)}
                onCommentsOpen={() => openRepliesModal(post.id)}
                setPostToDelete={setPostToDelete}
              />
            );
          })
        )}

        {/* Edit and Delete Modals */}
        <EditPostModal isOpen={!!editingPostId} onClose={() => setEditingPostId(null)} editedPost={editedPost} setEditedPost={setEditedPost} updatePost={updatePost} editingPostId={editingPostId} />

        <DeletePostModal isOpen={!!postToDelete} onClose={() => setPostToDelete(null)} deletePost={deletePost} postToDelete={postToDelete} />

        {/* Modal Komentar */}
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
                      <Box key={reply.id} mb={4} p={3} border="1px solid #ddd" borderRadius="md" backgroundColor="gray.50">
                        <Text key={`name-${reply.id}`} fontSize="sm" color="blue.500" fontWeight="bold">
                          {reply.user?.name}
                        </Text>
                        <Text key={`date-${reply.id}`} fontSize="sm" color="gray.500">
                          {formatDate(reply.created_at)}
                        </Text>
                        <Text key={`description-${reply.id}`} mt={1}>
                          {reply.description}
                        </Text>
                        <Button size="sm" colorScheme="red" mt={2} onClick={() => deleteReply(reply.id)} aria-label="Hapus balasan">
                          Hapus
                        </Button>
                      </Box>
                    ))
                  )}
                </>
              )}
              <Input placeholder="Tambah komentar..." value={replyText} onChange={(e) => setReplyText(e.target.value)} mt={4} />
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

export default Profile;
