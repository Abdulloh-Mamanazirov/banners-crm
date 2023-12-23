import { createSlice } from "@reduxjs/toolkit";

export const statsSlice = createSlice({
  name: "counter",
  initialState:{
    billboards:0,
    admins:0,
    users:0,
  },
  reducers: {
    updateBillboards: (state, action) => {
      state.billboards = action.payload;
    },
    updateAdmins: (state, action) => {
      state.admins = action.payload;
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAdmins, updateBillboards, updateUsers } = statsSlice.actions;

export default statsSlice.reducer;
