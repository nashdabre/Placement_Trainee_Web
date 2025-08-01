// Career Planning Constants

export const POPULAR_CAREERS = {
  'Technology': [
    'Software Developer',
    'Data Scientist', 
    'UI/UX Designer',
    'DevOps Engineer',
    'Product Manager',
    'Cybersecurity Analyst',
    'Mobile App Developer',
    'Cloud Architect'
  ],
  'Business': [
    'Business Analyst',
    'Project Manager',
    'Marketing Manager', 
    'Sales Manager',
    'Financial Analyst',
    'Operations Manager',
    'Human Resources Manager',
    'Consultant'
  ],
  'Healthcare': [
    'Registered Nurse',
    'Physical Therapist',
    'Medical Assistant',
    'Healthcare Administrator',
    'Pharmacist',
    'Medical Technologist',
    'Occupational Therapist',
    'Clinical Research Coordinator'
  ],
  'Engineering': [
    'Mechanical Engineer',
    'Electrical Engineer',
    'Civil Engineer',
    'Chemical Engineer',
    'Industrial Engineer',
    'Aerospace Engineer',
    'Environmental Engineer',
    'Biomedical Engineer'
  ],
  'Creative': [
    'Graphic Designer',
    'Content Writer',
    'Video Editor',
    'Social Media Manager',
    'Photographer',
    'Web Designer',
    'Digital Marketing Specialist',
    'Brand Manager'
  ]
};

export const TIMELINE_CONFIG = {
  MONTH_LABELS: {
    1: '1 month (Quick start)',
    2: '2 months (Accelerated)',
    3: '3 months (Fast transition)',
    4: '4 months (Solid foundation)',
    5: '5 months (Focused learning)',
    6: '6 months (Standard)',
    12: '12 months (Comprehensive)',
    18: '18 months (Extensive)',
    24: '24 months (Complete transformation)'
  }
};

export const VALIDATION_MESSAGES = {
  ROLE_REQUIRED: 'Please enter the career role you want to transition to.',
  ROLE_MIN_LENGTH: 'Career role must be at least 3 characters long.',
  MONTHS_INVALID: 'Please select a valid timeline between 1-24 months.'
};

export const CAREER_PLANNING = {
  DEFAULT_MONTHS: 6,
  MIN_MONTHS: 1,
  MAX_MONTHS: 24
};

// Export as default object as well for convenience
const constants = {
  POPULAR_CAREERS,
  TIMELINE_CONFIG,
  VALIDATION_MESSAGES,
  CAREER_PLANNING
};

export default constants;
