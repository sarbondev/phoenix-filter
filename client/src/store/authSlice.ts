import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  id: string;
  phoneNumber: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

function loadAuth(): AuthState {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const stored = localStorage.getItem("client_auth");
    return stored ? JSON.parse(stored) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

function saveAuth(state: AuthState) {
  if (typeof window !== "undefined") {
    if (state.token) {
      localStorage.setItem("client_auth", JSON.stringify(state));
    } else {
      localStorage.removeItem("client_auth");
    }
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, user: null } as AuthState,
  reducers: {
    initAuth(state) {
      const loaded = loadAuth();
      state.token = loaded.token;
      state.user = loaded.user;
    },
    setAuth(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      saveAuth(state);
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
      saveAuth(state);
    },
    updateUserData(
      state,
      action: PayloadAction<Partial<{ name: string; phoneNumber: string }>>,
    ) {
      if (state.user) {
        Object.assign(state.user, action.payload);
        saveAuth(state);
      }
    },
  },
});

export const { initAuth, setAuth, clearAuth, updateUserData } =
  authSlice.actions;
export default authSlice.reducer;
