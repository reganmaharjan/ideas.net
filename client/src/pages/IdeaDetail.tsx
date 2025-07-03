import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const fetchIdea = async (slug: string) => {
  const { data } = await axios.get(`/api/ideas/${slug}`);
  return data;
};

const fetchComments = async (ideaId: string) => {
  const { data } = await axios.get(`/api/comments/idea/${ideaId}`);
  return data;
};

const fetchUserVotes = async (ideaId: string, token: string) => {
  const { data } = await axios.get(`/api/votes/idea/${ideaId}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const IdeaDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, token } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: idea, isLoading, isError } = useQuery(['idea', slug], () => fetchIdea(slug!), {
    enabled: !!slug,
  });

  const { data: comments, isLoading: isCommentsLoading, isError: isCommentsError } = useQuery(
    ['comments', idea?.id],
    () => fetchComments(idea.id),
    { enabled: !!idea?.id }
  );

  // Fetch user's votes for this idea
  const { data: userVotes, refetch: refetchUserVotes } = useQuery(
    ['userVotes', idea?.id, user?.id],
    () => fetchUserVotes(idea.id, token!),
    { enabled: !!idea?.id && !!user?.id && !!token }
  );

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsCommentLoading(true);
    try {
      await axios.post(
        '/api/comments',
        {
          ideaId: idea.id,
          content: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommentText('');
      queryClient.invalidateQueries(['comments', idea.id]);
    } catch (error) {
      // Optionally show error toast
    } finally {
      setIsCommentLoading(false);
    }
  };

  // Voting logic
  const handleVote = async (type: string, voted: boolean) => {
    if (!isAuthenticated) {
      toast.error('Please log in to vote.');
      return;
    }
    setIsVoting(true);
    try {
      if (!voted) {
        await axios.post(
          `/api/votes/idea/${idea.id}`,
          { type },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `/api/votes/idea/${idea.id}`,
          { data: { type }, headers: { Authorization: `Bearer ${token}` } }
        );
      }
      queryClient.invalidateQueries(['idea', slug]);
      refetchUserVotes();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  // Edit/Delete logic
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this idea? This cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/ideas/${idea.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Idea deleted');
      navigate('/ideas');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete idea');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading idea...</div>;
  }
  if (isError || !idea) {
    return (
      <div className="text-center py-12 text-red-500">
        Idea not found.<br />
        <button className="btn-secondary mt-4" onClick={() => navigate('/ideas')}>Back to Ideas</button>
      </div>
    );
  }

  // Voting state helpers
  const hasUpvoted = userVotes?.includes('UPVOTE');
  const hasInvested = userVotes?.includes('INVEST_INTEREST');
  const hasWouldUse = userVotes?.includes('WOULD_USE');

  const isOwner = user && idea.author?.id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{idea.title}</h1>
          <div className="flex flex-wrap gap-2 mb-2">
            {idea.tags && idea.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
            <span>By {idea.author?.firstName} {idea.author?.lastName}</span>
            <span>•</span>
            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
            {idea.industry && <><span>•</span><span>{idea.industry}</span></>}
            {idea.technology && <><span>•</span><span>{idea.technology}</span></>}
          </div>
          {isOwner && (
            <div className="flex gap-2 mt-2">
              <Link to={`/edit/${idea.slug}`} className="btn-secondary">Edit</Link>
              <button onClick={handleDelete} className="btn-danger" disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 mb-4">{idea.description}</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Problem</h3>
              <p className="text-gray-700">{idea.problem}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Solution</h3>
              <p className="text-gray-700">{idea.solution}</p>
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Market & Business</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Target Market</h3>
              <p className="text-gray-700">{idea.targetMarket || <span className="text-gray-400">Not specified</span>}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Business Model</h3>
              <p className="text-gray-700">{idea.businessModel || <span className="text-gray-400">Not specified</span>}</p>
            </div>
          </div>
        </div>

        {/* Voting and validation metrics */}
        <div className="flex items-center gap-6 mb-8">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${hasUpvoted ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-primary-600 border-primary-200 hover:bg-primary-50'}`}
            onClick={() => handleVote('UPVOTE', hasUpvoted)}
            disabled={isVoting}
          >
            <span className="font-bold text-lg">↑</span>
            <span>{idea.upvoteCount}</span>
            <span className="text-sm">Upvote</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${hasInvested ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-200 hover:bg-green-50'}`}
            onClick={() => handleVote('INVEST_INTEREST', hasInvested)}
            disabled={isVoting}
          >
            <span className="font-bold text-lg">$</span>
            <span>{idea.investInterestCount}</span>
            <span className="text-sm">Would Invest</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${hasWouldUse ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
            onClick={() => handleVote('WOULD_USE', hasWouldUse)}
            disabled={isVoting}
          >
            <span className="font-bold text-lg">★</span>
            <span>{idea.wouldUseCount}</span>
            <span className="text-sm">Would Use</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Discussion</h2>
          {isCommentsLoading ? (
            <div className="text-gray-500">Loading comments...</div>
          ) : isCommentsError ? (
            <div className="text-red-500">Failed to load comments.</div>
          ) : (
            <>
              {comments && comments.length > 0 ? (
                <ul className="space-y-6 mb-6">
                  {comments.map((comment: any) => (
                    <li key={comment.id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{comment.author?.username || 'User'}</span>
                        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-gray-700">{comment.content}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 mb-6">No comments yet. Be the first to comment!</div>
              )}
              {isAuthenticated ? (
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isCommentLoading}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isCommentLoading || !commentText.trim()}
                    >
                      {isCommentLoading ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-gray-500">Please <Link to="/login" className="text-primary-600 underline">log in</Link> to comment.</div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end">
          <Link to="/ideas" className="btn-secondary">Back to Ideas</Link>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail; 