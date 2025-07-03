import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateIdea: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problem: '',
    solution: '',
    targetMarket: '',
    businessModel: '',
    tags: '',
    industry: '',
    technology: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        '/api/ideas',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Idea created successfully!');
      navigate('/ideas');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create idea');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Share Your Idea</h1>
          <p className="text-gray-600">Tell the community about your startup idea and get feedback from experts.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Idea Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-field"
                  placeholder="Give your idea a catchy title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Brief Description *
                </label>
                <textarea
                  id="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field"
                  placeholder="Describe your idea in one sentence"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select Industry</option>
                    <option value="FinTech">FinTech</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="technology" className="block text-sm font-medium text-gray-700 mb-2">
                    Technology
                  </label>
                  <input
                    type="text"
                    id="technology"
                    value={formData.technology}
                    onChange={(e) => setFormData({...formData, technology: e.target.value})}
                    className="input-field"
                    placeholder="e.g., AI, Blockchain, Mobile"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Problem & Solution</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Statement *
                </label>
                <textarea
                  id="problem"
                  required
                  rows={4}
                  value={formData.problem}
                  onChange={(e) => setFormData({...formData, problem: e.target.value})}
                  className="input-field"
                  placeholder="What problem does your idea solve?"
                />
              </div>

              <div>
                <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Solution *
                </label>
                <textarea
                  id="solution"
                  required
                  rows={4}
                  value={formData.solution}
                  onChange={(e) => setFormData({...formData, solution: e.target.value})}
                  className="input-field"
                  placeholder="How does your idea solve this problem?"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Market & Business</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Market
                </label>
                <textarea
                  id="targetMarket"
                  rows={3}
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({...formData, targetMarket: e.target.value})}
                  className="input-field"
                  placeholder="Who is your target audience?"
                />
              </div>

              <div>
                <label htmlFor="businessModel" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Model
                </label>
                <textarea
                  id="businessModel"
                  rows={3}
                  value={formData.businessModel}
                  onChange={(e) => setFormData({...formData, businessModel: e.target.value})}
                  className="input-field"
                  placeholder="How will you make money?"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="input-field"
                  placeholder="Enter tags separated by commas (e.g., AI, Finance, Mobile)"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/ideas')}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Creating...' : 'Create Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIdea; 