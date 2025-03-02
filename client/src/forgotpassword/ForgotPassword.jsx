import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/features/api/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async () => {
    const res = await forgotPassword({ email });
    if (res?.data?.success) {
      toast.success("Password reset link sent to your email");
    } else {
      toast.error(res?.error?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[400px] p-4 border rounded-md">
        <h2 className="text-lg font-bold mb-2">Forgot Password</h2>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <Button disabled={isLoading} onClick={handleSubmit} className="mt-2">
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
