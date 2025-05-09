import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import {
  useLoginMutation,
  useSignupMutation,
} from "../../redux/api/privateQuery";
import { message } from "antd";
import { setAccessToken } from "../../utils/token";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [
    login,
    { isLoading: loginLoading, error: loginError, isSuccess: loginSuccess },
  ] = useLoginMutation();
  const [
    signup,
    { isLoading: signupLoading, error: signupError, isSuccess: signupSuccess },
  ] = useSignupMutation();

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        const res = await login(data).unwrap();
        message.success("Login successful");
        setAccessToken(res.accessToken);
      } else {
        await signup(data).unwrap();
        const res = await login({
          email: data.email,
          password: data.password,
        }).unwrap();
        message.success("Signup successful");
        setAccessToken(res.accessToken);
      }
      window.location.reload();
    } catch (err) {
      message.error(
        err?.data?.message || "An error occurred. Please try again.",
      );
      console.error("Error:", err);
    }
  };

  return (
    <div className="w-full rounded bg-white md:w-[400px]">
      <h2 className="mb-6 text-center text-2xl font-bold text-orange-600">
        {isLogin ? "🔐 Sign In to Continue" : "📝 Create Your Account"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {!isLogin && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full rounded-md border px-4 py-2 focus:outline-none"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full rounded-md border px-4 py-2 focus:outline-none"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10,14}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                className="w-full rounded-md border px-4 py-2 focus:outline-none"
                placeholder="01XXXXXXXXX"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                {...register("address", { required: "Address is required" })}
                className="w-full rounded-md border px-4 py-2 focus:outline-none"
                placeholder="Your Address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
          </>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              className="w-full rounded-md border px-4 py-2 pr-10 focus:outline-none"
              placeholder="Enter password"
            />
            <div
              className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loginLoading || signupLoading}
          className="flex w-full justify-center rounded-md bg-orange-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-orange-700"
        >
          {loginLoading || signupLoading ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : isLogin ? (
            "Login"
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          onClick={() => {
            setIsLogin(!isLogin);
            setShowPassword(false);
            reset();
          }}
          className="cursor-pointer font-semibold text-orange-600 hover:underline"
        >
          {isLogin ? "Sign up" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
