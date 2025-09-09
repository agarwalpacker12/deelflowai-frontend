import React, { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast"; // or your toast library
import { authAPI } from "../../services/api";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";

const DefaultValues = {
  email: "",
  role: "staff",
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  role: yup.string().required("Role is required"),
});

const InvitationForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: DefaultValues,
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await authAPI.invite(data);
      return res;
    },
    onSuccess: (data) => {
      if (data.data.status == "success") {
        toast.success(data.data.message);
        // navigate("/app/invitee-register?token=ffsdfssggdgddgddgdgd");
      }
    },
    onError: (error) => {
      console.log("error", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const onSubmit = (data) => {
    console.log(data);

    mutation.mutate(data);
  };

  return (
    <>
      {/* <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"> */}
      <MainContentWrapper>
        <div className="flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <Mail className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Send Invitation
              </h1>
              <p className="text-gray-600">
                Invite a new user to join your team
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="user@example.com"
                      disabled={mutation.isPending}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Role
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      {...register("role")}
                      id="role"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none bg-white"
                      disabled={mutation.isPending}
                    >
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {mutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Invitation</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                The invitation will be sent to the provided email address
              </p>
            </div>
          </div>
        </div>
      </MainContentWrapper>
    </>
  );
};

export default InvitationForm;
