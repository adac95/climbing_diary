import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  btnToRender: false,
};

export const toposSlice = createSlice({
  name: "topos",
  initialState,
  reducers: {
    setBtnToRender(state, action) {
      state.btnToRender = action.payload;
    },
  },
});

export const { setBtnToRender } = toposSlice.actions;
export default toposSlice.reducer;
