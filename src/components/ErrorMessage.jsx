const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p style={{ color: 'red' }}>{message}</p>
      {onRetry && <button onClick={onRetry}>Try again</button>}
    </div>
  );
};

export default ErrorMessage;