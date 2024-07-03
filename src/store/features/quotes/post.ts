import { createSlice } from "@reduxjs/toolkit";
import { Quote } from ".";

export interface QuoteError {
  name?: string;
  message: string;
}

export interface PostQuoteState {
  quote: Quote | null;
  loading: boolean;
  error?: QuoteError;
}

export interface PostQuotePayload {
  method: "POST" | "PUT";
  data: Quote;
  onSuccess?: any;
  onError?: any;
}

const initialState: PostQuoteState = {
  quote: null,
  loading: false,
};

export const postQuoteSlice = createSlice({
  name: "post-quote",
  initialState,
  reducers: {
    postQuoteStart: (state, action: { type?: string; payload?: Quote }) => {
      console.log("Post QuoteStart reducer called with:", action?.payload);
      state.loading = true;
      state.error = undefined;
    },
    postQuoteSuccess: (state, action) => {
      state.quote = action.payload;
      state.loading = false;
    },
    postQuoteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { postQuoteStart, postQuoteSuccess, postQuoteFailure } =
  postQuoteSlice.actions;

export default postQuoteSlice.reducer;
