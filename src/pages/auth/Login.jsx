// ============================================================================
// LOGIN PAGE COMPONENT - User authentication form
// ============================================================================
import { useState } from "react";
import { api } from "../../utils/api.js";
import requestHandler from "../../utils/requestHandler.js";
import { Link } from "react-router-dom";
import { PlaySquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
function LoginPage({ setCurrentUser }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await requestHandler(api.login,formData)
      setCurrentUser(result.data)
      navigate("/")
    } catch (error) {
      setError("Login Failed");
      console.log("Error occurred",error)
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 px-4 my-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <PlaySquare className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link
            to={"/register"}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage