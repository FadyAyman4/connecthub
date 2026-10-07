const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p>{text}</p>
    </div>
  );
};

export default LoadingSpinner;