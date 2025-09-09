import React, { useState } from "react";
import AddLeadForm from "./Form";

function AddLead() {
  const [submitStatus, setSubmitStatus] = useState(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white mb-2">Add New Lead</h2>
            <p className="text-purple-100">
              Fill out the form below to add a new lead to your pipeline.
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* Success Message */}
            {submitStatus && submitStatus.type === "success" && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border-l-4 border-green-400 text-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {submitStatus.message}
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus && submitStatus.type === "error" && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-400 text-red-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {submitStatus.message}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <AddLeadForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLead;
