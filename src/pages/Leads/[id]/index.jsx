import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EditLeadForm from "./Form";
import { leadsAPI } from "../../../services/api";
import UpdateLeadForm from "./Form";

function EditLead() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      setLoading(true);
      try {
        const response = await leadsAPI.getLead(id);
        setLead(response.data.data); // Adjust if your API response is nested differently
      } catch (err) {
        setError("Failed to fetch lead details");
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white mb-2">Update Lead</h2>
            <p className="text-purple-100">
              Fill out the form below to upload a lead to your pipeline.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="space-y-6">
              <UpdateLeadForm leadRes={lead} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditLead;
