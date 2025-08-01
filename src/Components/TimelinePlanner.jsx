import React from 'react';

const TimelinePlanner = ({ careerPlan, targetRole, isWeekly }) => {
  if (!careerPlan || !Array.isArray(careerPlan)) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No career plan available</h3>
          <p className="text-gray-600">Generate a career plan to see your personalized timeline</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎯</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {targetRole} Career Plan
        </h1>
        <p className="text-lg text-gray-600">
          Your {isWeekly ? 'weekly' : 'monthly'} roadmap to success
        </p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
          <span className="text-blue-600 font-medium">
            {careerPlan.length} {isWeekly ? 'weeks' : 'months'} journey
          </span>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200"></div>
        
        {careerPlan.map((item, index) => {
          const timeLabel = isWeekly ? `Week ${item.week || index + 1}` : `Month ${item.month || index + 1}`;
          const isLast = index === careerPlan.length - 1;
          
          return (
            <div key={index} className="relative pb-8 sm:pb-12">
              {/* Timeline Node */}
              <div className="absolute left-2 sm:left-6 w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-lg z-10">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-75"></div>
              </div>
              
              {/* Timeline Card */}
              <div className="ml-12 sm:ml-20">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                          {targetRole.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 font-medium">{targetRole} Development</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                        <span className="text-blue-500">📅</span>
                        <span className="font-semibold text-gray-900">{timeLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Description */}
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Skills Section */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-blue-500">🎯</span>
                          <h4 className="font-semibold text-gray-900">Skills to Learn</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.skills.map((skill, skillIndex) => (
                            <div 
                              key={skillIndex} 
                              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                            >
                              <span className="text-green-500 text-sm">✓</span>
                              <span className="font-medium">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects Section */}
                    {item.projects && item.projects.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-purple-500">🚀</span>
                          <h4 className="font-semibold text-gray-900">Projects to Build</h4>
                        </div>
                        <div className="space-y-2">
                          {item.projects.map((project, projectIndex) => (
                            <div 
                              key={projectIndex} 
                              className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200"
                            >
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{project}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources Section */}
                    {item.resources && item.resources.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-orange-500">📖</span>
                          <h4 className="font-semibold text-gray-900">Learning Resources</h4>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {item.resources.map((resource, resourceIndex) => (
                            <div 
                              key={resourceIndex} 
                              className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                            >
                              <span className="text-orange-500">⭐</span>
                              <span className="text-gray-700">{resource}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Milestone Section */}
                    {item.milestone && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white">🏆</span>
                          </div>
                          <div>
                            <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">
                              Milestone
                            </span>
                            <p className="text-gray-900 font-medium">
                              {item.milestone}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Progress Indicator */}
                {!isLast && (
                  <div className="flex items-center gap-2 mt-4 ml-4 text-gray-400">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Timeline End */}
        <div className="absolute left-2 sm:left-6 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg z-10">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>
      
      {/* Completion Message */}
      <div className="text-center mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎉</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Journey Complete!</h3>
        <p className="text-gray-600">
          Congratulations on completing your {targetRole} career roadmap. Keep learning and growing!
        </p>
      </div>
    </div>
  );
};

export default TimelinePlanner;
