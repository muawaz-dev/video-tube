
// ============================================================================
// COMMENT COMPONENT - Individual comment with edit/delete for owner
// ============================================================================
import { api } from "../utils/api.js";
import { useState } from "react";
import authHandler from "../utils/requestHandler.js";
import { Edit,Trash2 } from "lucide-react";
function CommentCard({ comment, currentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isDeleted,setIsDeleted] = useState(false)
  const isOwner = currentUser && currentUser._id === comment.owner?._id;
  const handleUpdate = async () => {
    try {
      await authHandler(api.updateComment,{ commentId: comment._id, content: editedContent })
      setIsEditing(false);
      comment.content=editedContent
      // onUpdate();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await authHandler(api.deleteComment,comment._id)
      setIsDeleted(true)
      // onUpdate();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if(isDeleted) return null

  return (
    <div className="flex space-x-3">
      <img
        src={comment.owner?.avatar.secure_url || 'https://via.placeholder.com/40'}
        alt={comment.owner?.username}
        className="sm:w-12 sm:h-12 w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm">{comment.owner?.username}</span>
          <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        
        {isEditing ? (
          <div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              rows="2"
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-700">{comment.content}</p>
            {isOwner && (
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CommentCard