import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router"; // Import useRouter

const usePost = () => {
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

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const token = Cookies.get("user_token");
      if (token) {
        try {
          const res = await fetch("https://service.pace-unv.cloud/api/posts?type=all", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const postsData = await res.json();
          if (res.ok) {
            setPostsList(postsData.data);
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
    };

    fetchPosts();
  }, []);

  // Fetch user's posts
  useEffect(() => {
    const fetchMyPosts = async () => {
      setIsLoading(true);
      const token = Cookies.get("user_token");
      if (token) {
        try {
          const res = await fetch("https://service.pace-unv.cloud/api/posts?type=me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const postsData = await res.json();
          if (res.ok) {
            setMyPostsList(postsData.data);
          } else {
            console.error("Error fetching user posts:", postsData);
            setError("Failed to fetch your posts");
          }
        } catch (error) {
          console.error("Error fetching user posts:", error);
          setError("Error fetching your posts");
        }
      }
      setIsLoading(false);
    };

    fetchMyPosts();
  }, []);

  // Fetch user data (me)
  useEffect(() => {
    const fetchUserData = async () => {
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
        setPostsList([postData.data, ...postsList]);
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
        setPostsList((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.data.id ? { ...post, description: updatedPost.data.description } : post)));
        setEditingPostId(null);
        setEditedPost("");
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
        setPostsList((prevPosts) => prevPosts.filter((post) => post.id !== postToDelete));
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
        setPostsList((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  is_like_post: true, // Menandakan post telah disukai
                  likes_count: post.likes_count + 1, // Menambah jumlah like
                }
              : post
          )
        );
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
        setPostsList((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  is_like_post: false, // Menandakan post tidak disukai
                  likes_count: post.likes_count - 1, // Mengurangi jumlah like
                }
              : post
          )
        );
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
  };
};

export default usePost;
