import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "../slice/mainSlice";

export const store = configureStore({
  reducer: {
    main: mainReducer,
  },
});

export default store;
