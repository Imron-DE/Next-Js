import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode"; // Perbaikan import
import { useRouter } from "next/router";

const useReplies = () => {
  const router = useRouter();
  const { postId } = router.query; // Ambil postId dari URL query
  const [repliesCount, setRepliesCount] = useState(0);
  const [repliesList, setRepliesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [payload, setPayload] = useState({
    user_id: "",
    text: "",
  });

  useEffect(() => {
    if (!postId) {
      setError("Post ID tidak tersedia.");
      return; // Jangan panggil API jika postId tidak ada
    }

    const fetchReplies = async () => {
      setIsLoading(true);
      console.log("Fetching replies for postId:", postId);

      const token = Cookies.get("user_token");
      if (!token) {
        setError("Pengguna belum login.");
        setIsLoading(false);
        return;
      }

      try {
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.sub;
        console.log("User ID:", userId);

        setPayload((prevPayload) => ({
          ...prevPayload,
          user_id: userId,
        }));

        const res = await fetch(`https://service.pace-unv.cloud/api/replies/post/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Status Code:", res.status); // Log status code
        const data = await res.json();
        console.log("API Response Data:", data); // Menampilkan data respons

        if (data && data.data) {
          setRepliesList(data.data);
          setRepliesCount(data.count);
        } else {
          setError(data.message || "Gagal mengambil balasan.");
        }
      } catch (error) {
        setError("Terjadi kesalahan saat mendekode token atau mengambil balasan");
        console.error("Error fetching replies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReplies();
  }, [postId]); // Efek ini hanya dijalankan jika postId berubah

  console.log("Replies List:", repliesList);
  console.log("Replies Count:", repliesCount);
  console.log("postId:", postId);
  const createReply = async () => {
    if (!payload.text.trim()) {
      setError("Teks balasan tidak boleh kosong.");
      return;
    }

    const token = Cookies.get("user_token");
    if (!token) {
      setError("Pengguna belum login.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://service.pace-unv.cloud/api/replies/post/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newReply = await res.json();
        setRepliesList((prevReplies) => [...prevReplies, newReply]);
        setRepliesCount((prevCount) => prevCount + 1);
        setPayload((prevPayload) => ({ ...prevPayload, text: "" }));
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Gagal membuat balasan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat membuat balasan.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menghapus balasan
  const deleteReply = async (replyId) => {
    const token = Cookies.get("user_token");
    if (!token) {
      setError("Pengguna belum login.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://service.pace-unv.cloud/api/replies/${replyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Update replies list setelah menghapus
        setRepliesList((prevReplies) => prevReplies.filter((reply) => reply.id !== replyId));
        setRepliesCount((prevCount) => prevCount - 1);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Gagal menghapus balasan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus balasan.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    repliesCount,
    repliesList,
    isLoading,
    error,
    payload,
    createReply,
    deleteReply, // Return deleteReply
  };
};

export default useReplies;
