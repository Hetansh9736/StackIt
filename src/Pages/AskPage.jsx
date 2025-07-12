import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Suggested tags for autocomplete
const tagOptions = ['React', 'Next.js', 'Firebase', 'Tailwind', 'Auth', 'API'];

const AskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.trim()) {
      const filtered = tagOptions.filter(
        (tag) =>
          tag.toLowerCase().startsWith(value.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!selectedTags.includes(newTag)) {
        setSelectedTags([...selectedTags, newTag]);
      }
      setTagInput('');
      setSuggestions([]);
    }
  };

  const handleTagSelect = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setTagInput('');
    setSuggestions([]);
  };

  const removeTag = (index) => {
    setSelectedTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || selectedTags.length === 0) {
      setError('All fields are required.');
      return;
    }

    try {
      await addDoc(collection(db, 'questions'), {
        title,
        description,
        tags: selectedTags,
        user: user?.email || 'Anonymous',
        createdAt: serverTimestamp(),
        votes: 0,
        comments: 0,
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-4 md:px-8 py-10">
      <div className="max-w-3xl mx-auto bg-neutral-800 p-6 rounded-xl border border-neutral-700">
        <h2 className="text-2xl font-bold mb-6">Ask a Question</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
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

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Describe your question in detail..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-2 font-medium">Tags</label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-cyan-600 text-white px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-sm font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Tag Input */}
            <input
              type="text"
              value={tagInput}
              placeholder="Start typing a tag..."
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-md">
                {suggestions.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className="block w-full text-left px-4 py-2 hover:bg-neutral-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
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
