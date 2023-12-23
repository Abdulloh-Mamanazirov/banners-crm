import { configureStore } from "@reduxjs/toolkit";
import statsReducer from './stats'
import imagesReducer from './image'

export const store = configureStore({
  reducer: {
    stats:statsReducer,
    images:imagesReducer
  },
});
