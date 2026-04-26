import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [conPassword, setconPassword] = useState("");
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();

  const sendOTP = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/auth/sendOtp",
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        setStep(2);
        toast.success(response.data.message, "OTP sent to your email!");
      }

      console.log(response.data);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(
        error.response.data.message,
        "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/auth/verifyOtp",
        { email, otp },
        { withCredentials: true }
      );
      if (response.data.success) {
        setStep(3);
        toast.success(response.data.message, "OTP verified successfully!");
      }
      return response.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(
        error.response.data.message,
        "Failed to verify OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    try {

      if(newPassword!==conPassword){
        toast.error("Passwords do not match", "Please check and try again.");
        return;
      }

      if(!newPassword){
        toast.error("Password cannot be empty", "Please enter a new password.");
        return;
      }
      const response = await axiosInstance.post("/auth/resetPassword", {
        email,
        newPassword,
      }, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message, "Password reset successfully!");
      setLoading(false);
      navigate("/login");
          }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(
        error.response.data.message,
        "Failed to reset password. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F9F9F9]">
      {/* step1  */}

      {step == 1 && (
        <div className="bg-[#2B3B6D] shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Forget Your Password
          </h2>
          <form
            className="space-y-4  "
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-white text-sm font-medium mb-2"
              >
                Enter Your Email Address
              </label>
              <input
                id="email"
                className="mt-1 w-full px-4 py-2 border border-white rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[white] "
                type="text"
                placeholder="your@email.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button
              class="w-full bg-[#FBB03B] hover:bg-[#f5a732] text-white p-2 cursor-pointer rounded-md transform transition-transform duration-200 ease-in-out group hover:scale-105"
              disabled={loading}
              onClick={sendOTP}
            >
              {loading ? (
                <ClipLoader size={30} color="[#FBB03B]" />
              ) : (
                " Send OTP"
              )}
            </button>
          </form>
          <div
            className="text-sm text-center mt-4 text-white cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </div>
        </div>
      )}

      {/* step2  */}

      {step == 2 && (
        <div className="bg-[#2B3B6D] shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Enter OTP
          </h2>
          <form
            className="space-y-4  "
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div>
              <label
                htmlFor="otp"
                className="block text-white text-sm font-medium mb-2"
              >
                Please Wnter 4 digit code which is sent to your email
              </label>
              <input
                id="otp"
                className="mt-1 w-full px-4 py-2 border border-white rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[white] "
                type="text"
                placeholder="* * * *"
                required
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>
            <button
              class="w-full bg-[#FBB03B] hover:bg-[#f5a732] text-white p-2 cursor-pointer rounded-md transform transition-transform duration-200 ease-in-out group hover:scale-105"
              disabled={loading}
              onClick={verifyOTP}
            >
              {loading ? (
                <ClipLoader size={30} color="[#FBB03B]" />
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
          <div
            className="text-sm text-center mt-4 text-white cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </div>
        </div>
      )}

      {/* step3  */}

      {step == 3 && (
        <div className="bg-[#2B3B6D] shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Reset Your Password
          </h2>
          <p className="text-sm text-white text-center mb-6">
            Enter a new Passsword to regain access to your account{" "}
          </p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="password"
                className="block text-white text-sm font-medium mb-2"
              >
                New Password
              </label>
              <input
                id="password"
                className="mt-1 w-full px-4 py-2 border border-white rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[white] "
                type="text"
                placeholder="**********"
                required
                onChange={(e) => setnewPassword(e.target.value)}
                value={newPassword}
              />
            </div>

            <div>
              <label
                htmlFor="conpassword"
                className="block text-white text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                id="conpassword"
                className="mt-1 w-full px-4 py-2 border border-white rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[white] "
                type="text"
                placeholder="**********"
                required
                onChange={(e) => setconPassword(e.target.value)}
                value={conPassword}
              />
            </div>
            <button
              class="w-full bg-[#FBB03B] hover:bg-[#f5a732] text-white p-2 cursor-pointer rounded-md transform transition-transform duration-200 ease-in-out group hover:scale-105"
              onClick={resetPassword}
            >
              {loading ? <ClipLoader /> : "Reset Password"}
            </button>
          </form>
          <div
            className="text-sm text-center mt-4 text-white cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
