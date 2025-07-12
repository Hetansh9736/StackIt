import React, { useEffect, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ThumbsUp,
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';

const tagColors = {
  'Next.js': 'bg-blue-600',
  'Authentication': 'bg-green-600',
  'NextAuth.js': 'bg-purple-600',
  'React': 'bg-yellow-600',
  'State Management': 'bg-emerald-600',
  'Frontend': 'bg-pink-600',
  'Server Components': 'bg-red-500',
};

const filterOptions = ['Newest', 'Most Voted', 'Unanswered', 'All'];

const Home = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Newest');
  const [showDropdown, setShowDropdown] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 12;

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(docs);
      } catch (err) {
        console.error('Failed to load questions', err);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  // Filter + Search + Sort
  const getFilteredQuestions = () => {
    let result = [...questions];

    if (search.trim()) {
      result = result.filter((q) =>
        q.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === 'Unanswered') {
      result = result.filter((q) => q.comments === 0);
    } else if (filter === 'Most Voted') {
      result.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    } else if (filter === 'Newest') {
      result.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    }

    return result;
  };

  const filtered = getFilteredQuestions();
  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-4 md:px-8 pb-24">
      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-800 text-white border border-neutral-700 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl hover:bg-neutral-700"
          >
            {filter}
            {showDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showDropdown && (
            <div className="absolute mt-2 w-40 bg-neutral-800 border border-neutral-700 rounded-xl shadow z-10">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFilter(opt);
                    setShowDropdown(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-neutral-700 ${
                    filter === opt ? 'text-cyan-400' : 'text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Question Grid */}
      <div className="max-w-7xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-6">Recent Questions</h2>

        {loading ? (
          <p className="text-neutral-400 text-center">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-neutral-400 text-center">No results found.</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginated.map((q) => (
              <div
                key={q.id}
                className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-cyan-500 transition-all"
              >
                <Link to={`/question/${q.id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-cyan-400 cursor-pointer">
                    {q.title}
                  </h3>
                </Link>
                <p className="text-sm text-neutral-400 mb-3 line-clamp-3">{q.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {q.tags?.map(tag => (
                    <span key={tag} className={`text-xs px-2 py-1 rounded-full ${tagColors[tag] || 'bg-neutral-600'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-neutral-400">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><ThumbsUp size={14} /> {q.votes || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={14} /> {q.comments || 0}</span>
                  </div>
                  <span className="text-xs">
                    {q.userName || (q.user?.split('@')[0] ?? 'Anonymous')} •{' '}
                    {q.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-12 mb-4 flex justify-center gap-2">
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
      )}
    </div>
  );
};

export default Home;
