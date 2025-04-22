import React, { useState } from 'react';
import { useGlobalContext } from '@/context/globalContext';
import { useJobsContext } from '@/context/jobsContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Input } from './ui/input';

const JobFormSteps = () => {
  const {
    jobTitle,
    jobDescription,
    salaryType,
    activeEmploymentTypes,
    salary,
    location,
    skills,
    negotiable,
    tags,
    resetJobForm,
    handleTitleChange,
    handleDescriptionChange,
    handleSalaryChange,
    setActiveEmploymentTypes,
    setSalaryType,
    setNegotiable,
    setTags,
    setSkills,
    setLocation,
  } = useGlobalContext();
  
  const { createJob } = useJobsContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [newSkill, setNewSkill] = useState('');
  const [newTag, setNewTag] = useState('');

  const steps = [
    'Job Information',
    'Job Details',
    'Skills & Tags',
    'Location',
    'Review'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    createJob({
      title: jobTitle,
      description: jobDescription,
      salaryType,
      jobType: activeEmploymentTypes,
      salary,
      location: `${location.address ? location.address + ", " : ""}${
        location.city ? location.city + ", " : ""
      }${location.country}`,
      skills,
      negotiable,
      tags,
    });

    resetJobForm();
    setCurrentStep(0);
  };

  const handleEmploymentTypeChange = (type) => {
    if (activeEmploymentTypes.includes(type)) {
      setActiveEmploymentTypes(activeEmploymentTypes.filter(t => t !== type));
    } else {
      setActiveEmploymentTypes([...activeEmploymentTypes, type]);
    }
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Job Information
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input 
                id="jobTitle" 
                value={jobTitle} 
                onChange={handleTitleChange} 
                placeholder="e.g. Senior Frontend Developer"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Employment Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="fullTime" 
                    checked={activeEmploymentTypes.includes('Full Time')}
                    onCheckedChange={() => handleEmploymentTypeChange('Full Time')} 
                  />
                  <Label htmlFor="fullTime">Full Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="partTime" 
                    checked={activeEmploymentTypes.includes('Part Time')}
                    onCheckedChange={() => handleEmploymentTypeChange('Part Time')} 
                  />
                  <Label htmlFor="partTime">Part Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="contract" 
                    checked={activeEmploymentTypes.includes('Contract')}
                    onCheckedChange={() => handleEmploymentTypeChange('Contract')} 
                  />
                  <Label htmlFor="contract">Contract</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="internship" 
                    checked={activeEmploymentTypes.includes('Internship')}
                    onCheckedChange={() => handleEmploymentTypeChange('Internship')} 
                  />
                  <Label htmlFor="internship">Internship</Label>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 1: // Job Details
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="jobDescription">Job Description</Label>
              <textarea 
                id="jobDescription" 
                value={jobDescription} 
                onChange={handleDescriptionChange} 
                placeholder="Describe the job responsibilities and requirements"
                className="w-full h-32 p-2 mt-1 border rounded-md"
              />
            </div>
            
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input 
                id="salary" 
                type="number" 
                value={salary} 
                onChange={handleSalaryChange} 
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="salaryType">Salary Type</Label>
              <select 
                id="salaryType" 
                value={salaryType} 
                onChange={(e) => setSalaryType(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="Year">Per Year</option>
                <option value="Month">Per Month</option>
                <option value="Week">Per Week</option>
                <option value="Hour">Per Hour</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="negotiable" 
                checked={negotiable}
                onCheckedChange={(checked) => setNegotiable(checked)} 
              />
              <Label htmlFor="negotiable">Salary is negotiable</Label>
            </div>
          </div>
        );
      
      case 2: // Skills & Tags
        return (
          <div className="space-y-6">
            <div>
              <Label>Skills Required</Label>
              <div className="flex mt-1">
                <Input 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  placeholder="e.g. React"
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  onClick={addSkill}
                  className="ml-2"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <button 
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-xs font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Job Tags</Label>
              <div className="flex mt-1">
                <Input 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)} 
                  placeholder="e.g. Remote"
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  className="ml-2"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-xs font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 3: // Location
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country" 
                value={location.country} 
                onChange={(e) => setLocation({...location, country: e.target.value})} 
                placeholder="e.g. United States"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                value={location.city} 
                onChange={(e) => setLocation({...location, city: e.target.value})} 
                placeholder="e.g. San Francisco"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address (Optional)</Label>
              <Input 
                id="address" 
                value={location.address} 
                onChange={(e) => setLocation({...location, address: e.target.value})} 
                placeholder="e.g. 123 Main St"
                className="mt-1"
              />
            </div>
          </div>
        );
        
      case 4: // Review
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Job Post</h3>
            
            <div>
              <h4 className="font-medium">Job Title</h4>
              <p>{jobTitle || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Employment Type</h4>
              <div className="flex flex-wrap gap-2">
                {activeEmploymentTypes.length > 0 ? 
                  activeEmploymentTypes.map((type, index) => (
                    <Badge key={index} variant="outline">{type}</Badge>
                  )) : 
                  <p>Not specified</p>
                }
              </div>
            </div>
            
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="whitespace-pre-wrap">{jobDescription || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Salary</h4>
              <p>
                ${salary} per {salaryType.toLowerCase()}
                {negotiable && ' (Negotiable)'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? 
                  skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  )) : 
                  <p>Not specified</p>
                }
              </div>
            </div>
            
            <div>
              <h4 className="font-medium">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? 
                  tags.map((tag, index) => (
                    <Badge key={index}>{tag}</Badge>
                  )) : 
                  <p>Not specified</p>
                }
              </div>
            </div>
            
            <div>
              <h4 className="font-medium">Location</h4>
              <p>
                {location.address ? `${location.address}, ` : ''}
                {location.city ? `${location.city}, ` : ''}
                {location.country || 'Not specified'}
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Steps Progress */}
      <div className="mb-6">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                  ${index <= currentStep ? 'bg-[#7263F3] text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                {index + 1}
              </div>
              <span className="text-xs text-center">{step}</span>
              {index < steps.length - 1 && (
                <div 
                  className={`h-1 w-full mt-4 
                    ${index < currentStep ? 'bg-[#7263F3]' : 'bg-gray-200'}`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button 
            type="button" 
            onClick={nextStep}
          >
            Next
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={handleSubmit}
          >
            Post Job
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobFormSteps; 