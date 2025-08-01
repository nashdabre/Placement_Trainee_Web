import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { generateCareerPlan } from "../services/careerplannerservice";
import TimelinePlanner from './TimelinePlanner';
import { Search, Calendar, Sparkles, Lightbulb } from "lucide-react";
import {
  POPULAR_CAREERS,
  TIMELINE_CONFIG,
  VALIDATION_MESSAGES,
  CAREER_PLANNING,
} from "./../utils/constants";


const STORAGE_KEYS = {
  CAREER_PLAN: 'career_plan_data'
};

const APP_CONFIG = {
  MAX_PLAN_HISTORY: 10
};


  
const CareerPlanner = () => {
  const location = useLocation();
  const [careerPlan, setCareerPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [error, setError] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
 

  // Load saved plans on component mount
  useEffect(() => {
    const savedPlans = localStorage.getItem(STORAGE_KEYS.CAREER_PLAN);
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        setPlanHistory(parsedPlans);
      } catch (e) {
        console.error('Error loading saved plans:', e);
      }
    }

    // Check if a plan was selected from Dashboard
    if (location.state?.selectedPlan) {
      const selectedPlan = location.state.selectedPlan;
      setCareerPlan(selectedPlan.plan);
      setTargetRole(selectedPlan.role);
      setError(null);
      
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleGeneratePlan = async (role, months) => {
    setIsLoading(true);
    setError(null);
    setTargetRole(role);
    
    try {
      // Convert months to weeks for weekly planning (4 weeks per month)
      const weeks = months * 4;
      const plan = await generateCareerPlan(role, weeks, 'weekly');
      setCareerPlan(plan);
      
      // Save to history
      const newPlan = {
        id: Date.now(),
        role,
        months,
        weeks,
        plan,
        createdAt: new Date().toISOString()
      };
      
      const updatedHistory = [newPlan, ...planHistory].slice(0, APP_CONFIG.MAX_PLAN_HISTORY);
      setPlanHistory(updatedHistory);
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.CAREER_PLAN, JSON.stringify(updatedHistory));
      
    } catch (err) {
      console.error('Career plan generation error:', err);
      
      // Handle specific error types based on the error message
      let errorMessage = 'Failed to generate career plan. Please try again.';
      
      if (err.message.includes('API key is missing') || err.message.includes('API key')) {
        errorMessage = 'Currently server is down, we will get back to you soon.';
      } else if (err.message.includes('quota') || err.message.includes('limit')) {
        errorMessage = 'Currently server is down, we will get back to you soon.';
      } else if (err.message.includes('network') || err.message.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.message.includes('Invalid API key')) {
        errorMessage = 'There might be some issue, we are on it.';
      } else if (err.message) {
        errorMessage = err.message; // Use the specific error message from geminiService
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPreviousPlan = (historyItem) => {
    setCareerPlan(historyItem.plan);
    setTargetRole(historyItem.role);
    setError(null);
  };
  //------------------------------------------------------------
  const [formData, setFormData] = useState({
    role: '',
    months: CAREER_PLANNING.DEFAULT_MONTHS
  });
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState('TECHNOLOGY');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.role.trim()) {
      alert(VALIDATION_MESSAGES.ROLE_REQUIRED);
      return;
    }
    
    if (formData.role.trim().length < 2) {
      alert(VALIDATION_MESSAGES.ROLE_MIN_LENGTH);
      return;
    }
    
    if (formData.months < CAREER_PLANNING.MIN_MONTHS || formData.months > CAREER_PLANNING.MAX_MONTHS) {
      alert(VALIDATION_MESSAGES.MONTHS_INVALID);
      return;
    }
    
    handleGeneratePlan(formData.role, formData.months);
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, role: suggestion });
    setShowSuggestions(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Create Your Career Plan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get a personalized week-by-week career roadmap for any profession you dream of pursuing
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
           <form onSubmit={handleSubmit} className="space-y-6">
            {/* Career Role Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Search className="w-4 h-4 text-blue-500" />
                What do you want to become?
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="Type any career/role you want to pursue..."
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    minLength="2"
                  />
                </div>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="hidden sm:inline">{showSuggestions ? "Hide Ideas" : "Need Ideas?"}</span>
                  <span className="sm:hidden">💡</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <span>✨</span>
                <p>Enter any career goal - from traditional roles to emerging fields!</p>
              </div>

              {showSuggestions && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.keys(POPULAR_CAREERS).map((category) => (
                      <button
                        key={category}
                        type="button"
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          activeCategory === category
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200"
                        }`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category.replace("_", " ")}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {POPULAR_CAREERS[activeCategory]?.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="p-2 text-sm text-left bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Selection */}
            <div className="space-y-2">
              <label htmlFor="months" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-blue-500" />
                Time Frame
              </label>
              <select
                id="months"
                value={formData.months}
                onChange={(e) =>
                  setFormData({ ...formData, months: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
              >
                {Object.entries(TIMELINE_CONFIG.MONTH_LABELS).map(
                  ([months, label]) => (
                    <option key={months} value={months}>
                      {months} Month{months > 1 ? "s" : ""} - {label} (
                      {months * 4} weeks)
                    </option>
                  )
                )}
              </select>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <span>📅</span>
                <p>Your plan will be broken down into weekly milestones</p>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Your Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate My Career Plan</span>
                </>
              )}
            </button>
          </form>
            </div>
          </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-lg">⚠️</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-red-800 font-semibold mb-1">Oops! Something went wrong</h4>
                  <p className="text-red-700 mb-2">{error}</p>
                  <small className="text-red-600">💡 Don't worry, you can try again or the system will use a fallback plan.</small>
                </div>
                <button 
                  className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors" 
                  onClick={() => setError(null)}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plan History */}
        {planHistory.length > 0 && !careerPlan && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Your Previous Plans</h3>
                    <p className="text-blue-100">Pick up where you left off</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white font-semibold">{planHistory.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {planHistory.slice(0, 6).map((item, index) => (
                    <div 
                      key={item.id} 
                      className="group cursor-pointer bg-gray-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleLoadPreviousPlan(item)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                            {item.role}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.months}M Plan
                            </span>
                            {index === 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Recent
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📅</span>
                          <span>{item.weeks} weeks roadmap</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📊</span>
                          <span>Strategic milestones</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Created {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Planner */}
        {careerPlan && (
          <TimelinePlanner 
            careerPlan={careerPlan}
            targetRole={targetRole}
            isWeekly={true}
          />
        )}
        </div>
      </div>
    </>
  );
};

export default CareerPlanner;
