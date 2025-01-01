import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import usePost from "@/hooks/usePost";

const useReplies = () => {
  const router = useRouter();
  const { postId: queryPostId } = router.query;
  const [postId, setPostId] = useState(null);
  const [repliesList, setRepliesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { fetchPosts } = usePost();

  // Menyimpan postId dalam state jika queryPostId sudah tersedia
  useEffect(() => {
    if (queryPostId) {
      setPostId(queryPostId);
    }
  }, [queryPostId]);

  // Pastikan fetchReplies hanya dipanggil setelah postId tersedia
  useEffect(() => {
    if (postId) {
      fetchReplies(postId);
    }
  }, [postId]);

  // Update repliesCount berdasarkan panjang repliesList
  const repliesCount = repliesList.length;

  // Fungsi untuk mengambil balasan
  const fetchReplies = async (postId) => {
    if (!postId) {
      setError("postId tidak tersedia.");
      return;
    }

    setIsLoading(true);
    const token = Cookies.get("user_token");
    if (!token) {
      setError("Pengguna belum login.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://service.pace-unv.cloud/api/replies/post/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRepliesList(data.data || []);
        setError(null); // Reset error jika berhasil
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Gagal mengambil balasan.");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat mengambil balasan.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk membuat balasan
  const createReply = async (postId) => {
    if (!postId) {
      setError("postId tidak ada.");
      return;
    }

    if (!replyText.trim()) {
      setError("Balasan tidak boleh kosong.");
      return;
    }

    const token = Cookies.get("user_token");

    if (!token) {
      setError("Pengguna belum login.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`https://service.pace-unv.cloud/api/replies/post/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: replyText }),
      });

      if (res.ok) {
        const newReply = await res.json();
        setRepliesList((prevReplies) => [...prevReplies, newReply.data]);

        setError(null); // Reset error jika berhasil

        // Setelah berhasil menambahkan balasan, ambil ulang data posts
        fetchPosts();
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
      const res = await fetch(`https://service.pace-unv.cloud/api/replies/delete/${replyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setRepliesList((prevReplies) => prevReplies.filter((reply) => reply.id !== replyId));
        setError(null); // Reset error jika berhasil
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
    repliesList,
    isLoading,
    error,
    setError,
    createReply,
    fetchReplies,
    replyText,
    setReplyText,
    deleteReply,
    repliesCount,
  };
};

export default useReplies;
