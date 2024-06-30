const API_BASE_URL = 'http://localhost:1000';

export const buildUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};