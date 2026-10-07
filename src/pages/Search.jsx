import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchUsers } from '../services/userService';
import useDebounce from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    document.title = 'Search | ConnectHub';
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const runSearch = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await searchUsers(debouncedQuery);
        setResults(data);
      } catch (err) {
        setError('Unable to search users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    runSearch();
  }, [debouncedQuery]);

  return (
    <div className="search-page">
      <h1>Search Users</h1>
      <SearchBar value={query} onChange={setQuery} />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && !query.trim() && <p>Type a name to search</p>}
      {!loading && !error && query.trim() && results.length === 0 && (
        <p>No users found</p>
      )}
      {results.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default Search;