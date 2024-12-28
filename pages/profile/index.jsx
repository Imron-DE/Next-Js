import { Box, Text, Spinner, VStack, Card, CardBody, Heading, Stack, Divider, Avatar, Button } from "@chakra-ui/react";
import usePost from "@/hooks/usePost";
import useReplies from "@/hooks/useReplies"; // Pastikan path ini benar
import PostForm from "@/components/PostForm";
import PostCard from "@/components/PostCard";
import EditPostModal from "@/components/EditPostModal";
import DeletePostModal from "@/components/DeletePostModal";
import Layout from "@/components/Layouts";

const Profile = () => {
  const { userData, myPostsList, newPost, setNewPost, addPost, editingPostId, setEditingPostId, editedPost, setEditedPost, updatePost, isLoading, error, postToDelete, setPostToDelete, handleLikePost, handleUnlikePost, deletePost } =
    usePost();

  const { replyText, setReplyText, createReply, deleteReply } = useReplies();

  const toggleLike = (post) => {
    if (post.is_like_post) {
      handleUnlikePost(post.id);
    } else {
      handleLikePost(post.id);
    }
  };

  const handleAddComment = (postId) => {
    if (replyText.trim()) {
      createReply(postId);
      setReplyText(""); // Clear the input after submitting
    }
  };

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Layout>
      <Box maxW="container.xl" margin="10px" padding="10px" mx="auto" textAlign="center">
        {/* User Data Card */}
        {userData && (
          <Card mx="auto" mb="6" maxW="sm">
            <CardBody>
              <Heading size="md" mb="4">
                User Profile
              </Heading>
              <Stack direction="row" align="center" spacing="4" mb="4">
                <Avatar name={userData.name || "No Name"} />
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
                setPostToDelete={setPostToDelete}
                handleAddComment={handleAddComment} // Handle adding comment directly
                replyText={replyText} // Manage reply text
                setReplyText={setReplyText} // Allow setting reply text
                createReply={createReply} // Create reply function
                deleteReply={deleteReply} // Delete reply function
              />
            );
          })
        )}

        {/* Edit and Delete Modals */}
        <EditPostModal isOpen={!!editingPostId} onClose={() => setEditingPostId(null)} editedPost={editedPost} setEditedPost={setEditedPost} updatePost={updatePost} editingPostId={editingPostId} />

        <DeletePostModal isOpen={!!postToDelete} onClose={() => setPostToDelete(null)} deletePost={deletePost} postToDelete={postToDelete} />
      </Box>
    </Layout>
  );
};

export default Profile;
