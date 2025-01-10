
import expanseReducer from "./slice" 
import categoryReducer from "./categorySlice"
import monthlyLimitsReducer from "./monthlyLimitSlice";
const { configureStore } = require("@reduxjs/toolkit");

export const store=configureStore({
    reducer:{
        expanse:expanseReducer,
        category:categoryReducer,
        monthlyLimitedData:monthlyLimitsReducer
       
       

    }
})