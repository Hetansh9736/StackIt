import React, { useEffect, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ThumbsUp,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const sampleQuestions = [
  {
    id: 1,
    title: 'How to implement authentication in Next.js 14 with NextAuth.js?',
    description: 'I am building a new application using Next.js 14 App Router and I need to implement user authentication...',
    tags: ['Next.js', 'Authentication', 'NextAuth.js', 'React'],
    votes: 125,
    comments: 15,
    user: 'Alice',
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'Best practices for managing state in large React applications?',
    description: 'My React application is growing, and state management is becoming complex...',
    tags: ['React', 'State Management', 'Frontend'],
    votes: 98,
    comments: 0,
    user: 'Bob',
    time: '1 day ago',
  },
  {
    id: 3,
    title: 'Understanding Server Components vs. Client Components in Next.js 14',
    description: 'I\'m new to Next.js 14 and the App Router. Can someone explain the difference between server and client components?',
    tags: ['Next.js', 'React', 'Server Components'],
    votes: 60,
    comments: 10,
    user: 'David',
    time: '5 days ago',
  },
];

const tagColors = {
  'Next.js': 'bg-blue-600',
  'Authentication': 'bg-green-600',
  'NextAuth.js': 'bg-purple-600',
  'React': 'bg-yellow-600',
  'State Management': 'bg-emerald-600',
  'Frontend': 'bg-pink-600',
  'Server Components': 'bg-red-500',
};

const filterOptions = ['Newest', 'Unanswered', 'All'];

const Home = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Newest');
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState(sampleQuestions);

  const limit = 3; // Show 2 per page

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const applyFilter = (option) => {
    setFilter(option);
    setShowDropdown(false);
  };

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const handleVote = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q))
    );
  };

  const handleComment = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, comments: q.comments + 1 } : q))
    );
  };

  const getFilteredQuestions = () => {
    let results = [...questions];

    if (search.trim()) {
      results = results.filter((q) =>
        q.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === 'Unanswered') {
      return results.filter((q) => q.comments === 0);
    }
    if (filter === 'Newest') {
      return results.sort((a, b) => b.id - a.id);
    }
    return results;
  };

  const filteredQuestions = getFilteredQuestions();
  const totalPages = Math.ceil(filteredQuestions.length / limit);
  const paginatedQuestions = filteredQuestions.slice((page - 1) * limit, page * limit);

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-4 md:px-8 pb-24">
      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-800 text-white placeholder:text-neutral-400 outline-none border border-neutral-700 focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-xl border border-neutral-700 hover:bg-neutral-700"
          >
            {filter}
            {showDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showDropdown && (
            <div className="absolute mt-2 w-40 bg-neutral-800 border border-neutral-700 rounded-xl shadow-lg z-10">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => applyFilter(option)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 ${
                    filter === option ? 'bg-neutral-700 text-cyan-400' : 'text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Recent Questions</h2>
        {paginatedQuestions.length === 0 ? (
          <p className="text-neutral-400 text-center mt-8">No results found.</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-cyan-500 transition-all"
              >
                <h3 className="text-lg font-semibold mb-2 hover:text-cyan-400 cursor-pointer">
                  {q.title}
                </h3>
                <p className="text-neutral-400 text-sm line-clamp-3 mb-3">{q.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {q.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs text-white px-2 py-1 rounded-full ${tagColors[tag] || 'bg-neutral-600'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-neutral-400">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleVote(q.id)} className="flex items-center gap-1 hover:text-cyan-400">
                      <ThumbsUp size={14} /> {q.votes}
                    </button>
                    <button onClick={() => handleComment(q.id)} className="flex items-center gap-1 hover:text-cyan-400">
                      <MessageCircle size={14} /> {q.comments}
                    </button>
                  </div>
                  <span className="text-xs">{q.user} • {q.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`w-10 h-10 rounded-full ${
            page === 1
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          ‹
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-10 h-10 rounded-full ${
              page === i + 1
                ? 'bg-cyan-500 text-white'
                : 'bg-neutral-800 text-white border border-neutral-600 hover:bg-neutral-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={`w-10 h-10 rounded-full ${
            page === totalPages
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          ›
        </button>
      </div>

      {/* Floating Ask Button */}
      <Link
        to="/ask"
        className="fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-lg transition-all"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
};

export default Home;