import React from "react";
import useNotifications from "@/hooks/useNotification";
import Layout from "@/components/Layouts";
import { Box, Text, Card, CardHeader, CardBody, CardFooter, Divider, Grid } from "@chakra-ui/react";

const Notifications = () => {
  const { notifications, isLoading, error } = useNotifications();

  // Menampilkan loading state saat data sedang diambil
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Menampilkan error jika ada
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Menampilkan daftar notifikasi
  return (
    <Layout>
      <Box p={4}>
        {/* Menyusun teks "Notifications" di tengah */}
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Notifications
        </Text>

        {/* Menampilkan notifikasi jika tersedia */}
        {notifications?.length === 0 ? (
          <Text textAlign="center">No notifications available</Text>
        ) : (
          <Grid
            columns={{ base: 1, md: 2, lg: 3 }} // Menyusun card dalam grid dengan jumlah kolom dinamis
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
                height="auto" // Kartu menyesuaikan dengan kontennya
                width="100%" // Pastikan kartu menyesuaikan dengan lebar kolom
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
