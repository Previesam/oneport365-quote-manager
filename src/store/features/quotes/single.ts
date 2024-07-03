import { createSlice } from "@reduxjs/toolkit";
import { Quote } from ".";

export interface QuoteError {
  name?: string;
  message: string;
}

export interface SingleQuoteState {
  quote: Quote | null;
  loading: boolean;
  error?: QuoteError;
}

export interface SingleQuotePayload {
  id: string;
  onSuccess?: any;
  onError?: any;
}

const initialState: SingleQuoteState = {
  quote: null,
  loading: false,
};

export const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    fetchQuoteStart: (
      state,
      action: { type?: string; payload?: SingleQuotePayload }
    ) => {
      console.log("fetchQuoteStart reducer called with:", action?.payload);
      state.loading = true;
      state.error = undefined;
    },
    fetchQuoteSuccess: (state, action) => {
      state.quote = action.payload;
      state.loading = false;
    },
    fetchQuoteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { fetchQuoteStart, fetchQuoteSuccess, fetchQuoteFailure } =
  quoteSlice.actions;

export default quoteSlice.reducer;
