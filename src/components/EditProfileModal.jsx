import { useState } from 'react';
import { fileToDataUrl } from '../utils/imageUtils';

const EditProfileModal = ({ currentUsername, currentBio, currentImage, onSave, onCancel }) => {
  const [username, setUsername] = useState(currentUsername || '');
  const [bio, setBio] = useState(currentBio || '');
  const [image, setImage] = useState(currentImage || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePhotoChange = async (e) => {
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
      const dataUrl = await fileToDataUrl(file, 256);
      setImage(dataUrl);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    setError('');
    setSaving(true);
    await onSave({ username: username.trim(), bio, image });
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Profile</h3>

        <img src={image || currentImage} alt="Preview" width="80" height="80" style={{ borderRadius: '50%', objectFit: 'cover' }} />
        <input type="file" accept="image/*" onChange={handlePhotoChange} />

        <br />
        <br />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <textarea
          placeholder="Write something about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="modal-actions">
          <button onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;