/** **************************** Import Libs ****************************** */
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk"; // ✅ Correct import
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

/** **************************** Import Root Reducer ****************************** */
import { env } from "../config"; 
import rootReducer from "./rootReducer";

/** **************************** Setup Middleware ****************************** */
let middleware = [thunk];

if (env === "development") {
  middleware.push(logger);
}

/** **************************** Create Store ****************************** */
const composeEnhancers =
  env === "development" ? composeWithDevTools : (f) => f;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

/** **************************** Export Store ****************************** */
export default store;
