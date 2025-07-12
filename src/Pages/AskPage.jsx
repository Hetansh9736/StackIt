import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tagOptions = ['React', 'Next.js', 'Firebase', 'Tailwind', 'Auth', 'API'];

const AskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || selectedTags.length === 0) {
      setError('All fields are required.');
      return;
    }
    // Simulate form submission
    console.log({ title, description, tags: selectedTags });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-4 md:px-8 py-10">
      <div className="max-w-3xl mx-auto bg-neutral-800 p-6 rounded-xl border border-neutral-700">
        <h2 className="text-2xl font-bold mb-6">Ask a Question</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g. How to use useEffect in React?"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Describe your question in detail..."
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full border text-sm transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-cyan-500 border-cyan-600 text-white'
                      : 'bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl font-medium"
            >
              Post Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskPage;