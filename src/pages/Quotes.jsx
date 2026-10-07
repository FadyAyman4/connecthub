import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuote } from '../store/quotesSlice';
import QuoteCard from '../components/QuoteCard';

const Quotes = () => {
  const dispatch = useDispatch();
  const { currentQuote, loading, error } = useSelector((state) => state.quotes);

  useEffect(() => {
    document.title = 'Quotes | ConnectHub';
    dispatch(fetchQuote());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchQuote());
  };

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={handleRefresh}>Try again</button>
      </div>
    );
  }

  if (!currentQuote) return <p>No quote available</p>;

  return (
    <div className="quotes-page">
      <h1>Quote of the moment</h1>
      <QuoteCard quote={currentQuote} onRefresh={handleRefresh} />
    </div>
  );
};

export default Quotes;