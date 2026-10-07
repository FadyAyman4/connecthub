import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/CreatePostForm';

const CreatePost = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Create Post</h1>
      <CreatePostForm onSuccess={() => navigate('/home')} />
    </div>
  );
};

export default CreatePost;