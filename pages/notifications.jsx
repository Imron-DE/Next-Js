import React, { useEffect } from "react";
import useNotifications from "@/hooks/useNotification";
import Layout from "@/components/Layouts";
import { Box, Text, Card, CardHeader, CardBody, CardFooter, Divider, Grid, Spinner, useToast } from "@chakra-ui/react";

const Notifications = () => {
  const { notifications, isLoading, error } = useNotifications();
  const toast = useToast();

  // Display loading spinner while data is being fetched
  if (isLoading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  // Display error message if there's an error
  if (error) {
    toast({
      title: "Error fetching notifications.",
      description: `An error occurred: ${error}`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return (
      <Box p={4} textAlign="center">
        <Text fontSize="xl" color="red.500">
          Error: {error}
        </Text>
      </Box>
    );
  }

  // Display notifications if available
  return (
    <Layout>
      <Box p={4}>
        {/* Center-align "Notifications" text */}
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Notifications
        </Text>

        {/* Display "No notifications available" message if no notifications */}
        {notifications?.length === 0 ? (
          <Text textAlign="center">No notifications available</Text>
        ) : (
          <Grid
            columns={{ base: 1, md: 2, lg: 3 }} // Dynamic column layout
            spacing={4}
            justifyItems="center"
            maxWidth="1000px"
            margin="0 auto"
            overflowY="auto"
            paddingBottom={4}
            shadow="lg"
          >
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                borderRadius="md"
                boxShadow="md"
                p={4}
                mb={4}
                _hover={{ boxShadow: "lg" }}
                height="auto" // Cards adjust height based on content
                width="100%" // Ensure card fits within column width
              >
                <CardHeader>
                  <Text fontSize="xl" fontWeight="semibold">
                    {notification.user?.name || "Unknown User"}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {new Date(notification.created_at).toLocaleString()}
                  </Text>
                </CardHeader>
                <CardBody>
                  <Text fontSize="lg">
                    <strong>{notification.remark === "like" ? "Like" : "Reply"}</strong>
                  </Text>
                  <Text color="gray.600">
                    {notification.remark === "like" ? `${notification.user?.name} liked your post: "${notification.posts?.description}"` : `${notification.user?.name} replied to your post: "${notification.posts?.description}"`}
                  </Text>
                </CardBody>
                <CardFooter>
                  <Divider />
                </CardFooter>
              </Card>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default Notifications;
