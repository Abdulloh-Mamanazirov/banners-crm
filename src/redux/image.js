import { createSlice } from "@reduxjs/toolkit";

export const imageSlice = createSlice({
  name: "image",
  initialState: {
    editedImage: "",
    sendingImage: "",
  },
  reducers: {
    updateImage: (state, action) => {
      state.editedImage = action.payload;
    },
    updateSendingImage: (state, action) => {
      state.sendingImage = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateImage, updateSendingImage } = imageSlice.actions;

export default imageSlice.reducer;
