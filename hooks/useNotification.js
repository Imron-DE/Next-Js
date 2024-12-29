import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil semua notifikasi
  const fetchNotifications = async () => {
    const token = Cookies.get("user_token");
    if (!token) {
      setError("User not logged in");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://service.pace-unv.cloud/api/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data); // Pastikan data yang diterima adalah data.data
        console.log(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch notifications");
      }
    } catch (err) {
      setError("An error occurred while fetching notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    isLoading,
    error,
  };
};

export default useNotifications;
