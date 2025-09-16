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
  phone: yup
    .string()
    .matches(/^\+?[0-9]{7,15}$/, "Phone number is not valid")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  // role: yup.string().required("Role is required"),
  // level: yup
  //   .number()
  //   .min(1, "Level must be at least 1")
  //   .required("Level is required"),
  // points: yup
  //   .number()
  //   .min(0, "Points cannot be negative")
  //   .required("Points is required"),
  // is_verified: yup.boolean().required("Verification status is required"),
  // is_active: yup.boolean().required("Active status is required"),
  // stripe_customer_id: yup.string().required("Stripe customer ID is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  organization: yup.object().shape({
    name: yup.string().required("Organization name is required"),
    // slug: yup.string().required("Organization slug is required"),
    subscription_status: yup
      .string()
      .required("Subscription status is required"),
  }),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      role: "superadmin",
      level: 1,
      points: 0,
      is_verified: false,
      is_active: true,
      stripe_customer_id: "",
      password: "",
      organization: {
        name: "",
        slug: "",
        subscription_status: "new",
      },
    },
  });

  const onSubmit = async (data) => {
    const createSlug = (name) => {
      return name.replace(/\s+/g, "_");
    };

    const submitData = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      role: "staff",
      is_verified: false,
      is_active: true,
      password: data.password,
      organization: {
        name: data.organization.name,
        slug: createSlug(data.organization.name),
        subscription_status: "new",
      },
    };

    setLoading(true);
    setServerError(null);
    try {
      const response = await authAPI.register(submitData);
      console.log("Registration response:", response);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setServerError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              {...register("organization.name")}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Organization name"
              autoComplete="organization"
            />
            {errors.organization?.name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.organization.name.message}
              </p>
            )}
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Organization Slug
            </label>
            <input
              type="text"
              {...register("organization.slug")}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Organization slug"
            />
            {errors.organization?.slug && (
              <p className="text-red-400 text-xs mt-1">
                {errors.organization.slug.message}
              </p>
            )}
          </div> */}
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

          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <option value="superadmin" className="bg-gray-800">
                  Super Admin
                </option>
                <option value="admin" className="bg-gray-800">
                  Admin
                </option>
                <option value="user" className="bg-gray-800">
                  User
                </option>
              </select>
              {errors.role && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Level
              </label>
              <input
                type="number"
                {...register("level", { valueAsNumber: true })}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Level"
                min="1"
              />
              {errors.level && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.level.message}
                </p>
              )}
            </div>
          </div> */}

          {/* <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Points
            </label>
            <input
              type="number"
              {...register("points", { valueAsNumber: true })}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Points"
              min="0"
            />
            {errors.points && (
              <p className="text-red-400 text-xs mt-1">
                {errors.points.message}
              </p>
            )}
          </div> */}
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("is_verified")}
                className="mr-2 h-4 w-4 text-blue-600 bg-white/5 border border-white/20 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label className="text-sm font-medium text-white/80">
                Is Verified
              </label>
              {errors.is_verified && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.is_verified.message}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("is_active")}
                className="mr-2 h-4 w-4 text-blue-600 bg-white/5 border border-white/20 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label className="text-sm font-medium text-white/80">
                Is Active
              </label>
              {errors.is_active && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.is_active.message}
                </p>
              )}
            </div>
          </div> */}
          {/* <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Stripe Customer ID
            </label>
            <input
              type="text"
              {...register("stripe_customer_id")}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Stripe customer ID"
            />
            {errors.stripe_customer_id && (
              <p className="text-red-400 text-xs mt-1">
                {errors.stripe_customer_id.message}
              </p>
            )}
          </div> */}
          {/* <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Subscription Status
            </label>
            <select
              {...register("organization.subscription_status")}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            >
              <option value="new" className="bg-gray-800">
                New
              </option>
              <option value="active" className="bg-gray-800">
                Active
              </option>
              <option value="cancelled" className="bg-gray-800">
                Cancelled
              </option>
              <option value="suspended" className="bg-gray-800">
                Suspended
              </option>
            </select>
            {errors.organization?.subscription_status && (
              <p className="text-red-400 text-xs mt-1">
                {errors.organization.subscription_status.message}
              </p>
            )}
          </div> */}
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
