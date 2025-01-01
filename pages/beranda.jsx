import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Text, Spinner, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useToast } from "@chakra-ui/react";
import usePost from "@/hooks/usePost";
import useReplies from "@/hooks/useReplies"; // Import hooks untuk komentar
import PostForm from "@/components/PostForm";
import PostCard from "@/components/PostCard";
import EditPostModal from "@/components/EditPostModal";
import DeletePostModal from "@/components/DeletePostModal";

const Beranda = () => {
  const router = useRouter();
  const toast = useToast(); // Menggunakan useToast
  const { postsList, setPostsList, newPost, setNewPost, addPost, editingPostId, setEditingPostId, editedPost, setEditedPost, updatePost, isLoading, error, postToDelete, setPostToDelete, handleLikePost, handleUnlikePost, deletePost } =
    usePost("all");

  // Logika untuk komentar
  const [activePostId, setActivePostId] = useState(null);
  const [isRepliesModalOpen, setRepliesModalOpen] = useState(false);

  const { repliesList, repliesCount, isLoading: isRepliesLoading, error: repliesError, setError, createReply, deleteReply, setReplyText, replyText, fetchReplies } = useReplies("all");

  // Format tanggal dengan validasi
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Tanggal Tidak Valid" : date.toLocaleString();
  };

  // Fungsi untuk toggle like
  const toggleLike = (post) => {
    if (post.is_like_post) {
      handleUnlikePost(post.id);
    } else {
      handleLikePost(post.id);
    }
  };

  // Fungsi membuka modal balasan
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

  let loggedInUserId = null;
  if (typeof window !== "undefined") {
    loggedInUserId = localStorage.getItem("user_id");
  }

  const isOwnPost = (post) => post.user_id === loggedInUserId;

  // Menambahkan balasan
  const handleAddReply = async () => {
    if (!replyText.trim()) {
      setError("Balasan tidak boleh kosong.");
      return;
    }

    if (activePostId) {
      try {
        await createReply(activePostId, replyText);
        setReplyText(""); // Bersihkan setelah berhasil
        await fetchReplies(activePostId);
        toast({
          title: "Balasan berhasil ditambahkan.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Gagal menambahkan balasan.",
          description: error.message || "Coba lagi nanti.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } else {
      setError("postId tidak ditemukan.");
    }
  };

  // Fungsi untuk menavigasi ke halaman profil pengguna
  const navigateToProfile = (userId) => {
    // Menavigasi ke halaman profil pengguna dengan username yang diklik
    router.push(`/${userId}`);
  };

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
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
      {/* Form untuk menambah post */}
      <PostForm newPost={newPost} setNewPost={setNewPost} addPost={addPost} />

      {/* Daftar Post */}
      {postsList.length === 0 ? (
        <Box textAlign="center" mt="10">
          <Text color="gray.500">Belum ada postingan.</Text>
          <Button mt={4} colorScheme="teal" onClick={() => setNewPost({})}>
            Tambah Postingan
          </Button>
        </Box>
      ) : (
        postsList.map((post) => (
          <PostCard
            key={post.id}
            isOwnPost={isOwnPost(post)}
            post={post}
            toggleLike={toggleLike}
            onEditOpen={() => {
              setEditingPostId(post.id);
              setEditedPost(post.description);
            }}
            onDeleteOpen={() => setPostToDelete(post.id)}
            onCommentsOpen={() => openRepliesModal(post.id)}
            setPostToDelete={setPostToDelete}
            onUserClick={navigateToProfile}
          />
        ))
      )}

      {/* Modal Edit Post */}
      <EditPostModal isOpen={!!editingPostId} onClose={() => setEditingPostId(null)} editedPost={editedPost} setEditedPost={setEditedPost} updatePost={updatePost} editingPostId={editingPostId} />

      {/* Modal Hapus Post */}
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
  );
};

export default Beranda;
