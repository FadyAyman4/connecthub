const QuoteCard = ({ quote, onRefresh }) => {
  return (
    <div className="quote-card">
      <blockquote>"{quote.content}"</blockquote>
      <p>— {quote.author}</p>
      <button onClick={onRefresh}>New Quote</button>
    </div>
  );
};

export default QuoteCard;