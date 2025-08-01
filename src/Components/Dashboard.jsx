import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { StorageUtils } from '../utils/storage'

const STORAGE_KEYS = {
  CAREER_PLAN: 'career_plan_data'
};


const Dashboard = () => {
  const navigate = useNavigate();
  const [planHistory, setPlanHistory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load saved plans on component mount
  useEffect(() => {
    const savedPlans = StorageUtils.getJSON(STORAGE_KEYS.CAREER_PLAN);
    
    if (savedPlans && Array.isArray(savedPlans) && savedPlans.length > 0) {
      // Validate each plan has required properties
      const validPlans = savedPlans.filter(plan => {
        const isValid = plan && 
                       typeof plan === 'object' && 
                       plan.id && 
                       plan.role && 
                       plan.createdAt;
        
        return isValid;
      });
      
      setPlanHistory(validPlans);
    }
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, Math.ceil(planHistory.length / 2)));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(planHistory.length / 2)) % Math.ceil(planHistory.length / 2));
  };

  const handleLoadPlan = (plan) => {
    // Navigate to career planner with the selected plan
    navigate('/career-planner', { state: { selectedPlan: plan } });
  };

  return (
    <>
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-center text-base/7 font-semibold text-indigo-600">Placement Trainee</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
          Where preparation meets opportunity
        </p>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <div className="relative lg:row-span-2 ">  {/*this is first card */}
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl shadow-lg shadow-black  " />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3    sm:px-10 sm:pt-8 sm:pb-0">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md" >
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="white"/>
                      <path d="M19 15L20.09 18.26L23 19L20.09 19.74L19 23L17.91 19.74L15 19L17.91 18.26L19 15Z" fill="white"/>
                      <path d="M5 15L6.09 18.26L9 19L6.09 19.74L5 23L3.91 19.74L1 19L3.91 18.26L5 15Z" fill="white"/>
                    </svg>
                    </div>

                </div>
                 <p className="mt-2 text-lg  sm:pt-5 text-center font-medium tracking-tight text-gray-950 max-lg:text-center">AI Career Planner</p>
                <p className="mt-2 max-w-lg text-center sm:pb-5 text-sm/6 text-gray-600 max-lg:text-center">
                  Transform your career aspirations into a strategic, week-by-week roadmap powered by  AI
                </p>
                <div className=" flex flex-col gap-3 items-center justify-center">
                  <div className="h-8 w-47 flex items-center justify-center bg-blue-100 text-blue-500 outline-1 rounded-full font-small shadow-sm">  <span className="badge-icon">⚡</span>Instant AI Anaylzes</div>
                  <div className="h-8 w-47 flex items-center justify-center bg-blue-100  text-blue-500 outline-1 rounded-full font-small shadow-sm"> <span className="badge-icon">📈</span>Weekly Milestones</div>
                  <div className="h-8 w-47 flex items-center justify-center bg-blue-100  text-blue-500 outline-1 rounded-full font-small shadow-sm"><span className="badge-icon">🎯</span>Personalized Path</div>
              
                   <button className="bg-gradient-to-br from-blue-500 to-purple-600 shadow-md text-white px-6 py-2  rounded-lg shadow-black hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out" 
                    onClick={() => navigate('/career-planner')}>Create Your Planner</button>

                </div>

                {/* Past Plans Slider */}
                {planHistory.length > 0 && (
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Plans
                      </h4>
                      {planHistory.length > 2 && (
                        <div className="flex gap-1">
                          <button
                            onClick={prevSlide}
                            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <ChevronLeft className="w-3 h-3 text-gray-600" />
                          </button>
                          <button
                            onClick={nextSlide}
                            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="overflow-hidden">
                      <div 
                        className="flex transition-transform duration-300 ease-in-out gap-3"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                      >
                        {planHistory.slice(0, 6).map((plan, index) => {
                          // Defensive rendering - ensure plan has required properties
                          if (!plan || !plan.id || !plan.role) {
                            return null;
                          }
                          
                          return (
                          <div
                            key={plan.id}
                            className="p-3 flex-shrink-0 w-full cursor-pointer group"
                            onClick={() => handleLoadPlan(plan)}
                          >
                            <div className=" bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg p-3 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900 text-sm truncate flex-1 group-hover:text-blue-700">
                                  {plan.role || 'Unknown Role'}
                                </h5>
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full ml-2">
                                  {plan.months || 0}M
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {plan.createdAt 
                                    ? new Date(plan.createdAt).toLocaleDateString() 
                                    : 'Unknown Date'
                                  }
                                </span>
                                <span className="text-gray-400">•</span>
                                <span>{plan.weeks || 0} weeks</span>
                              </div>
                            </div>
                          </div>
                          );
                        }).filter(Boolean)}
                      </div>
                    </div>
                    
                    {planHistory.length > 6 && (
                      <div className="text-center mt-3">
                        <button 
                          onClick={() => navigate('/career-planner')}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View all {planHistory.length} plans →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Show when no plans exist */}
                {planHistory.length === 0 && (
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        No career plans yet. Create your first plan to see them here!
                      </p>
                    </div>
                  </div>
                )}
                
              </div>
             
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl" />
          </div> {/*this end of  first card */}
          {/*this start of  second card */}
          <div className="relative max-lg:row-start-1">
            <div className="absolute inset-px  bg-white " />
            <div className="relative flex h-full flex-col overflow-hidden ">
              <div className="px-8 pt-8 pb-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Performance</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit.
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-black hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out">sign up</button>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl" />
          </div>
          {/*this end of  second card card */}
          {/*third card starts here */}
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">{/*know what this line do in actual */}
            <div className="absolute inset-px  bg-white" />
            <div className="relative flex h-full flex-col overflow-hidden">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Security</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.
                </p>
              </div>
              <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                  className="h-[min(152px,40cqw)] object-cover"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
          </div>
          {/*this end of  third card */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-r-4xl" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Powerful APIs
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales gravida.
                </p>
              </div>
             
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl" />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Dashboard
