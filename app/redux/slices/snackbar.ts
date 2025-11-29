// features/snackbar/snackbarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  duration: number;
}

const initialState: SnackbarState = {
  open: false,
  message: "",
  severity: "info",
  duration: 5000,
};

interface ShowSnackbarPayload {
  message: string;
  severity?: SnackbarSeverity;
  duration?: number;
}

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<ShowSnackbarPayload>) => {
      const { message, severity = "info", duration = 5000 } = action.payload;
      state.open = true;
      state.message = message;
      state.severity = severity;
      state.duration = duration;
    },
    closeSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { showSnackbar, closeSnackbar } = snackbarSlice.actions;
export const snackbarReducer = snackbarSlice.reducer;
