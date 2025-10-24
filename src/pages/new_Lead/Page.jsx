import { useState, useEffect } from "react";
import CampaignsTable from "./Table";
import { PenTool, Plus } from "lucide-react";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";
import { useNavigate } from "react-router-dom";

const NewLeadPage = () => {
  const navigate = useNavigate();

  return (
    <MainContentWrapper>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Marketing Lead Module
            </h1>
            <p className="text-xl text-purple-100">
              Comprehensive Lead management with AI-powered insights
            </p>
          </div>
          <button
            onClick={() => navigate("/app/leads/add")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Lead
          </button>
        </div>

        <CampaignsTable />
      </div>
    </MainContentWrapper>
  );
};

export default NewLeadPage;
