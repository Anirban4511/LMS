import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/features/api/authApi";


const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const result = await resetPassword({ token, newPassword });
      
      if (result.data?.success) {
        alert("Password updated successfully!");
        navigate("/login");
      } else {
        setMessage(result.error?.data?.message || "Error resetting password");
      }
    } catch (error) {
      setMessage("Error resetting password");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          placeholder="New Password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Confirm New Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;