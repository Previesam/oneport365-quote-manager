import { configureStore } from "@reduxjs/toolkit";
import { quotesSlice } from "./features/quotes";

import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas";
import { quoteSlice } from "./features/quotes/single";
import { postQuoteSlice } from "./features/quotes/post";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    quotes: quotesSlice.reducer,
    quote: quoteSlice.reducer,
    postQuote: postQuoteSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

console.log("About to run root saga");

// then run the saga
sagaMiddleware.run(rootSaga);

console.log("Root saga has started");

console.log("Store created and rootSaga started");

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
