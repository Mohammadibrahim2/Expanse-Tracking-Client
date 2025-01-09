import axios from "axios";

const { createSlice, current, createAsyncThunk } = require("@reduxjs/toolkit");

// create state
// const initialState = {
//     expanse:  []
//     // JSON.parse(localStorage.getItem("expanses")) ? JSON.parse(localStorage.getItem("expanses")) :
// }
//getting expaneses data by api:-

export const getExpansesData = createAsyncThunk("getExpansesData", async () => {
    const result = await fetch("http://localhost:5000/tasks");
    
    return result.json();
})

//create expases data into database:-
export const addExpansesData = createAsyncThunk("addExpansesData", async (values) => {
    
  
    const result = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            value: values.value,
            category: values.category,
            purpose: values.purpose,
            expansesDate: new Date().toISOString()
        })
    }).then((res) => {
       
        res.json()
    });

});

//create reducer into slice
const expanseSlice = createSlice({
    name: "expanses",
    initialState: {
        loading: false,
        error: "",
        isSuccess:'',
        expanseData:[]
    },
    
        
    extraReducers: (builder) => {
        //getting expanse data
        builder.addCase(getExpansesData.pending, (state, action) => {
            
            state.loading = true,
            state.error=''
           
        })
        builder.addCase(getExpansesData.fulfilled, (state, action) => {
            console.log(action.payload)
            state.loading = false,
                state.expanseData= action.payload
            
                
        })
        builder.addCase(getExpansesData.rejected, (state, action) => {
            
            state.loading =false,
            state.expanseData=[],
            state.error=action.error.message
           
        })
        //adding expanses Data:
        builder.addCase(addExpansesData.pending, (state, action) => {
            
            state.loading = true,
            state.error=''
           
        })
        builder.addCase(addExpansesData.fulfilled, (state, action) => {
            
            state.loading = false,
                state.expanseData= [],
                state.isSuccess=action.payload
                console.log(state.expanseData)
        })
        builder.addCase(addExpansesData.rejected, (state, action) => {
            
            state.loading =false,
            state.expanseData=[],
            state.error=action.error.message
           
        })

    }
})
export const { addtask, removeTask } = expanseSlice.actions;
export default expanseSlice.reducer