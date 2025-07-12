import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import Home from './Pages/Home';
import AskPage from './Pages/AskPage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Layout from './Components/Layout';
import QuestionPage from './Pages/QuestionPage';
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/ask"
          element={
            <ProtectedRoute>
              <AskPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/question/:id" element={<ProtectedRoute>
          <QuestionPage />
        </ProtectedRoute>} />

      </Route>
    </Routes>
  );
}

export default App;
