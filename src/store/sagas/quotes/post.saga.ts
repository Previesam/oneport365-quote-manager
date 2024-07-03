import { call, put, takeLatest } from "redux-saga/effects";
import Api from "../../../utils/api";
import {
  postQuoteFailure,
  postQuoteStart,
  postQuoteSuccess,
} from "../../features/quotes/post";

export function* postQuoteAsync(action?: any) {
  console.log("Post Quote saga running");
  try {
    console.log("Making API call");

    const {
      data: { status, message, data },
    } = yield call(Api.request, {
      method: action?.payload?.method,
      url:
        action?.payload?.method == "POST"
          ? `/create`
          : `/edit/${action?.payload?.data?._id}`,
      data: action?.payload?.data,
    }) as any;

    if (status == "success") {
      console.log("API call successful", data);
      yield put(postQuoteSuccess(data));
      action?.payload?.onSuccess!(message, data);
    } else {
      throw new Error(message);
    }
  } catch (err: any) {
    console.error("API call failed", err);
    yield put(
      postQuoteFailure({
        name: err?.name || "Post Error",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Unknown error occured!",
      })
    );
    action?.payload?.onError!(err?.response?.data);
  }
}

export default function* postQuoteSagas() {
  console.log("Post QuoteStart action type:", postQuoteStart.type);
  yield takeLatest(postQuoteStart.type, postQuoteAsync);
}
