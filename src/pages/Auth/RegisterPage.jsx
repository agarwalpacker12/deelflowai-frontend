import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  organization_name: yup.string().required("Organization name is required"),
  phone: yup
    .string()
    .matches(/^\+?[0-9]{7,15}$/, "Phone number is not valid")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      organization_name: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  // const onSubmit = async (data) => {
  //   setLoading(true);
  //   setServerError(null);
  //   try {
  //     await authAPI.register(data);
  //     navigate("/login");
  //   } catch (err) {
  //     setServerError(
  //       err.response?.data?.message || "Registration failed. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const onSubmit = async (data) => {
  console.log('Form data before sending:', data);
  
  setLoading(true);
  setServerError(null);
  try {
    const response = await authAPI.register(data);
    console.log('Registration response:', response);
    navigate("/login");
  } catch (err) {
    console.error('Registration error:', err);
    setServerError(
      err.response?.data?.message || "Registration failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                First Name
              </label>
              <input
                type="text"
                {...register("first_name")}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="First name"
                autoComplete="given-name"
              />
              {errors.first_name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Last Name
              </label>
              <input
                type="text"
                {...register("last_name")}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Last name"
                autoComplete="family-name"
              />
              {errors.last_name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              {...register("organization_name")}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Organization name"
              autoComplete="organization"
            />
            {errors.organization_name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.organization_name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Phone
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Phone number"
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 pr-10 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Enter your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                {...register("password_confirmation")}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 pr-10 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                onClick={() => setShowPasswordConfirm((prev) => !prev)}
              >
                {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
          {serverError && (
            <div className="text-red-400 text-sm text-center">
              {serverError}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-white/70 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
