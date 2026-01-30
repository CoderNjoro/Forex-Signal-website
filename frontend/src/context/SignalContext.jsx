import React, { createContext, useState, useContext, useEffect } from 'react';
import { signalService } from '../services/signal.service';
import { io } from 'socket.io-client';
import { API_URL } from '../utils/constants';

const SignalContext = createContext();

export const useSignals = () => {
  const context = useContext(SignalContext);
  if (!context) {
    throw new Error('useSignals must be used within a SignalProvider');
  }
  return context;
};

export const SignalProvider = ({ children }) => {
  const [signals, setSignals] = useState([]);
  const [activeSignals, setActiveSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    // Remove /api from the URL to get the base server URL
    const socketUrl = API_URL.replace('/api', '');
    const token = localStorage.getItem('token');
    const newSocket = io(socketUrl, {
      transports: ['websocket'],
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('signal:new', (signal) => {
      setActiveSignals((prev) => [signal, ...prev]);
      setSignals((prev) => [signal, ...prev]);
    });

    newSocket.on('signal:updated', (data) => {
      const updatedSignal = data.signal;
      setSignals((prev) =>
        prev.map((s) => (s._id === updatedSignal._id ? updatedSignal : s))
      );
      setActiveSignals((prev) =>
        prev.map((s) => (s._id === updatedSignal._id ? updatedSignal : s))
      );
    });

    newSocket.on('signal:comment_count', (data) => {
      const { signalId, commentsCount } = data;
      const updateCount = (prev) =>
        prev.map((s) => (s._id === signalId ? { ...s, commentsCount } : s));
      setSignals(updateCount);
      setActiveSignals(updateCount);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchSignals = async (params = {}) => {
    setLoading(true);
    try {
      const data = await signalService.getSignals(params);
      setSignals(data.signals || []);
      return data;
    } catch (error) {
      console.error('Error fetching signals:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSignals = async () => {
    try {
      const data = await signalService.getActiveSignals();
      setActiveSignals(data);
      return data;
    } catch (error) {
      console.error('Error fetching active signals:', error);
      throw error;
    }
  };

  const createSignal = async (signalData) => {
    try {
      const signal = await signalService.createSignal(signalData);
      setSignals((prev) => [signal, ...prev]);
      setActiveSignals((prev) => [signal, ...prev]);
      return signal;
    } catch (error) {
      throw error;
    }
  };

  const updateSignal = async (id, signalData) => {
    try {
      const signal = await signalService.updateSignal(id, signalData);
      setSignals((prev) =>
        prev.map((s) => (s._id === id ? signal : s))
      );
      setActiveSignals((prev) =>
        prev.map((s) => (s._id === id ? signal : s))
      );
      return signal;
    } catch (error) {
      throw error;
    }
  };

  const deleteSignal = async (id) => {
    try {
      await signalService.deleteSignal(id);
      setSignals((prev) => prev.filter((s) => s._id !== id));
      setActiveSignals((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      throw error;
    }
  };

  const voteSignal = async (id, vote) => {
    try {
      const updatedSignal = await signalService.voteSignal(id, vote);
      setSignals((prev) =>
        prev.map((s) => (s._id === id ? updatedSignal : s))
      );
      setActiveSignals((prev) =>
        prev.map((s) => (s._id === id ? updatedSignal : s))
      );
      return updatedSignal;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    signals,
    activeSignals,
    loading,
    fetchSignals,
    fetchActiveSignals,
    createSignal,
    updateSignal,
    deleteSignal,
    voteSignal,
  };

  return (
    <SignalContext.Provider value={value}>{children}</SignalContext.Provider>
  );
};

