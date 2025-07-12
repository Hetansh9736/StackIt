import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { ThumbsUp } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

const QuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('Newest');
  const [answerText, setAnswerText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: user.uid, ...userDoc.data() });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch question
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const docRef = doc(db, 'questions', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuestion({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error('Failed to load question', err);
      }
    };

    fetchQuestion();
  }, [id]);

  // Real-time fetch answers
  useEffect(() => {
    const q = query(collection(db, 'answers'), where('questionId', '==', id));
    const unsub = onSnapshot(q, async (snapshot) => {
      const list = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let userName = 'Anonymous';

          if (data.userId) {
            try {
              const userSnap = await getDoc(doc(db, 'users', data.userId));
              if (userSnap.exists()) {
                userName = userSnap.data().name;
              }
            } catch {}
          }

          return { id: docSnap.id, ...data, userName };
        })
      );

      const sorted = [...list].sort((a, b) => {
        if (sort === 'Newest') {
          return b.createdAt?.seconds - a.createdAt?.seconds;
        } else {
          return (b.votes || 0) - (a.votes || 0);
        }
      });

      setAnswers(sorted);
      setLoading(false);
    });

    return () => unsub();
  }, [id, sort]);

  // One-like-per-user logic
  const handleLike = async (answerId) => {
    if (!currentUser) return;

    const likeRef = doc(db, 'answers', answerId, 'likes', currentUser.id);
    const likeSnap = await getDoc(likeRef);

    if (!likeSnap.exists()) {
      await setDoc(likeRef, { likedAt: serverTimestamp() });
      await updateDoc(doc(db, 'answers', answerId), {
        votes: increment(1),
      });
    }
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;

    try {
      await addDoc(collection(db, 'answers'), {
        questionId: id,
        text: answerText,
        userId: currentUser?.id || null,
        createdAt: serverTimestamp(),
        votes: 0,
      });

      setAnswerText('');
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      {/* Question */}
      {question && (
        <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
          <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
          <p className="text-neutral-300 mb-4">{question.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags?.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-cyan-700">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-neutral-400">
            Asked by {question.userName || 'Anonymous'} •{' '}
            {question.createdAt?.toDate().toLocaleString()}
          </div>
        </div>
      )}

      {/* Sort */}
      <div className="flex justify-end mt-6 mb-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 text-white px-4 py-2 rounded-xl"
        >
          <option>Newest</option>
          <option>Most Voted</option>
        </select>
      </div>

      {/* Answers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Answers ({answers.length})</h2>
        {loading ? (
          <p className="text-neutral-400">Loading...</p>
        ) : answers.length === 0 ? (
          <p className="text-neutral-500">No answers yet.</p>
        ) : (
          answers.map((ans) => (
            <div
              key={ans.id}
              className="bg-neutral-800 p-4 rounded-xl mb-4 border border-neutral-700"
            >
              <p className="text-neutral-300">{ans.text}</p>
              <div className="text-sm text-neutral-400 mt-2 flex justify-between items-center">
                <span>
                  — {ans.userName || 'Anonymous'},{' '}
                  {ans.createdAt?.toDate().toLocaleString()}
                </span>
                <span className="flex items-center gap-2">
                  <button onClick={() => handleLike(ans.id)} title="Like this answer">
                    <ThumbsUp size={16} />
                  </button>
                  <span>{ans.votes || 0}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Answer */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Your Answer</h3>
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={4}
          placeholder="Write your answer here..."
          className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={handleSubmitAnswer}
          className="mt-3 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl font-medium"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;
