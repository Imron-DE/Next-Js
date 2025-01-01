import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router"; // Import useRouter

const usePost = (type = "all") => {
  const [postsList, setPostsList] = useState([]);
  const [myPostsList, setMyPostsList] = useState([]); // State for user's posts
  const [newPost, setNewPost] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPost, setEditedPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDataById, setUserDataById] = useState(null); // Data pengguna berdasarkan ID
  const [userPostsList, setUserPostsList] = useState([]);
  const router = useRouter();
  const { id } = router.query; // Ambil id dari URL parameter

  // Fetch all posts Berdasarkan type (all, my)
  const fetchPosts = useCallback(async ({ type, refetch = false }) => {
    if (!refetch) {
      setIsLoading(true);
    }

    const token = Cookies.get("user_token");
    if (token) {
      try {
        const url = `https://service.pace-unv.cloud/api/posts?type=${type || "all"}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const postsData = await res.json();
        if (res.ok) {
          if (type === "all") {
            setPostsList(postsData.data);
          } else {
            setMyPostsList(postsData.data);
          }
        } else {
          console.error("Error fetching posts:", postsData);
          setError("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Error fetching posts");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts({ type });
  }, [type, fetchPosts]);

  // Fetch user data (me)
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const token = Cookies.get("user_token");
      if (token) {
        try {
          const res = await fetch("https://service.pace-unv.cloud/api/user/me/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = await res.json();
          if (res.ok) {
            setUserData(userData.data); // Set the user data
          } else {
            console.error("Error fetching user data:", userData);
            setError("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Error fetching user data");
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const addPost = async () => {
    if (!newPost.trim()) return;
    const token = Cookies.get("user_token");
    try {
      const res = await fetch("https://service.pace-unv.cloud/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: newPost }),
      });

      const postData = await res.json();
      if (res.ok) {
        // Memperbarui postsList dan myPostsList dengan post baru
        setPostsList((prevPosts) => [postData.data, ...prevPosts]);
        setMyPostsList((prevPosts) => [postData.data, ...prevPosts]);
        setNewPost(""); // Reset input
      } else {
        console.error("Error adding post:", postData);
      }
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const updatePost = async () => {
    if (!editedPost.trim()) return;
    const token = Cookies.get("user_token");
    try {
      const res = await fetch(`https://service.pace-unv.cloud/api/post/update/${editingPostId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: editedPost }),
      });

      const updatedPost = await res.json();
      if (res.ok) {
        // Memperbarui postsList dan myPostsList dengan post yang telah diupdate
        setPostsList((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.data.id ? { ...post, description: updatedPost.data.description } : post)));
        setMyPostsList((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.data.id ? { ...post, description: updatedPost.data.description } : post)));
        setEditingPostId(null);
        setEditedPost(""); // Reset edit state
      } else {
        console.error("Error updating post:", updatedPost);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const deletePost = async () => {
    const token = Cookies.get("user_token");
    try {
      const res = await fetch(`https://service.pace-unv.cloud/api/post/delete/${postToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Menghapus post dari postsList
        setPostsList((prevPosts) => prevPosts.filter((post) => post.id !== postToDelete));

        // Menghapus post dari myPostsList
        setMyPostsList((prevPosts) => prevPosts.filter((post) => post.id !== postToDelete));
      } else {
        console.error("Error deleting post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLikePost = async (postId) => {
    const token = Cookies.get("user_token");
    try {
      const res = await fetch(`https://service.pace-unv.cloud/api/likes/post/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchPosts({ type: type, refetch: true });
      } else {
        console.error("Error liking post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlikePost = async (postId) => {
    const token = Cookies.get("user_token");
    try {
      const res = await fetch(`https://service.pace-unv.cloud/api/unlikes/post/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchPosts({ type: type, refetch: true });
      } else {
        console.error("Error unliking post");
      }
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  useEffect(() => {
    const fetchUserDataById = async () => {
      if (id) {
        setIsLoading(true);
        const token = Cookies.get("user_token");
        if (token) {
          try {
            const res = await fetch(`https://service.pace-unv.cloud/api/user/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const data = await res.json();
            if (res.ok) {
              setUserDataById(data.data);
            } else {
              setError("Gagal mengambil data pengguna");
            }
          } catch (error) {
            setError("Terjadi kesalahan saat mengambil data pengguna");
          }
        }
        setIsLoading(false);
      }
    };

    fetchUserDataById();
  }, [id]);

  // Ambil daftar postingan pengguna berdasarkan ID
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (id) {
        // Pastikan ID ada
        setIsLoading(true); // Indikator loading
        const token = Cookies.get("user_token"); // Ambil token dari cookies
        if (token) {
          try {
            // Tambahkan parameter id ke URL
            const res = await fetch(`https://service.pace-unv.cloud/api/posts/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const postsData = await res.json(); // Parsing hasil fetch

            if (res.ok) {
              setUserPostsList(postsData.data); // Update state dengan data postingan
            } else {
              setError("Gagal mengambil postingan pengguna"); // Tangani error dari server
            }
          } catch (error) {
            setError("Terjadi kesalahan saat mengambil postingan pengguna"); // Tangani error network
          }
        }
        setIsLoading(false); // Selesai loading
      }
    };

    fetchUserPosts(); // Panggil fungsi
  }, [id]); // Jalankan ulang jika id berubah

  return {
    postsList,
    myPostsList, // Return user's posts list
    setPostsList,
    setMyPostsList,
    newPost,
    setNewPost,
    addPost,
    editingPostId,
    setEditingPostId,
    editedPost,
    setEditedPost,
    updatePost,
    isLoading,
    error,
    postToDelete,
    setPostToDelete,
    handleLikePost,
    handleUnlikePost,
    deletePost,
    userData,
    userDataById,
    userPostsList,
    fetchPosts,
  };
};

export default usePost;
