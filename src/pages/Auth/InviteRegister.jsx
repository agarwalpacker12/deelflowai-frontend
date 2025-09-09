import { useState, useEffect } from "react";
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { authAPI } from "../../services/api";

const registrationSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const InviteeRegister = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  //   console.log("searchParams", searchParams.get("token"));

  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [invitationRes, setInvitationRes] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await authAPI.getInvitation(token);

        // Handle the API response format
        if (response.data.status === "success") {
          console.log(response.data.data);

          setInvitationRes(response.data.data); // leads array
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchInvitation();
  }, [token]);

  const registrationMutation = useMutation({
    mutationFn: async (data) => {
      const response = await authAPI.inviteeRegister(data); // You'll need to implement this API method
      return response;
    },
    onSuccess: (data) => {
      if (data.data.status === "success") {
        toast.success("Registration completed successfully!");
        // You might want to auto-login the user or redirect to login
        navigate("/login");
      }
    },
    onError: (error) => {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const onSubmit = (data) => {
    const registrationData = {
      ...data,
      invitation_token: token,
    };
    registrationMutation.mutate(registrationData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Registration
          </h1>
          <p className="text-gray-600 mb-4">
            You've been invited to join{" "}
            <span className="font-semibold text-indigo-600">
              {invitationRes && invitationRes?.organization?.name}
            </span>
          </p>

          {/* Invitation Details Card */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{invitationRes?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 capitalize">
                  {invitationRes?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                {...register("first_name")}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="John"
                disabled={registrationMutation.isPending}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                {...register("last_name")}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Doe"
                disabled={registrationMutation.isPending}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                {...register("phone")}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Doe"
                disabled={registrationMutation.isPending}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Create a secure password"
                disabled={registrationMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register("password_confirmation")}
                type={showConfirmPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Confirm your password"
                disabled={registrationMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={registrationMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {registrationMutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteeRegister;
