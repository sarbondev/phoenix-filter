import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './store';
import { incrementNotifications } from '@/store/authSlice';
import { baseApi } from '@/store/api/baseApi';

export function useSocket() {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io('/', { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    // Order events
    socket.on('order:new', () => {
      dispatch(incrementNotifications());
      dispatch(baseApi.util.invalidateTags(['Order', 'Dashboard']));
    });

    socket.on('order:statusUpdated', () => {
      dispatch(baseApi.util.invalidateTags(['Order', 'Dashboard']));
    });

    // Product events
    socket.on('product:created', () => {
      dispatch(baseApi.util.invalidateTags(['Product', 'Dashboard']));
    });

    socket.on('product:updated', () => {
      dispatch(baseApi.util.invalidateTags(['Product']));
    });

    socket.on('product:deleted', () => {
      dispatch(baseApi.util.invalidateTags(['Product', 'Dashboard']));
    });

    // Category events
    socket.on('category:created', () => {
      dispatch(baseApi.util.invalidateTags(['Category', 'Dashboard']));
    });

    socket.on('category:updated', () => {
      dispatch(baseApi.util.invalidateTags(['Category']));
    });

    socket.on('category:deleted', () => {
      dispatch(baseApi.util.invalidateTags(['Category', 'Dashboard']));
    });

    // Direction events
    socket.on('direction:created', () => {
      dispatch(baseApi.util.invalidateTags(['Direction', 'Dashboard']));
    });

    socket.on('direction:updated', () => {
      dispatch(baseApi.util.invalidateTags(['Direction']));
    });

    socket.on('direction:deleted', () => {
      dispatch(baseApi.util.invalidateTags(['Direction', 'Dashboard']));
    });

    // Review events
    socket.on('review:new', () => {
      dispatch(incrementNotifications());
      dispatch(baseApi.util.invalidateTags(['Review']));
    });

    socket.on('review:approved', () => {
      dispatch(baseApi.util.invalidateTags(['Review']));
    });

    socket.on('review:deleted', () => {
      dispatch(baseApi.util.invalidateTags(['Review']));
    });

    // User events
    socket.on('user:created', () => {
      dispatch(baseApi.util.invalidateTags(['User', 'Dashboard']));
    });

    socket.on('user:updated', () => {
      dispatch(baseApi.util.invalidateTags(['User']));
    });

    socket.on('user:deleted', () => {
      dispatch(baseApi.util.invalidateTags(['User', 'Dashboard']));
    });

    // Presentation events
    socket.on('presentation:created', () => {
      dispatch(baseApi.util.invalidateTags(['Presentation']));
    });

    socket.on('presentation:updated', () => {
      dispatch(baseApi.util.invalidateTags(['Presentation']));
    });

    socket.on('presentation:deleted', () => {
      dispatch(baseApi.util.invalidateTags(['Presentation']));
    });

    return () => {
      socket.disconnect();
    };
  }, [token, dispatch]);

  return socketRef;
}
