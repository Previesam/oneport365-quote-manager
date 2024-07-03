import { call, put, takeLatest } from "redux-saga/effects";
import Api from "../../../utils/api";
import {
  fetchQuoteStart,
  fetchQuoteSuccess,
  fetchQuoteFailure,
} from "../../features/quotes/single";

export function* fetchQuoteAsync(action?: any) {
  console.log("fetchQuote saga running");
  try {
    console.log("Making API call");

    const {
      data: { status, message, data },
    } = yield call(
      Api.get,
      `/get_single_quote/${action?.payload?.id || ""}`
    ) as any;

    if (status == "success") {
      console.log("API call successful", data);
      yield put(fetchQuoteSuccess(data));
      action?.payload?.onSuccess!(message, data);
    } else {
      throw new Error(message);
    }
  } catch (err: any) {
    console.error("API call failed", err);
    yield put(
      fetchQuoteFailure({
        name: err?.name || "Fetch Error",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Unknown error occured!",
      })
    );
    action?.payload?.onError!(err?.response?.data);
  }
}

export default function* quoteSagas() {
  console.log("fetchQuoteStart action type:", fetchQuoteStart.type);
  yield takeLatest(fetchQuoteStart.type, fetchQuoteAsync);
}
