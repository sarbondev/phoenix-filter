"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import type { AppStore } from "@/store/store";
import { initCart } from "@/store/cartSlice";
import { initWishlist } from "@/store/wishlistSlice";
import { initAuth } from "@/store/authSlice";
import { useSocket } from "@/shared/hooks/useSocket";

function SocketConnector() {
  useSocket();
  return null;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    storeRef.current?.dispatch(initCart());
    storeRef.current?.dispatch(initWishlist());
    storeRef.current?.dispatch(initAuth());
  }, []);

  return (
    <Provider store={storeRef.current}>
      <SocketConnector />
      {children}
    </Provider>
  );
}
