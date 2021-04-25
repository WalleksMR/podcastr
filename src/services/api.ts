import axios from 'axios';
import 'dotenv/config';

export const api = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:3333'
})
