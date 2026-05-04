'use client';

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './index';
import { baseApi } from '@/store/api/baseApi';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function useSocket() {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    // Product events — refresh product listings in real time
    socket.on('product:created', () => {
      dispatch(baseApi.util.invalidateTags(['Product']));
    });

    socket.on('product:updated', () => {
      dispatch(baseApi.util.invalidateTags(['Product']));
    });

    socket.on('product:deleted', () => {
      dispatch(baseApi.util.invalidateTags(['Product']));
    });

    // Category events
    socket.on('category:created', () => {
      dispatch(baseApi.util.invalidateTags(['Category']));
    });

    socket.on('category:updated', () => {
      dispatch(baseApi.util.invalidateTags(['Category']));
    });

    socket.on('category:deleted', () => {
      dispatch(baseApi.util.invalidateTags(['Category']));
    });

    // Order events — user's own orders
    socket.on('order:statusUpdated', () => {
      dispatch(baseApi.util.invalidateTags(['Order']));
    });

    // Cart events — sync across tabs/devices
    socket.on('cart:updated', () => {
      dispatch(baseApi.util.invalidateTags(['Cart']));
    });

    socket.on('cart:cleared', () => {
      dispatch(baseApi.util.invalidateTags(['Cart']));
    });

    // Review events
    socket.on('review:approved', () => {
      dispatch(baseApi.util.invalidateTags(['Review']));
    });

    socket.on('review:deleted', () => {
      dispatch(baseApi.util.invalidateTags(['Review']));
    });

    // Blog events
    socket.on('blog:created', () => {
      dispatch(baseApi.util.invalidateTags(['Blog']));
    });

    socket.on('blog:updated', () => {
      dispatch(baseApi.util.invalidateTags(['Blog']));
    });

    socket.on('blog:deleted', () => {
      dispatch(baseApi.util.invalidateTags(['Blog']));
    });

    return () => {
      socket.disconnect();
    };
  }, [token, dispatch]);

  return socketRef;
}
