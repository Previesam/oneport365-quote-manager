import { all } from "redux-saga/effects";
import quotesSagas from "./quotes/index.saga";
import quoteSagas from "./quotes/single.saga";
import postQuoteSagas from "./quotes/post.saga";

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
export default function* rootSaga() {
  yield all([quotesSagas(), quoteSagas(), postQuoteSagas()]);
}
