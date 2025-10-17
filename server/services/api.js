import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const fetchJohnProfile = async () => {
  const res = await api.get('/api/profile');
  return res.data; // { data: { name:'john', age:20 } }
};