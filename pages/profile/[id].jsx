import { Box, Text, Spinner, VStack, Card, CardBody, Heading, Stack, Divider, Avatar } from "@chakra-ui/react";
import { useRouter } from "next/router";
import usePost from "@/hooks/usePost";
import Layout from "@/components/Layouts";
import PostCard from "@/components/PostCard";

const ProfileById = () => {
  const router = useRouter();
  const { id } = router.query; // Get the user ID from the URL query

  const { userDataById, userPostsList, isLoading, error, handleLikePost, handleUnlikePost } = usePost(id); // Pass the ID to the custom hook to fetch user-specific data

  // Function to toggle like state for a post
  const toggleLike = (post) => {
    if (post.is_like_post) {
      handleUnlikePost(post.id);
    } else {
      handleLikePost(post.id);
    }
  };

  if (isLoading) return <Spinner size="lg" />; // Show a loading spinner if data is loading
  if (error) return <Text color="red.500">{error}</Text>; // Show error message if there's an error

  return (
    <Layout>
      <Box maxW="800px" mt={10} p={6} mx="auto" borderWidth={1} borderRadius="md" boxShadow="lg">
        {/* User Data Card */}
        {userDataById && (
          <Card mx="auto" mb="6" maxW="sm">
            <CardBody>
              <Heading size="md" mb="4">
                User Profile
              </Heading>
              <Stack direction="row" align="center" spacing="4" mb="4">
                {/* Avatar and Name */}
                <Avatar name={userDataById.name || "No Name"} />

                <Text fontSize="xl" fontWeight="bold">
                  {userDataById.name || "Anonymous"}
                </Text>
              </Stack>
              <VStack align="start" spacing={2}>
                <Text>
                  <strong>Email:</strong> {userDataById.email || "N/A"}
                </Text>
                <Text>
                  <strong>Date of Birth:</strong> {userDataById.dob || "N/A"}
                </Text>
                <Text>
                  <strong>Phone:</strong> {userDataById.phone || "N/A"}
                </Text>
                <Text>
                  <strong>Hobby:</strong> {userDataById.hobby || "N/A"}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* User's Posts */}
        {userPostsList.length === 0 ? (
          <Box textAlign="center" mt="10">
            <Text color="gray.500">No posts available</Text>
          </Box>
        ) : (
          userPostsList.map((post) => <PostCard key={post.id} post={post} toggleLike={toggleLike} />)
        )}
      </Box>
    </Layout>
  );
};

export default ProfileById;
