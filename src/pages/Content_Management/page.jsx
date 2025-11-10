import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { contentAPI } from "../../services/api";
import { toast } from "react-toastify";
import {
  FileText,
  PenTool,
  Video,
  Mail,
  MessageSquare,
  Layout,
  Plus,
  Search,
  Eye,
  Edit,
  Copy,
  Share2,
  Calendar,
  TrendingUp,
  BarChart3,
  Star,
  Heart,
  ThumbsUp,
  Target,
  Folder,
  CheckCircle2,
  DollarSign,
  Loader2,
  Sparkles,
  X,
  Save,
  Send,
} from "lucide-react";

const ContentManagementPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createContentType, setCreateContentType] = useState(null);
  const [createMode, setCreateMode] = useState("manual"); // "manual", "ai", or "template"
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templateVariables, setTemplateVariables] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [isUpdatingContent, setIsUpdatingContent] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSubmittingTemplate, setIsSubmittingTemplate] = useState(false);
  const [templateFormData, setTemplateFormData] = useState({
    name: "",
    type: "",
    category: "",
    template_body: "",
    variables: {},
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleFormData, setScheduleFormData] = useState({
    content_id: "",
    scheduled_date: "",
    scheduled_time: "",
    status: "scheduled",
  });
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    content_body: "",
    tags: [],
    status: "draft",
    thumbnail_url: "",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [aiTone, setAiTone] = useState("professional");
  const [aiLength, setAiLength] = useState("medium");

  // Fetch content list for library tab
  const { data: contentListData, isLoading: isLoadingContent, error: contentError, refetch: refetchContent } = useQuery({
    queryKey: ['contentList', contentType, searchQuery, currentPage, statusFilter],
    queryFn: async () => {
      const filters = {
        page: currentPage,
        per_page: 20,
      };
      if (contentType !== 'all') filters.content_type = contentType;
      if (searchQuery) filters.search = searchQuery;
      if (statusFilter !== 'all') filters.status = statusFilter;
      
      const response = await contentAPI.getContentList(filters);
      if (response.status === 'success') {
        return response;
      }
      throw new Error(response.message || 'Failed to fetch content');
    },
    enabled: activeTab === 'library',
    refetchOnWindowFocus: false,
  });

  const contentItems = contentListData?.data || [];
  const totalPages = contentListData?.total_pages || 0;
  const totalContent = contentListData?.total || 0;

  // Sample content data (fallback)
  const sampleContentItems = [
    {
      id: 1,
      title: "Motivated Seller Email Campaign",
      type: "email",
      category: "Lead Generation",
      status: "published",
      performance: { opens: 847, clicks: 234, conversions: 67 },
      created: "2024-01-10",
      lastModified: "2024-01-12",
      author: "AI Assistant",
      thumbnail: "/api/placeholder/300/200",
      preview:
        "Hi {name}, Are you looking to sell your property quickly? We specialize in...",
      tags: ["seller", "motivated", "quick-sale"],
      engagement: 94,
    },
    {
      id: 2,
      title: "Social Media Property Showcase",
      type: "social",
      category: "Property Marketing",
      status: "draft",
      performance: { likes: 423, shares: 89, comments: 156 },
      created: "2024-01-11",
      lastModified: "2024-01-13",
      author: "Marketing Team",
      thumbnail: "/api/placeholder/300/200",
      preview:
        "🏠 STUNNING INVESTMENT OPPORTUNITY! This 3BR/2BA property in Dallas offers...",
      tags: ["social", "property", "investment"],
      engagement: 76,
    },
    {
      id: 3,
      title: "Investor Welcome Sequence",
      type: "email_sequence",
      category: "Onboarding",
      status: "active",
      performance: { opens: 1234, clicks: 567, conversions: 145 },
      created: "2024-01-05",
      lastModified: "2024-01-14",
      author: "AI Assistant",
      thumbnail: "/api/placeholder/300/200",
      preview:
        "Welcome to our exclusive investor network! You're about to discover...",
      tags: ["investor", "welcome", "sequence"],
      engagement: 89,
    },
  ];

  // Fetch templates
  const { data: templatesData, isLoading: isLoadingTemplates, error: templatesError, refetch: refetchTemplates } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await contentAPI.getTemplates({ page: 1, per_page: 50 });
      if (response.status === 'success') {
        return response;
      }
      throw new Error(response.message || 'Failed to fetch templates');
    },
    enabled: activeTab === 'templates' || showCreateForm,
    refetchOnWindowFocus: false,
  });

  const templates = templatesData?.data || [];
  
  // Get templates filtered by content type for create form
  const filteredTemplates = createContentType 
    ? templates.filter(t => t.type === createContentType)
    : [];

  // Fetch calendar
  const [calendarDateRange, setCalendarDateRange] = useState('week'); // 'week' or 'month'
  const { data: calendarData, isLoading: isLoadingCalendar, error: calendarError, refetch: refetchCalendar } = useQuery({
    queryKey: ['contentCalendar', calendarDateRange],
    queryFn: async () => {
      const filters = {};
      const today = new Date();
      if (calendarDateRange === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        filters.start_date = weekStart.toISOString().split('T')[0];
        filters.end_date = weekEnd.toISOString().split('T')[0];
      } else if (calendarDateRange === 'month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        filters.start_date = monthStart.toISOString().split('T')[0];
        filters.end_date = monthEnd.toISOString().split('T')[0];
      }
      
      const response = await contentAPI.getCalendar(filters);
      if (response.status === 'success') {
        return response;
      }
      throw new Error(response.message || 'Failed to fetch calendar');
    },
    enabled: activeTab === 'calendar',
    refetchOnWindowFocus: false,
  });

  const contentCalendar = calendarData?.data || [];

  const tabs = [
    { id: "overview", label: "Content Overview", icon: BarChart3 },
    { id: "library", label: "Content Library", icon: Folder },
    { id: "templates", label: "Templates", icon: Layout },
    { id: "calendar", label: "Content Calendar", icon: Calendar },
    { id: "create", label: "Create Content", icon: PenTool },
    { id: "analytics", label: "Performance", icon: TrendingUp },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "in_review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "email_sequence":
        return <Mail className="w-4 h-4" />;
      case "social":
        return <Share2 className="w-4 h-4" />;
      case "sms":
        return <MessageSquare className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleCreateContent = (type) => {
    setCreateContentType(type);
    setFormData({
      title: "",
      type: type,
      category: "",
      content_body: "",
      tags: [],
      status: "draft",
      thumbnail_url: "",
    });
    setAiPrompt("");
    setAiContext("");
    setSelectedTemplateId(null);
    setTemplateVariables({});
    setCreateMode("manual");
    setShowCreateForm(true);
  };

  const handleUseTemplate = async () => {
    if (!selectedTemplateId) {
      toast.error("Please select a template");
      return;
    }

    try {
      const response = await contentAPI.useTemplate(selectedTemplateId, templateVariables, {
        title: formData.title || `${filteredTemplates.find(t => t.id === selectedTemplateId)?.name || 'Template'} - Content`,
        status: formData.status || 'draft',
        category: formData.category || '',
        tags: formData.tags || [],
      });
      
      if (response.status === "success" && response.data) {
        const createdContent = response.data;
        setFormData((prev) => ({
          ...prev,
          title: createdContent.title || prev.title,
          content_body: createdContent.content_body || prev.content_body,
          category: createdContent.category || prev.category,
        }));
        toast.success("Content created from template successfully!");
        setCreateMode("manual"); // Switch to manual mode to allow editing
      } else {
        toast.error("Failed to create content from template");
      }
    } catch (error) {
      console.error("Error using template:", error);
      toast.error("Failed to create content from template. Please try again.");
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt for AI generation");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const generateData = {
        type: createContentType,
        prompt: aiPrompt,
        context: aiContext,
        tone: aiTone,
        length: aiLength,
      };

      const response = await contentAPI.generateAIContent(generateData);
      if (response.status === "success" && response.data?.content) {
        setFormData((prev) => ({
          ...prev,
          content_body: response.data.content,
        }));
        toast.success("AI content generated successfully!");
      } else {
        toast.error("Failed to generate AI content");
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
      toast.error("Failed to generate AI content. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmitContent = async () => {
    if (!formData.title.trim() || !formData.content_body.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if we're editing existing content
    if (editingContent && editingContent.id) {
      setIsUpdatingContent(true);
      try {
        const contentData = {
          ...formData,
          type: editingContent.type || formData.type,
        };

        const response = await contentAPI.updateContent(editingContent.id, contentData);
        if (response.status === "success") {
          toast.success("Content updated successfully!");
          setShowEditModal(false);
          setEditingContent(null);
          setFormData({
            title: "",
            type: "",
            category: "",
            content_body: "",
            tags: [],
            status: "draft",
            thumbnail_url: "",
          });
          // Refetch content list
          refetchContent();
        } else {
          toast.error(response.message || "Failed to update content");
        }
      } catch (error) {
        console.error("Error updating content:", error);
        toast.error("Failed to update content. Please try again.");
      } finally {
        setIsUpdatingContent(false);
      }
      return;
    }

    // Create new content
    try {
      const contentData = {
        ...formData,
        type: createContentType,
      };

      const response = await contentAPI.createContent(contentData);
      if (response.status === "success") {
        toast.success("Content created successfully!");
        setShowCreateForm(false);
        setCreateContentType(null);
        setFormData({
          title: "",
          type: "",
          category: "",
          content_body: "",
          tags: [],
          status: "draft",
          thumbnail_url: "",
        });
        // Refetch content list if on library tab
        if (activeTab === "library") {
          refetchContent();
        }
      } else {
        toast.error(response.message || "Failed to create content");
      }
    } catch (error) {
      console.error("Error creating content:", error);
      toast.error("Failed to create content. Please try again.");
    }
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (!formData.tags.includes(tag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
      }
      e.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmitTemplate = async () => {
    if (!templateFormData.name.trim() || !templateFormData.template_body.trim()) {
      toast.error("Please fill in name and template body");
      return;
    }

    if (!templateFormData.type) {
      toast.error("Please select a template type");
      return;
    }

    setIsSubmittingTemplate(true);
    try {
      const response = await contentAPI.createTemplate(templateFormData);
      if (response.status === "success") {
        toast.success("Template created successfully!");
        setShowTemplateForm(false);
        setTemplateFormData({
          name: "",
          type: "",
          category: "",
          template_body: "",
          variables: {},
        });
        refetchTemplates();
      } else {
        toast.error(response.message || "Failed to create template");
      }
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Failed to create template. Please try again.");
    } finally {
      setIsSubmittingTemplate(false);
    }
  };

  const handleScheduleContent = async () => {
    if (!scheduleFormData.content_id || !scheduleFormData.scheduled_date) {
      toast.error("Please select content and scheduled date");
      return;
    }

    setIsSubmittingSchedule(true);
    try {
      const response = await contentAPI.scheduleContent(scheduleFormData);
      if (response.status === "success") {
        toast.success("Content scheduled successfully!");
        setShowScheduleModal(false);
        setScheduleFormData({
          content_id: "",
          scheduled_date: "",
          scheduled_time: "",
          status: "scheduled",
        });
        refetchCalendar();
      } else {
        toast.error(response.message || "Failed to schedule content");
      }
    } catch (error) {
      console.error("Error scheduling content:", error);
      toast.error("Failed to schedule content. Please try again.");
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  const handleUpdateSchedule = async () => {
    if (!selectedSchedule || !scheduleFormData.scheduled_date) {
      toast.error("Please fill in scheduled date");
      return;
    }

    setIsSubmittingSchedule(true);
    try {
      const response = await contentAPI.updateSchedule(selectedSchedule.id, {
        scheduled_date: scheduleFormData.scheduled_date,
        scheduled_time: scheduleFormData.scheduled_time || null,
        status: scheduleFormData.status,
      });
      if (response.status === "success") {
        toast.success("Schedule updated successfully!");
        setShowEditScheduleModal(false);
        setSelectedSchedule(null);
        setScheduleFormData({
          content_id: "",
          scheduled_date: "",
          scheduled_time: "",
          status: "scheduled",
        });
        refetchCalendar();
      } else {
        toast.error(response.message || "Failed to update schedule");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update schedule. Please try again.");
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  // Fetch analytics overview
  const { data: analyticsOverview, isLoading: isLoadingOverview, error: overviewError } = useQuery({
    queryKey: ['contentAnalyticsOverview'],
    queryFn: async () => {
      const response = await contentAPI.getAnalyticsOverview();
      if (response.status === 'success') {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch analytics overview');
    },
    refetchOnWindowFocus: false,
  });

  // Fetch recent content for activity feed
  const { data: recentContent, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['recentContent'],
    queryFn: async () => {
      const response = await contentAPI.getContentList({ page: 1, per_page: 10 });
      if (response.status === 'success') {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch recent content');
    },
    refetchOnWindowFocus: false,
  });

  // Format date for display
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-purple-800/90 via-purple-700/90 to-indigo-800/90 backdrop-blur-sm border-b border-purple-600/30"> */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Content Management
              </h1>
              <p className="text-sm text-purple-200">
                Create, manage, and optimize marketing content across all
                channels
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {isLoadingOverview ? (
                  <Loader2 className="w-6 h-6 animate-spin inline" />
                ) : (
                  analyticsOverview?.total_content || 0
                )}
              </div>
              <div className="text-sm text-purple-200">Content Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {isLoadingOverview ? (
                  <Loader2 className="w-6 h-6 animate-spin inline" />
                ) : (
                  `${(analyticsOverview?.avg_engagement_rate || 0).toFixed(1)}%`
                )}
              </div>
              <div className="text-sm text-purple-200">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {isLoadingOverview ? (
                  <Loader2 className="w-6 h-6 animate-spin inline" />
                ) : (
                  `${(analyticsOverview?.conversion_rate || 0).toFixed(1)}%`
                )}
              </div>
              <div className="text-sm text-purple-200">Conversion</div>
            </div>
          </div>
        </div>
        {/* </div> */}

        {/* Navigation Tabs */}
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-400 text-blue-300"
                      : "border-transparent text-purple-300 hover:text-white hover:border-purple-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">
                      Total Content
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {isLoadingOverview ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        analyticsOverview?.total_content || 0
                      )}
                    </p>
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {analyticsOverview?.published_content || 0} published
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">
                      Published
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {isLoadingOverview ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        analyticsOverview?.published_content || 0
                      )}
                    </p>
                    <p className="text-sm text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Active content
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">
                      Avg Engagement
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {isLoadingOverview ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        `${(analyticsOverview?.avg_engagement_rate || 0).toFixed(1)}%`
                      )}
                    </p>
                    <p className="text-sm text-pink-400 flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {analyticsOverview?.total_opens || 0} opens
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">
                      Conversion Rate
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {isLoadingOverview ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        `${(analyticsOverview?.conversion_rate || 0).toFixed(1)}%`
                      )}
                    </p>
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {analyticsOverview?.total_conversions || 0} conversions
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30">
              <div className="p-6 border-b border-purple-600/30">
                <h3 className="text-lg font-semibold text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                {isLoadingRecent ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  </div>
                ) : recentContent && recentContent.length > 0 ? (
                  <div className="space-y-4">
                    {recentContent.slice(0, 5).map((item) => {
                      const action = item.status === 'published' ? 'Published' : 
                                     item.status === 'active' ? 'Activated' : 
                                     item.status === 'scheduled' ? 'Scheduled' : 
                                     item.updated_at !== item.created_at ? 'Updated' : 'Created';
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-700/50 to-indigo-800/50 rounded-lg border border-purple-600/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <div className="font-medium text-sm text-white">
                                <span className="text-blue-400">
                                  {action}
                                </span>{" "}
                                {item.title}
                              </div>
                              <div className="text-xs text-purple-200">
                                {formatTimeAgo(item.updated_at || item.created_at)} by {item.author_name || 'Unknown'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-purple-200">
                    No recent activity
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">
                    Create Email Campaign
                  </h3>
                </div>
                <p className="text-sm text-purple-200 mb-4">
                  Generate AI-powered email campaigns for lead generation
                </p>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all shadow-lg">
                  Create Now
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">
                    Social Media Content
                  </h3>
                </div>
                <p className="text-sm text-purple-200 mb-4">
                  Create engaging social media posts for property marketing
                </p>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Generate Post
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">
                    Performance Report
                  </h3>
                </div>
                <p className="text-sm text-purple-200 mb-4">
                  Analyze content performance and optimization opportunities
                </p>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "library" && (
          <div className="space-y-6">
            {/* Library Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Content Library
                {totalContent > 0 && (
                  <span className="text-sm text-purple-300 ml-2">
                    ({totalContent} items)
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-300" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-purple-800/50 border border-purple-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder-purple-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-purple-800/50 border border-purple-600/50 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_review">In Review</option>
                  <option value="archived">Archived</option>
                </select>
                <select
                  value={contentType}
                  onChange={(e) => {
                    setContentType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-purple-800/50 border border-purple-600/50 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="email">Email</option>
                  <option value="social">Social Media</option>
                  <option value="sms">SMS</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="email_sequence">Email Sequence</option>
                </select>
                <button 
                  onClick={() => setActiveTab("create")}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Content
                </button>
              </div>
            </div>

            {/* Content Grid */}
            {isLoadingContent ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              </div>
            ) : contentItems && contentItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {contentItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="relative">
                      <img
                        // src={item.thumbnail}
                        src={`/images/${item.title}.jpg`}
                        alt={item.title}
                        className="w-full h-32 object-fill"
                      />
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1 bg-purple-900/90 backdrop-blur-sm rounded-full px-2 py-1 border border-purple-600/50">
                          {getTypeIcon(item.type)}
                          <span className="text-xs font-medium capitalize text-white">
                            {item.type.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm leading-tight text-white">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <Star className="w-3 h-3" />
                          {item.engagement}%
                        </div>
                      </div>

                      <p className="text-xs text-purple-200 mb-3 line-clamp-2">
                        {item.content_body?.substring(0, 100) || 'No preview available'}...
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        {item.tags && item.tags.length > 0 ? (
                          item.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-purple-700/50 text-purple-200 text-xs rounded-full border border-purple-600/30"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-purple-400">No tags</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-purple-600/30">
                        <div className="text-xs text-purple-300">
                          {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Unknown date'}
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setSelectedContent(item);
                              setShowViewModal(true);
                            }}
                            className="p-1 text-purple-300 hover:text-blue-400 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                const response = await contentAPI.getContent(item.id);
                                if (response.status === 'success' && response.data) {
                                  setEditingContent(response.data);
                                  setFormData({
                                    title: response.data.title || "",
                                    type: response.data.type || "",
                                    category: response.data.category || "",
                                    content_body: response.data.content_body || "",
                                    tags: response.data.tags || [],
                                    status: response.data.status || "draft",
                                    thumbnail_url: response.data.thumbnail_url || "",
                                  });
                                  setShowEditModal(true);
                                } else {
                                  toast.error("Failed to load content for editing");
                                }
                              } catch (error) {
                                console.error("Error loading content:", error);
                                toast.error("Failed to load content for editing");
                              }
                            }}
                            className="p-1 text-purple-300 hover:text-green-400 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                const response = await contentAPI.duplicateContent(item.id);
                                if (response.status === 'success') {
                                  toast.success('Content duplicated successfully');
                                  refetchContent();
                                }
                              } catch (error) {
                                toast.error('Failed to duplicate content');
                              }
                            }}
                            className="p-1 text-purple-300 hover:text-purple-400 transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this content?')) {
                                try {
                                  const response = await contentAPI.deleteContent(item.id);
                                  if (response.status === 'success') {
                                    toast.success('Content deleted successfully');
                                    refetchContent();
                                  }
                                } catch (error) {
                                  toast.error('Failed to delete content');
                                }
                              }
                            }}
                            className="p-1 text-purple-300 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-purple-800/50 border border-purple-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700/50 transition-all"
                    >
                      Previous
                    </button>
                    <span className="text-purple-200">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-purple-800/50 border border-purple-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700/50 transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-purple-200">
                {contentError ? (
                  <div>
                    <p className="text-red-400 mb-2">Error loading content</p>
                    <button
                      onClick={() => refetchContent()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <p>No content found. Create your first content item!</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "templates" && (
          <div className="space-y-6">
            {/* Templates Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Content Templates
              </h2>
              <button 
                onClick={() => {
                  setTemplateFormData({
                    name: "",
                    type: "",
                    category: "",
                    template_body: "",
                    variables: {},
                  });
                  setShowTemplateForm(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            </div>

            {/* Template Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Email Marketing",
                  type: "email",
                  icon: Mail,
                  color: "bg-gradient-to-br from-blue-500 to-blue-600",
                },
                {
                  name: "Social Media",
                  type: "social",
                  icon: Share2,
                  color: "bg-gradient-to-br from-green-500 to-green-600",
                },
                {
                  name: "SMS Campaigns",
                  type: "sms",
                  icon: MessageSquare,
                  color: "bg-gradient-to-br from-purple-500 to-purple-600",
                },
                {
                  name: "Documents",
                  type: "document",
                  icon: FileText,
                  color: "bg-gradient-to-br from-orange-500 to-orange-600",
                },
              ].map((category, index) => {
                const count = templates.filter(t => t.type === category.type).length;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6 cursor-pointer hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${category.color}`}
                      >
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-purple-200">
                          {isLoadingTemplates ? (
                            <Loader2 className="w-4 h-4 animate-spin inline" />
                          ) : (
                            `${count} templates`
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Featured Templates */}
            <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30">
              <div className="p-6 border-b border-purple-600/30">
                <h3 className="text-lg font-semibold text-white">
                  Featured Templates
                </h3>
              </div>
              <div className="p-6">
                {isLoadingTemplates ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  </div>
                ) : templates && templates.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {templates.slice(0, 10).map((template) => (
                      <div
                        key={template.id}
                        className="border border-purple-600/30 rounded-lg p-4 bg-gradient-to-r from-purple-700/30 to-indigo-800/30"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                              {getTypeIcon(template.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                {template.name}
                              </h4>
                              <p className="text-sm text-purple-200">
                                {template.category || 'Uncategorized'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-purple-200">
                              {template.rating ? template.rating.toFixed(1) : '0.0'}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-purple-200 mb-4">
                          {template.template_body?.substring(0, 100) || 'No description available'}...
                        </p>

                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="text-purple-300">
                            Used {template.usage_count?.toLocaleString() || 0} times
                          </span>
                          {template.is_predefined && (
                            <span className="text-blue-400 font-medium text-xs">
                              Predefined
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={async () => {
                              try {
                                // Use template to create content
                                const variables = template.variables || {};
                                const response = await contentAPI.useTemplate(template.id, variables, {
                                  title: `${template.name} - Content`,
                                  status: 'draft'
                                });
                                if (response.status === 'success') {
                                  toast.success('Content created from template successfully');
                                  setActiveTab('library');
                                  // Refetch content list
                                  refetchContent();
                                }
                              } catch (error) {
                                toast.error('Failed to use template');
                              }
                            }}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg text-sm"
                          >
                            Use Template
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                const response = await contentAPI.getTemplate(template.id);
                                if (response.status === 'success') {
                                  setSelectedTemplate(response.data);
                                  setShowTemplatePreview(true);
                                }
                              } catch (error) {
                                toast.error('Failed to load template');
                              }
                            }}
                            className="px-4 py-2 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/30 transition-all"
                            title="View Template"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!template.is_predefined && (
                            <button 
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this template?')) {
                                  try {
                                    const response = await contentAPI.deleteTemplate(template.id);
                                    if (response.status === 'success') {
                                      toast.success('Template deleted successfully');
                                      refetchTemplates();
                                    }
                                  } catch (error) {
                                    toast.error('Failed to delete template');
                                  }
                                }
                              }}
                              className="px-4 py-2 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/30 transition-all"
                              title="Delete Template"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-purple-200">
                    {templatesError ? (
                      <div>
                        <p className="text-red-400 mb-2">Error loading templates</p>
                        <button
                          onClick={() => refetchTemplates()}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <p>No templates found. Create your first template!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Content Calendar
                {contentCalendar.length > 0 && (
                  <span className="text-sm text-purple-300 ml-2">
                    ({contentCalendar.length} scheduled)
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCalendarDateRange('week')}
                  className={`px-4 py-2 border rounded-lg transition-all ${
                    calendarDateRange === 'week' 
                      ? 'border-purple-400 bg-purple-700/30 text-white' 
                      : 'border-purple-600/50 text-purple-200 hover:bg-purple-700/30'
                  }`}
                >
                  This Week
                </button>
                <button 
                  onClick={() => setCalendarDateRange('month')}
                  className={`px-4 py-2 border rounded-lg transition-all ${
                    calendarDateRange === 'month' 
                      ? 'border-purple-400 bg-purple-700/30 text-white' 
                      : 'border-purple-600/50 text-purple-200 hover:bg-purple-700/30'
                  }`}
                >
                  This Month
                </button>
                <button 
                  onClick={() => {
                    setScheduleFormData({
                      content_id: "",
                      scheduled_date: "",
                      scheduled_time: "",
                      status: "scheduled",
                    });
                    setShowScheduleModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Content
                </button>
              </div>
            </div>

            {/* Upcoming Content */}
            <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30">
              <div className="p-6 border-b border-purple-600/30">
                <h3 className="text-lg font-semibold text-white">
                  Upcoming Scheduled Content
                </h3>
              </div>
              <div className="p-6">
                {isLoadingCalendar ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  </div>
                ) : contentCalendar && contentCalendar.length > 0 ? (
                  <div className="space-y-4">
                    {contentCalendar.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-purple-600/30 rounded-lg bg-gradient-to-r from-purple-700/30 to-indigo-800/30 hover:from-purple-600/30 hover:to-indigo-700/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm font-semibold text-purple-400">
                              {item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString("en-US", {
                                month: "short",
                              }) : 'TBD'}
                            </div>
                            <div className="text-lg font-bold text-white">
                              {item.scheduled_date ? new Date(item.scheduled_date).getDate() : '?'}
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            {getTypeIcon(item.content_type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">
                              {item.content_title}
                            </h4>
                            <p className="text-sm text-purple-200 capitalize">
                              {item.content_type} •{" "}
                              {item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString("en-US", {
                                weekday: "long",
                              }) : 'No date'}
                              {item.scheduled_time && ` • ${item.scheduled_time.substring(0, 5)}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status.replace("_", " ")}
                          </span>
                          <button 
                            onClick={async () => {
                              setSelectedSchedule(item);
                              setScheduleFormData({
                                content_id: item.content_id,
                                scheduled_date: item.scheduled_date ? item.scheduled_date.split('T')[0] : "",
                                scheduled_time: item.scheduled_time ? item.scheduled_time.substring(0, 5) : "",
                                status: item.status || "scheduled",
                              });
                              setShowEditScheduleModal(true);
                            }}
                            className="p-2 text-purple-300 hover:text-blue-400 transition-colors"
                            title="Edit Schedule"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to cancel this schedule?')) {
                                try {
                                  const response = await contentAPI.cancelSchedule(item.id);
                                  if (response.status === 'success') {
                                    toast.success('Schedule cancelled successfully');
                                    refetchCalendar();
                                  }
                                } catch (error) {
                                  toast.error('Failed to cancel schedule');
                                }
                              }
                            }}
                            className="p-2 text-purple-300 hover:text-red-400 transition-colors"
                            title="Cancel Schedule"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-purple-200">
                    {calendarError ? (
                      <div>
                        <p className="text-red-400 mb-2">Error loading calendar</p>
                        <button
                          onClick={() => refetchCalendar()}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <p>No scheduled content found. Schedule your first content!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "create" && (
          <div className="space-y-6">
            {!showCreateForm ? (
              <>
                {/* Create Content Header */}
                <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    Create New Content
                  </h2>
                  <p className="text-purple-200">
                    Choose a content type to get started with AI-powered content
                    generation
                  </p>
                </div>

                {/* Content Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      type: "email",
                      title: "Email Campaign",
                      description:
                        "Create targeted email campaigns for lead generation and nurturing",
                      icon: Mail,
                      color: "bg-gradient-to-br from-blue-500 to-blue-600",
                      features: [
                        "AI subject lines",
                        "Personalization",
                        "A/B testing",
                      ],
                    },
                    {
                      type: "social",
                      title: "Social Media Post",
                      description:
                        "Generate engaging content for Facebook, Instagram, and Twitter",
                      icon: Share2,
                      color: "bg-gradient-to-br from-green-500 to-green-600",
                      features: [
                        "Auto hashtags",
                        "Image suggestions",
                        "Multi-platform",
                      ],
                    },
                    {
                      type: "sms",
                      title: "SMS Campaign",
                      description: "Create short, impactful text message campaigns",
                      icon: MessageSquare,
                      color: "bg-gradient-to-br from-purple-500 to-purple-600",
                      features: [
                        "Character optimization",
                        "Link tracking",
                        "Automation",
                      ],
                    },
                    {
                      type: "video",
                      title: "Video Script",
                      description: "Create compelling video scripts for marketing videos",
                      icon: Video,
                      color: "bg-gradient-to-br from-red-500 to-red-600",
                      features: [
                        "Storytelling",
                        "Engagement hooks",
                        "Call-to-action",
                      ],
                    },
                    {
                      type: "document",
                      title: "Document",
                      description: "Create professional documents, guides, and resources",
                      icon: FileText,
                      color: "bg-gradient-to-br from-orange-500 to-orange-600",
                      features: [
                        "Structured content",
                        "Professional formatting",
                        "Multi-section",
                      ],
                    },
                    {
                      type: "email_sequence",
                      title: "Email Sequence",
                      description: "Create a series of connected email messages",
                      icon: Layout,
                      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
                      features: [
                        "Multi-step sequences",
                        "Automated workflows",
                        "Drip campaigns",
                      ],
                    },
                  ].map((contentType, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6 hover:shadow-xl transition-all cursor-pointer"
                      onClick={() => handleCreateContent(contentType.type)}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-12 h-12 ${contentType.color} rounded-lg flex items-center justify-center shadow-lg`}
                        >
                          <contentType.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-white">
                            {contentType.title}
                          </h3>
                          <p className="text-sm text-purple-200">
                            {contentType.description}
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {contentType.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-purple-200 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create {contentType.title}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Content Creation Form */
              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Create {createContentType?.charAt(0).toUpperCase() + createContentType?.slice(1).replace("_", " ")} Content
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setCreateContentType(null);
                      setFormData({
                        title: "",
                        type: "",
                        category: "",
                        content_body: "",
                        tags: [],
                        status: "draft",
                        thumbnail_url: "",
                      });
                    }}
                    className="p-2 text-purple-300 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mode Toggle: Manual vs AI vs Template */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-purple-200 font-medium">Creation Mode:</span>
                    <div className="flex items-center gap-2 bg-purple-900/50 rounded-lg p-1">
                      <button
                        onClick={() => setCreateMode("manual")}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          createMode === "manual"
                            ? "bg-purple-600 text-white"
                            : "text-purple-300 hover:text-white"
                        }`}
                      >
                        Manual
                      </button>
                      <button
                        onClick={() => setCreateMode("ai")}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                          createMode === "ai"
                            ? "bg-purple-600 text-white"
                            : "text-purple-300 hover:text-white"
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        AI Generated
                      </button>
                      {filteredTemplates.length > 0 && (
                        <button
                          onClick={() => setCreateMode("template")}
                          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                            createMode === "template"
                              ? "bg-purple-600 text-white"
                              : "text-purple-300 hover:text-white"
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          From Template
                        </button>
                      )}
                    </div>
                  </div>

                  {createMode === "ai" && (
                    <div className="bg-purple-900/30 rounded-lg p-4 space-y-4 border border-purple-600/30">
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                          AI Prompt <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="Describe what you want to create, e.g., 'Create a welcome email for new customers'"
                          className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                          Additional Context (Optional)
                        </label>
                        <textarea
                          value={aiContext}
                          onChange={(e) => setAiContext(e.target.value)}
                          placeholder="Provide additional context, target audience, or specific requirements"
                          className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">
                            Tone
                          </label>
                          <select
                            value={aiTone}
                            onChange={(e) => setAiTone(e.target.value)}
                            className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="friendly">Friendly</option>
                            <option value="formal">Formal</option>
                            <option value="conversational">Conversational</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">
                            Length
                          </label>
                          <select
                            value={aiLength}
                            onChange={(e) => setAiLength(e.target.value)}
                            className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="short">Short</option>
                            <option value="medium">Medium</option>
                            <option value="long">Long</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={handleGenerateAI}
                        disabled={isGeneratingAI || !aiPrompt.trim()}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingAI ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate Content
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {createMode === "template" && (
                    <div className="bg-purple-900/30 rounded-lg p-4 space-y-4 border border-purple-600/30">
                      {isLoadingTemplates ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                        </div>
                      ) : filteredTemplates.length > 0 ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-purple-200 mb-2">
                              Select Template <span className="text-red-400">*</span>
                            </label>
                            <select
                              value={selectedTemplateId || ""}
                              onChange={(e) => {
                                const templateId = parseInt(e.target.value);
                                setSelectedTemplateId(templateId);
                                const selectedTemplate = filteredTemplates.find(t => t.id === templateId);
                                if (selectedTemplate?.variables) {
                                  // Initialize template variables
                                  const vars = {};
                                  Object.keys(selectedTemplate.variables).forEach(key => {
                                    vars[key] = "";
                                  });
                                  setTemplateVariables(vars);
                                }
                              }}
                              className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="">-- Select a template --</option>
                              {filteredTemplates.map((template) => (
                                <option key={template.id} value={template.id}>
                                  {template.name} {template.is_predefined ? "(Predefined)" : ""}
                                </option>
                              ))}
                            </select>
                          </div>

                          {selectedTemplateId && (() => {
                            const selectedTemplate = filteredTemplates.find(t => t.id === selectedTemplateId);
                            return selectedTemplate?.variables && Object.keys(selectedTemplate.variables).length > 0 ? (
                              <div>
                                <label className="block text-sm font-medium text-purple-200 mb-2">
                                  Template Variables
                                </label>
                                <div className="space-y-2">
                                  {Object.keys(selectedTemplate.variables).map((key) => (
                                    <div key={key}>
                                      <label className="block text-xs text-purple-300 mb-1">
                                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </label>
                                      <input
                                        type="text"
                                        value={templateVariables[key] || ""}
                                        onChange={(e) =>
                                          setTemplateVariables((prev) => ({
                                            ...prev,
                                            [key]: e.target.value,
                                          }))
                                        }
                                        placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                                        className="w-full px-3 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null;
                          })()}

                          <button
                            onClick={handleUseTemplate}
                            disabled={!selectedTemplateId}
                            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FileText className="w-4 h-4" />
                            Create from Template
                          </button>
                        </>
                      ) : (
                        <div className="text-center py-8 text-purple-300">
                          <p>No templates available for {createContentType?.replace("_", " ")} content type.</p>
                          <p className="text-sm text-purple-400 mt-2">Create a template first or use Manual/AI mode.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Content Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="Enter content title"
                      className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        placeholder="e.g., Lead Generation, Property Marketing"
                        className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="in_review">In Review</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Content Body <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.content_body}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          content_body: e.target.value,
                        }))
                      }
                      placeholder="Enter your content here..."
                      className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-purple-700/50 text-purple-200 text-sm rounded-full border border-purple-600/30 flex items-center gap-2"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      onKeyDown={handleTagInput}
                      placeholder="Type a tag and press Enter"
                      className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Thumbnail URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnail_url}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          thumbnail_url: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={handleSubmitContent}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all shadow-lg flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Content
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setCreateContentType(null);
                      }}
                      className="px-6 py-2 bg-purple-800/50 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Analytics Header */}
            <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
              <h2 className="text-xl font-semibold mb-2 text-white">
                Content Performance Analytics
              </h2>
              <p className="text-purple-200">
                Track engagement, conversions, and ROI across all content types
              </p>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  {isLoadingOverview ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  ) : (
                    <span className="text-sm text-green-400">
                      {analyticsOverview?.total_opens > 0 ? '+' : ''}
                      {analyticsOverview?.open_rate?.toFixed(1) || 0}%
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoadingOverview ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    `${(analyticsOverview?.total_opens || 0).toLocaleString()}`
                  )}
                </div>
                <div className="text-sm text-purple-200">Total Opens</div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                    <ThumbsUp className="w-5 h-5 text-white" />
                  </div>
                  {isLoadingOverview ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  ) : (
                    <span className="text-sm text-green-400">
                      {analyticsOverview?.avg_engagement_rate > 0 ? '+' : ''}
                      {analyticsOverview?.avg_engagement_rate?.toFixed(1) || 0}%
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoadingOverview ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    `${(analyticsOverview?.avg_engagement_rate || 0).toFixed(1)}%`
                  )}
                </div>
                <div className="text-sm text-purple-200">Engagement Rate</div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  {isLoadingOverview ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  ) : (
                    <span className="text-sm text-green-400">
                      {analyticsOverview?.conversion_rate > 0 ? '+' : ''}
                      {analyticsOverview?.conversion_rate?.toFixed(1) || 0}%
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoadingOverview ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    `${(analyticsOverview?.conversion_rate || 0).toFixed(1)}%`
                  )}
                </div>
                <div className="text-sm text-purple-200">Conversion Rate</div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  {isLoadingOverview ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  ) : (
                    <span className="text-sm text-green-400">
                      {analyticsOverview?.total_revenue > 0 ? '+' : ''}
                      {analyticsOverview?.total_revenue?.toFixed(0) || 0}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoadingOverview ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    `$${(analyticsOverview?.total_revenue || 0).toLocaleString()}`
                  )}
                </div>
                <div className="text-sm text-purple-200">Revenue Generated</div>
              </div>
            </div>

            {/* Detailed Performance Metrics */}
            <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30">
              <div className="p-6 border-b border-purple-600/30">
                <h3 className="text-lg font-semibold text-white">
                  Performance Breakdown
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {isLoadingOverview ? (
                        <Loader2 className="w-8 h-8 animate-spin inline" />
                      ) : (
                        (analyticsOverview?.total_clicks || 0).toLocaleString()
                      )}
                    </div>
                    <div className="text-sm text-purple-200">Total Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {isLoadingOverview ? (
                        <Loader2 className="w-8 h-8 animate-spin inline" />
                      ) : (
                        (analyticsOverview?.total_conversions || 0).toLocaleString()
                      )}
                    </div>
                    <div className="text-sm text-purple-200">Total Conversions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {isLoadingOverview ? (
                        <Loader2 className="w-8 h-8 animate-spin inline" />
                      ) : (
                        `${(analyticsOverview?.click_rate || 0).toFixed(1)}%`
                      )}
                    </div>
                    <div className="text-sm text-purple-200">Click Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Content Modal */}
      {showViewModal && selectedContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-800/95 to-indigo-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-600/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-purple-900/95 backdrop-blur-sm border-b border-purple-600/50 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">{selectedContent.title}</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedContent(null);
                }}
                className="p-2 text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-purple-300">Type</label>
                  <div className="mt-1 flex items-center gap-2">
                    {getTypeIcon(selectedContent.type)}
                    <span className="text-white capitalize">{selectedContent.type?.replace("_", " ")}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-300">Status</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContent.status)}`}>
                      {selectedContent.status}
                    </span>
                  </div>
                </div>
                {selectedContent.category && (
                  <div>
                    <label className="text-sm font-medium text-purple-300">Category</label>
                    <div className="mt-1 text-white">{selectedContent.category}</div>
                  </div>
                )}
                {selectedContent.author_name && (
                  <div>
                    <label className="text-sm font-medium text-purple-300">Author</label>
                    <div className="mt-1 text-white">{selectedContent.author_name}</div>
                  </div>
                )}
              </div>

              {selectedContent.tags && selectedContent.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-purple-300 mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedContent.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-purple-700/50 text-purple-200 text-sm rounded-full border border-purple-600/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-purple-300 mb-2 block">Content Body</label>
                <div className="bg-purple-900/50 border border-purple-600/50 rounded-lg p-4 text-white whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {selectedContent.content_body || 'No content available'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedContent.created_at && (
                  <div>
                    <label className="text-purple-300">Created</label>
                    <div className="text-white">{new Date(selectedContent.created_at).toLocaleString()}</div>
                  </div>
                )}
                {selectedContent.updated_at && (
                  <div>
                    <label className="text-purple-300">Last Updated</label>
                    <div className="text-white">{new Date(selectedContent.updated_at).toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Content Modal */}
      {showEditModal && editingContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-800/95 to-indigo-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-600/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-purple-900/95 backdrop-blur-sm border-b border-purple-600/50 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Edit Content</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingContent(null);
                  setFormData({
                    title: "",
                    type: "",
                    category: "",
                    content_body: "",
                    tags: [],
                    status: "draft",
                    thumbnail_url: "",
                  });
                }}
                className="p-2 text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter content title"
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    placeholder="e.g., Lead Generation, Property Marketing"
                    className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Content Body <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.content_body}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content_body: e.target.value,
                    }))
                  }
                  placeholder="Enter your content here..."
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-700/50 text-purple-200 text-sm rounded-full border border-purple-600/30 flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  onKeyDown={handleTagInput}
                  placeholder="Type a tag and press Enter"
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail_url: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleSubmitContent}
                  disabled={isUpdatingContent}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingContent ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Content
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingContent(null);
                    setFormData({
                      title: "",
                      type: "",
                      category: "",
                      content_body: "",
                      tags: [],
                      status: "draft",
                      thumbnail_url: "",
                    });
                  }}
                  className="px-6 py-2 bg-purple-800/50 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {showTemplatePreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-800/95 to-indigo-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-600/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-purple-900/95 backdrop-blur-sm border-b border-purple-600/50 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">{selectedTemplate.name}</h2>
              <button
                onClick={() => {
                  setShowTemplatePreview(false);
                  setSelectedTemplate(null);
                }}
                className="p-2 text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-purple-300">Type</label>
                  <div className="mt-1 flex items-center gap-2">
                    {getTypeIcon(selectedTemplate.type)}
                    <span className="text-white capitalize">{selectedTemplate.type?.replace("_", " ")}</span>
                  </div>
                </div>
                {selectedTemplate.category && (
                  <div>
                    <label className="text-sm font-medium text-purple-300">Category</label>
                    <div className="mt-1 text-white">{selectedTemplate.category}</div>
                  </div>
                )}
                {selectedTemplate.rating !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-purple-300">Rating</label>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white">{selectedTemplate.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                )}
                {selectedTemplate.usage_count !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-purple-300">Usage Count</label>
                    <div className="mt-1 text-white">{selectedTemplate.usage_count?.toLocaleString() || 0} times</div>
                  </div>
                )}
              </div>

              {selectedTemplate.is_predefined && (
                <div className="px-3 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                  <span className="text-sm text-blue-300 font-medium">Predefined Template</span>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-purple-300 mb-2 block">Template Body</label>
                <div className="bg-purple-900/50 border border-purple-600/50 rounded-lg p-4 text-white whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {selectedTemplate.template_body ? (
                    selectedTemplate.template_body.split(/(\{\{[^}]+\}\})/g).map((part, index) => {
                      if (part.match(/\{\{[^}]+\}\}/)) {
                        return (
                          <span key={index} className="bg-yellow-500/30 text-yellow-200 px-1 rounded font-mono">
                            {part}
                          </span>
                        );
                      }
                      return <span key={index}>{part}</span>;
                    })
                  ) : (
                    'No template body available'
                  )}
                </div>
              </div>

              {selectedTemplate.variables && Object.keys(selectedTemplate.variables).length > 0 && (
                <div>
                  <label className="text-sm font-medium text-purple-300 mb-2 block">Variables</label>
                  <div className="bg-purple-900/50 border border-purple-600/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedTemplate.variables).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-purple-300 font-mono text-sm">{key}:</span>
                          <span className="text-white text-sm">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedTemplate.created_at && (
                  <div>
                    <label className="text-purple-300">Created</label>
                    <div className="text-white">{new Date(selectedTemplate.created_at).toLocaleString()}</div>
                  </div>
                )}
                {selectedTemplate.updated_at && (
                  <div>
                    <label className="text-purple-300">Last Updated</label>
                    <div className="text-white">{new Date(selectedTemplate.updated_at).toLocaleString()}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={async () => {
                    try {
                      const variables = selectedTemplate.variables || {};
                      const response = await contentAPI.useTemplate(selectedTemplate.id, variables, {
                        title: `${selectedTemplate.name} - Content`,
                        status: 'draft'
                      });
                      if (response.status === 'success') {
                        toast.success('Content created from template successfully');
                        setShowTemplatePreview(false);
                        setSelectedTemplate(null);
                        setActiveTab('library');
                        refetchContent();
                      }
                    } catch (error) {
                      toast.error('Failed to use template');
                    }
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Use Template
                </button>
                <button
                  onClick={() => {
                    setShowTemplatePreview(false);
                    setSelectedTemplate(null);
                  }}
                  className="px-6 py-2 bg-purple-800/50 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Content Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-800/95 to-indigo-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-600/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-purple-900/95 backdrop-blur-sm border-b border-purple-600/50 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Schedule Content</h2>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setScheduleFormData({
                    content_id: "",
                    scheduled_date: "",
                    scheduled_time: "",
                    status: "scheduled",
                  });
                }}
                className="p-2 text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Select Content <span className="text-red-400">*</span>
                </label>
                <select
                  value={scheduleFormData.content_id}
                  onChange={(e) =>
                    setScheduleFormData((prev) => ({ ...prev, content_id: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select content...</option>
                  {contentItems && contentItems.length > 0 ? (
                    contentItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title} ({item.type})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No content available</option>
                  )}
                </select>
                {(!contentItems || contentItems.length === 0) && (
                  <p className="text-xs text-purple-300 mt-1">
                    No content available. Create content first.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Scheduled Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={scheduleFormData.scheduled_date}
                    onChange={(e) =>
                      setScheduleFormData((prev) => ({ ...prev, scheduled_date: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={scheduleFormData.scheduled_time}
                    onChange={(e) =>
                      setScheduleFormData((prev) => ({ ...prev, scheduled_time: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Status
                </label>
                <select
                  value={scheduleFormData.status}
                  onChange={(e) =>
                    setScheduleFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleScheduleContent}
                  disabled={isSubmittingSchedule}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingSchedule ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Schedule Content
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setScheduleFormData({
                      content_id: "",
                      scheduled_date: "",
                      scheduled_time: "",
                      status: "scheduled",
                    });
                  }}
                  className="px-6 py-2 bg-purple-800/50 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {showEditScheduleModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-800/95 to-indigo-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-600/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-purple-900/95 backdrop-blur-sm border-b border-purple-600/50 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Edit Schedule</h2>
              <button
                onClick={() => {
                  setShowEditScheduleModal(false);
                  setSelectedSchedule(null);
                  setScheduleFormData({
                    content_id: "",
                    scheduled_date: "",
                    scheduled_time: "",
                    status: "scheduled",
                  });
                }}
                className="p-2 text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Content
                </label>
                <div className="px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white">
                  {selectedSchedule.content_title || 'N/A'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Scheduled Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={scheduleFormData.scheduled_date}
                    onChange={(e) =>
                      setScheduleFormData((prev) => ({ ...prev, scheduled_date: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={scheduleFormData.scheduled_time}
                    onChange={(e) =>
                      setScheduleFormData((prev) => ({ ...prev, scheduled_time: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Status
                </label>
                <select
                  value={scheduleFormData.status}
                  onChange={(e) =>
                    setScheduleFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleUpdateSchedule}
                  disabled={isSubmittingSchedule}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingSchedule ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Schedule
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowEditScheduleModal(false);
                    setSelectedSchedule(null);
                    setScheduleFormData({
                      content_id: "",
                      scheduled_date: "",
                      scheduled_time: "",
                      status: "scheduled",
                    });
                  }}
                  className="px-6 py-2 bg-purple-800/50 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Creation Form Modal */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-800/95 to-indigo-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-600/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-purple-900/95 backdrop-blur-sm border-b border-purple-600/50 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Create Template</h2>
              <button
                onClick={() => {
                  setShowTemplateForm(false);
                  setTemplateFormData({
                    name: "",
                    type: "",
                    category: "",
                    template_body: "",
                    variables: {},
                  });
                }}
                className="p-2 text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Template Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={templateFormData.name}
                  onChange={(e) =>
                    setTemplateFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Welcome Email Template"
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Template Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={templateFormData.type}
                    onChange={(e) =>
                      setTemplateFormData((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select type</option>
                    <option value="email">Email</option>
                    <option value="social">Social Media</option>
                    <option value="sms">SMS</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="email_sequence">Email Sequence</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={templateFormData.category}
                    onChange={(e) =>
                      setTemplateFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    placeholder="e.g., Welcome, Marketing"
                    className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Template Body <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={templateFormData.template_body}
                  onChange={(e) =>
                    setTemplateFormData((prev) => ({ ...prev, template_body: e.target.value }))
                  }
                  placeholder="Enter template body. Use {{variable_name}} for variables, e.g., Hello {{name}}, welcome to {{company}}!"
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={10}
                />
                <p className="text-xs text-purple-300 mt-1">
                  Use double curly braces for variables: {"{{variable_name}}"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Variables (JSON format)
                </label>
                <textarea
                  value={JSON.stringify(templateFormData.variables, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setTemplateFormData((prev) => ({ ...prev, variables: parsed }));
                    } catch {
                      // Invalid JSON, keep as is for now
                    }
                  }}
                  placeholder='{"name": "string", "company": "string"}'
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  rows={4}
                />
                <p className="text-xs text-purple-300 mt-1">
                  Define variables as JSON object. Keys should match variable names in template body.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleSubmitTemplate}
                  disabled={isSubmittingTemplate}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingTemplate ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Template
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowTemplateForm(false);
                    setTemplateFormData({
                      name: "",
                      type: "",
                      category: "",
                      template_body: "",
                      variables: {},
                    });
                  }}
                  className="px-6 py-2 bg-purple-800/50 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagementPage;
