import axios from 'axios';

export const getRandomQuote = async () => {
const response = await axios.get('https://dummyjson.com/quotes/random');
return { content: response.data.quote, author: response.data.author };
};