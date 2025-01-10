
const { createSlice, current, createAsyncThunk } = require("@reduxjs/toolkit");

//getting expaneses data by api:-

export const getMonthlyLimit= createAsyncThunk("getMonthlyLimit", async () => {
    const result = await fetch("https://expense-tracking-server-six.vercel.app/api/monthlyLimit");
    
    return result.json();
})

//create expases data into database:-
export const setMonthlyLimit = createAsyncThunk("setMonthlyLimit", async (values) => {
    console.log(values.value)
  
    const result = await fetch("https://expense-tracking-server-six.vercel.app/api/monthlyLimit", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            monthlyLimit: values.value
           
           
        })
    }).then((res) => {
      
        res.json()
    });

});

//create reducer into slice
const  monthlyLimitSlice = createSlice({
    name: "MonthlyLimit",
    initialState: {
        loading: false,
        error: "",
        isSuccess:'',
        monthlyLimitedData:[]
    },
    
        
    extraReducers: (builder) => {
        //getting expanse data
        builder.addCase( getMonthlyLimit.pending, (state, action) => {
            
            state.loading = true,
            state.error=''
           
        })
        builder.addCase( getMonthlyLimit.fulfilled, (state, action) => {
            console.log(action.payload)
            state.loading = false,
                state.monthlyLimitedData= action.payload
                console.log(action.payload)
                
        })
        builder.addCase( getMonthlyLimit.rejected, (state, action) => {
            
            state.loading =false,
            state.monthlyLimitedData=[],
            state.error=action.error.message
           
        })
        //adding expanses Data:
        builder.addCase(setMonthlyLimit.pending, (state, action) => {
            
            state.loading = true,
            state.error=''
           
        })
        builder.addCase(setMonthlyLimit.fulfilled, (state, action) => {
            console.log(action.payload)
            state.loading = false,
                state.monthlyLimitedData= [],
                state.isSuccess=action.payload
                
        })
        builder.addCase(setMonthlyLimit.rejected, (state, action) => {
            
            state.loading =false,
            state.monthlyLimitedData=[],
            state.error=action.error.message
           
        })

    }
})
export const {  } = monthlyLimitSlice.actions;
export default monthlyLimitSlice.reducer