const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-page-input">
      <input
        type="text"
        placeholder="Search users..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;