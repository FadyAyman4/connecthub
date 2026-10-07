import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPost } from '../store/postsSlice';
import { fileToDataUrl } from '../utils/imageUtils';

const CreatePostForm = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [fileInputKey, setFileInputKey] = useState(0);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file, 800);
      setImage(dataUrl);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    setFileInputKey((key) => key + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content is required.');
      return;
    }
    setError('');

    const result = await dispatch(
      addNewPost({
        title: content.trim().slice(0, 50),
        body: content.trim(),
        image,
        userId: user.id,
        username: user.username,
      })
    );
    if (addNewPost.fulfilled.match(result)) {
      setContent('');
      handleRemoveImage();
      if (onSuccess) onSuccess();
    } else {
      setError(result.payload || 'Failed to create post. Please try again.');
    }
  };

  return (
   <form onSubmit={handleSubmit} className="create-post-form">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: '100%' }}
      />

      <div>
        <input
          key={fileInputKey}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {image && (
          <div>
            <img
              src={image}
              alt="Post preview"
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
            <br />
            <button type="button" onClick={handleRemoveImage}>
              Remove image
            </button>
          </div>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePostForm;