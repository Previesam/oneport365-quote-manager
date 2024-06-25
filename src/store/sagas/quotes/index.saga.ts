import { call, put, takeLatest } from "redux-saga/effects";
import Api from "../../../utils/api";
import QueryString from "qs";
import {
  fetchQuotesStart,
  fetchQuotesSuccess,
  fetchQuotesFailure,
} from "../../features/quotes";

export function* fetchQuotesAsync(action?: any) {
  console.log("fetchQuotes saga running");
  try {
    console.log("Making API call");

    const {
      data: { status, message, data },
    } = yield call(
      Api.get,
      `/get?${QueryString.stringify(action?.payload || {})}`
    ) as any;

    if (status == "success") {
      console.log("API call successful", data);
      yield put(fetchQuotesSuccess(data));
    } else {
      throw new Error(message);
    }
  } catch (err: any) {
    console.error("API call failed", err);
    yield put(
      fetchQuotesFailure({
        name: err?.name || "Fetch Error",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Unknown error occured!",
      })
    );
  }
}

export default function* quotesSagas() {
  console.log("fetchQuotesStart action type:", fetchQuotesStart.type);
  yield takeLatest(fetchQuotesStart.type, fetchQuotesAsync);
}
