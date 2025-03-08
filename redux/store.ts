import { configureStore } from '@reduxjs/toolkit';

import notificationsSlice from './slices/notificationsSlice';
import streamsSlice from './slices/streamsSlice';

const store = configureStore({
  reducer: {
    notifications: notificationsSlice,
    streams: streamsSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
