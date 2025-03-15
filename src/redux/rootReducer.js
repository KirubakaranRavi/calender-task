/** **************************** Import Libs ****************************** */
import { combineReducers } from "redux";
import loginReducer from "./reducers/loginReducer";
/** **************************** Import Reducers ****************************** */
import {
  //   sideBarReducer,
  //   NavBarReducer,
  // profileDropDownReducer,
  // DarkThemeReducer,
  // NotificationReducer,
  //   LedgerReducer,
  //   FlaggedReducer,
  //   GameUserReducer,
  //   MegaJacpotResultReducer,
  //   InstantJacpotResultReducer,
  //   RoulottoJacpotResultReducer,
  //   MegaJacpotStatsReducer,
    // loginReducer,
  //   SystemUserReducer
} from "./reducers";

const rootReducer = combineReducers({
  login:loginReducer,
  // SideBar: sideBarReducer,
  // profileDropdown: profileDropDownReducer,
  // NotificationReducer: NotificationReducer,
  // DarkThemeReducer: DarkThemeReducer,
  // NavbarReduce: NavBarReducer,
  // ledgerReducer: LedgerReducer,
  // flaggedReducer: FlaggedReducer,
  // gameUser: GameUserReducer,
  // MegaResult: MegaJacpotResultReducer,
  // InstantResult: InstantJacpotResultReducer,
  // RoulottoResult: RoulottoJacpotResultReducer,
  // Stats: MegaJacpotStatsReducer,
  // DepositReducer: DepositReducer,
  // AdminUser:SystemUserReducer,
});

export default rootReducer;
