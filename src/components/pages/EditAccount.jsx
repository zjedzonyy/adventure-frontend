import { AuthContext } from "../auth/index.js";
import { Navbar, Footer } from "../layout/index.js";
import {
  PendingFollowRequests,
  SentFollowRequests,
  Followers,
  Followings,
} from "../socials/index.js";
import { useContext, useState } from "react";
import { apiUrl } from "../../utils/index.js";
import { supabase } from "../../../config/supabase.js";

export default function EditAccount() {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Wybierz plik");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiUrl}/users/avatars`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {},
      });

      if (!res.ok) throw new Error("Couldn't upload");

      const data = await res.json();
      setMessage(data.message || "Uploaded!");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await fetch(`${apiUrl}/users/avatars`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Couldn't delete");
      const data = await res.json();
      setMessage(data.message || "Deleted!");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
      <Navbar />
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Update avatar</button>
          <p>{message}</p>
        </div>
        <button onClick={handleDeleteAvatar}>Delete avatar</button>
      </div>
      <Footer />
    </div>
  );
}
