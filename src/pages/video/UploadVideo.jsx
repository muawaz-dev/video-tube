
// ============================================================================
// REGISTER PAGE COMPONENT - New user registration form
// ============================================================================
import { useState } from "react";
import { api } from "../../utils/api.js";
import { useNavigate } from "react-router-dom";
import requestHandler from "../../utils/requestHandler.js";
import { PlaySquare } from "lucide-react";
function UploadVideoPage({currentUser}) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublished:false
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading,setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (videoFile) data.append('videoFile', videoFile);
    if (thumbnail) data.append('thumbnail', thumbnail);

    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
        await requestHandler(api.uploadVideo,data)
        setSuccess(true);
        setTimeout(() => navigate('/'), 500);
      
    } catch (error) {
      setError('Failed To Upload');
      console.log("Failed To Upload",error)
    }
    finally{
      setLoading(false)
    }
  };

  if (!currentUser) {
    return (
      <div className="p-8 mt-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Please log in to view this page</h2>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 px-4 my-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <PlaySquare className="w-16 h-16 text-red-600 mx-auto mb-4" />
          {
            loading
            ?
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Uploading Video...</h2>
              <p className="text-gray-600 mt-2">Please Wait</p>
            </div>
            :
            <div>

              <h2 className="text-3xl font-bold text-gray-800">Upload Video</h2>
              <p className="text-gray-600 mt-2">Join The VideoTube Family</p>
            </div>
          }
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            Video Uploaded...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video-File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              checked={formData.isPublished || false}
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div className="flex gap-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="publish">Publish</label>
            <input onChange={(e)=>setFormData({...formData,isPublished:e.target.checked})} id="publish" type="checkbox" />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadVideoPage