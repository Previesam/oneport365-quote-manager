import { createSlice } from "@reduxjs/toolkit";

export interface QuoteSetionCurrency {
  currency: string;
  exchange_rate: number;
  is_base_currency: boolean;
  customer_currency: string;
}

export interface QuoteSectionData {
  _id?: string;
  basis: string;
  unit_of_measurement: string;
  unit: number;
  rate: number;
  amount: number;
}

export interface QuoteSectionI {
  section_currency: QuoteSetionCurrency | string;
  _id?: string;
  section_name: string;
  section_number: number;
  section_data: QuoteSectionData[];
}

export interface Quote {
  _id?: string;
  quote_date: string;
  sections: QuoteSectionI[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  quote_title: string;
}

export interface QuoteError {
  name?: string;
  message: string;
}

export interface QuoteState {
  quotes: Quote[];
  loading: boolean;
  error?: QuoteError;
}

export interface QuoteFilter {
  start_date: string;
  end_date: string;
}

const initialState: QuoteState = {
  quotes: [],
  loading: false,
};

export const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    fetchQuotesStart: (
      state,
      action: { type?: string; payload?: QuoteFilter }
    ) => {
      console.log("fetchQuotesStart reducer called with:", action?.payload);
      state.loading = true;
      state.error = undefined;
    },
    fetchQuotesSuccess: (state, action) => {
      state.quotes = action.payload;
      state.loading = false;
    },
    fetchQuotesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { fetchQuotesStart, fetchQuotesSuccess, fetchQuotesFailure } =
  quotesSlice.actions;

export default quotesSlice.reducer;
