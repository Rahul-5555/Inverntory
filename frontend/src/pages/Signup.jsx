import { useState } from "react";
import { apiRequest } from "../services/api";

const Signup = () => {
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/auth/signup", "POST", form);
      alert("Signup successful. Login now.");
      window.location.href = "/login";
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input placeholder="Shop Name" onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
      <input placeholder="Owner Name" onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button>Signup</button>
    </form>
  );
};

export default Signup;
