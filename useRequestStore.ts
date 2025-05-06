import { create } from 'zustand';
import axios from 'axios';

interface Request {
  id: string;
  phone: string;
  issue: string;
  status: string;
  created_at: string;
}

interface RequestStore {
  requests: Request[];
  fetchRequests: () => Promise<void>;
  addRequest: (request: Request) => Promise<void>;
  updateRequest: (id: string, updates: Partial<Request>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
}

export const useRequestStore = create<RequestStore>((set, get) => ({
  requests: [],
  fetchRequests: async () => {
    try {
      const response = await axios.get('/db.json');
      set({ requests: response.data.support_requests || [] });
    } catch (error) {
      console.error(error);
    }
  },
  addRequest: async (request) => {
    try {
      const currentRequests = get().requests;
      const newRequests = [...currentRequests, request];
      await axios.patch('/db.json', { support_requests: newRequests });
      set({ requests: newRequests });
      document.getElementById('requests')?.classList.add('animate-pulse');
      setTimeout(() => document.getElementById('requests')?.classList.remove('animate-pulse'), 2000);
      new Audio('https://cdn.pixabay.com/audio/2023/02/15/14-16-37-826_200x200.mp3').play();
    } catch (error) {
      console.error(error);
    }
  },
  updateRequest: async (id, updates) => {
    try {
      const newRequests = get().requests.map(r => (r.id === id ? { ...r, ...updates } : r));
      await axios.patch('/db.json', { support_requests: newRequests });
      set({ requests: newRequests });
    } catch (error) {
      console.error(error);
    }
  },
  deleteRequest: async (id) => {
    try {
      const newRequests = get().requests.filter(r => r.id !== id);
      await axios.patch('/db.json', { support_requests: newRequests });
      set({ requests: newRequests });
    } catch (error) {
      console.error(error);
    }
  },
}));