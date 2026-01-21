
// ============================================================================
// VIDEO PAGE COMPONENT - Full video player with details, likes, and comments
// ============================================================================
import { useState, useEffect, useRef } from "react";
import { api } from "../../utils/api.js";
import { useParams } from "react-router-dom";
import requestHandler from "../../utils/requestHandler.js";
import { Eye, ChevronDown, ChevronUp, ThumbsUp, Edit } from "lucide-react";
import { useNavigate } from 'react-router-dom'
function EditVideoPage({ currentUser }) {
    const [videoDetails, setVideoDetails] = useState(null);
    const [showDescription, setShowDescription] = useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef()
    const [form, setForm] = useState({ title: '', description: '' })

    const navigate = useNavigate()
    const { _id } = useParams()

    useEffect(() => {
        fetchVideoDetails();

    }, [_id, currentUser]);

    const fetchVideoDetails = async () => {
        try {
            const result = await requestHandler(api.getVideoById, _id)
            setVideoDetails(result.data);
            console.log(result.data)
            setForm({ ...form, title: result.data.title, description: result.data.description, isPublished: result.data.isPublished })
        } catch (error) {
            console.error('Failed to fetch video details:', error);
        }
    };


    const handleUpdateThumbnail = async (e) => {
        try {
            const file = e.target.files[0]
            const form = new FormData()
            form.append('thumbnail', file)
            const response = await requestHandler(api.updateThumbnail, { form, videoId: _id })
            setVideoDetails({ ...videoDetails, thumbnail: response.data.thumbnail })

        } catch (error) {
            console.log("Could not update thumbnail,Error", error)
        }
    }

    const thumbnailButtonHandler = async () => {
        inputRef.current.click()
    }

    const handleUpdateDetails = async () => {
        if (!(form.title?.trim()) && !(form.description?.trim())) return null;
        if (form.title === videoDetails.title &&
            form.description === videoDetails.description &&
            form.isPublished == videoDetails.isPublished) return null
        try {
            await requestHandler(api.updateVideoDetails, { ...form, videoId: _id })
            setVideoDetails({ ...videoDetails, title: form.title, description: form.description })

        } catch (error) {
            console.log("Could not update video details,Error:", error)
        }
        finally {
            setIsEditing(false)
        }

    }


    const onBack = async () => {
        navigate("/profile")
    }

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


    if (!videoDetails) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <button
                onClick={onBack}
                className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
                <span>← Back to profile</span>
            </button>

            {/* Thumbnail Section */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
                <div className="relative pt-[56.25%]">

                    <div>
                        <img
                            src={videoDetails.thumbnail.secure_url}
                            className="absolute inset-0 w-full h-full opacity-50"
                        />
                        <button
                            onClick={thumbnailButtonHandler}
                            className="absolute right-2 bottom-2 z-10">
                            <Edit className="xs:w-6 w-5 h-5 text-white xs:h-6" />
                        </button>
                        <input onChange={handleUpdateThumbnail} ref={inputRef} type="file" className="hidden" />
                    </div>
                </div>
            </div>
            {/* Video Title and Actions Section */}


            {isEditing ?
                <div className="flex gap-2 items-center flex-col">
                    <input
                        type="text"
                        placeholder="Change title..."
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-red-500"
                    />
                    <div className="flex gap-2">
                        <label className="text-sm font-medium text-gray-700" htmlFor="publish">Publish</label>
                        <input checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} id="publish" type="checkbox" />
                    </div>
                </div>
                :
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold mb-4 break-all">{videoDetails.title}</h1>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex mb-3 items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            }

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Eye className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{videoDetails.views || 0} views</span>
                    </div>
                    <button
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition
                            }`}
                    >
                        <ThumbsUp className="w-5 h-5" />
                        <span>{videoDetails.likes || 0}</span>
                    </button>
                </div>
            </div>

            {/* Channel Info Section */}
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">


                <div className="flex gap-2 justify-self-start">
                    <img
                        src={videoDetails.owner?.avatar.secure_url || 'https://via.placeholder.com/48'}
                        alt={videoDetails.owner?.username}
                        className="sm:w-12 sm:h-12 w-10 h-10 rounded-full"
                    />
                    <div>
                        <h3 className="font-semibold text-lg">{videoDetails.owner?.username}</h3>
                        <p className="text-sm text-gray-600">{videoDetails.owner?.subscriberCount || 0} subscribers</p>
                    </div>

                </div>

                {/* Description Dropdown Section */}
                <div className="mt-4">
                    {isEditing ?
                        <div className="flex gap-2 items-center flex-col">
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Edit description..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
                                rows="3"

                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setIsEditing(false); setForm({ ...form, description: "", title: "" }) }}
                                    className="sm:px-4 xs:text-sm sm:text-base px-2 sm:w-auto text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateDetails}
                                    className="sm:px-4 xs:text-sm px-2 sm:text-base sm:w-auto text-xs px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="flex gap-2">
                                <div onClick={() => setShowDescription(!showDescription)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                                    <span className="font-medium sm:text-base text-sm">Description</span>
                                    {showDescription ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </div>
                            {showDescription && (
                                <p className="mt-3 text-gray-600 whitespace-pre-wrap">
                                    {videoDetails.description || 'No description available.'}
                                </p>
                            )}
                        </div>
                    }
                </div>

            </div>
        </div>
    );
}

export default EditVideoPage