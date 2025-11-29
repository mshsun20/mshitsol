// features/functionRefresh/functionRefreshSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export interface FunctionRefreshState {
  refresh: boolean;
}

const initialState: FunctionRefreshState = {
  refresh: false,
};

const functionRefreshSlice = createSlice({
  name: "functionRefresh",
  initialState,
  reducers: {
    swapRefresh: (state) => {
      state.refresh = !state.refresh;
    },
  },
});

export const { swapRefresh } = functionRefreshSlice.actions;
export const functionRefreshReducer = functionRefreshSlice.reducer;

export default functionRefreshSlice;
