import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchIdeas = async () => {
  const { data } = await axios.get('/api/ideas');
  return data;
};

const Ideas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: ideas, isLoading, isError } = useQuery(['ideas'], fetchIdeas);

  const categories = [
    'all',
    'FinTech',
    'Sustainability',
    'Healthcare',
    'Education',
    'Entertainment',
    'E-commerce'
  ];

  const filteredIdeas = (ideas || []).filter((idea: any) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || idea.industry === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Ideas</h1>
        <p className="text-gray-600">Discover innovative startup ideas from our community</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-12 text-gray-500">Loading ideas...</div>
      )}
      {isError && (
        <div className="text-center py-12 text-red-500">Failed to load ideas. Please try again later.</div>
      )}

      {/* Ideas Grid */}
      {!isLoading && !isError && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No ideas found.</div>
          ) : (
            filteredIdeas.map((idea: any) => (
              <div key={idea.id} className="card-hover">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {idea.industry || 'General'}
                  </span>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <span>↑ {idea.upvoteCount}</span>
                    <span>💬 {idea.comments?.length || 0}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link to={`/ideas/${idea.slug}`} className="hover:text-primary-600 transition-colors">
                    {idea.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {idea.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags && idea.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    by {idea.author?.firstName} {idea.author?.lastName}
                  </span>
                  <Link
                    to={`/ideas/${idea.slug}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Load More */}
      {/* <div className="text-center mt-12">
        <button className="btn-secondary">
          Load More Ideas
        </button>
      </div> */}
    </div>
  );
};

export default Ideas; 