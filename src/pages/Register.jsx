import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fileToDataUrl } from '../utils/imageUtils';
import { register, clearError } from '../store/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [photo, setPhoto] = useState('');
  const [validationError, setValidationError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setValidationError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setValidationError('Image must be smaller than 5MB.');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhoto(dataUrl);
      setValidationError('');
    } catch (err) {
      setValidationError(err.message);
    }
  };

  const validate = () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      return 'All fields are required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const message = validate();
  if (message) {
    setValidationError(message);
    return;
  }
  setValidationError('');
  const result = await dispatch(
    register({
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      image: photo,
    })
  );
  if (register.fulfilled.match(result)) {
    navigate('/login');
  }
};



  return (

  <div className="centered-page">
    <div className="auth-card">  
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>

      <div>
        <label htmlFor="photo">Profile photo (optional)</label>
        <br />
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
        />
        {photo && (
          <div>
            <img
              src={photo}
              alt="Profile preview"
              width="100"
              height="100"
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      {(validationError || error) && (
        <p style={{ color: 'red' }}>{validationError || error}</p>
      )}
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
    </div>
  </div>
  );
};

export default Register;