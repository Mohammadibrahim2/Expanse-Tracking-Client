
const { createSlice, current, createAsyncThunk } = require("@reduxjs/toolkit");

//getting expaneses data by api:-

export const getCategoriesData = createAsyncThunk("getCategoriesData", async () => {
    const result = await fetch("http://localhost:5000/api/category");
    
    return result.json();
})

//create expases data into database:-
export const createCategoryData = createAsyncThunk("createCategoryData", async (values) => {
    console.log(values)
  
    const result = await fetch("http://localhost:5000/api/category", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            limit: values.limit,
            category: values.category,
           
        })
    }).then((res) => {
      
        res.json()
    });

});

//create reducer into slice
const categorySlice = createSlice({
    name: "Category",
    initialState: {
        loading: false,
        error: "",
        isSuccess:'',
        categoryData:[]
    },
    
        
    extraReducers: (builder) => {
        //getting expanse data
        builder.addCase(getCategoriesData.pending, (state, action) => {
            
            state.loading = true,
            state.error=''
           
        })
        builder.addCase(getCategoriesData.fulfilled, (state, action) => {
            console.log(action.payload.results)
            state.loading = false,
                state.categoryData= action.payload.results
                
        })
        builder.addCase(getCategoriesData.rejected, (state, action) => {
            
            state.loading =false,
            state.categoryData=[],
            state.error=action.error.message
           
        })
        //adding expanses Data:
        builder.addCase(createCategoryData.pending, (state, action) => {
            
            state.loading = true,
            state.error=''
           
        })
        builder.addCase(createCategoryData.fulfilled, (state, action) => {
            
            state.loading = false,
                state.categoryData= [],
                state.isSuccess=action.payload
                console.log(state.categoryData)
        })
        builder.addCase(createCategoryData.rejected, (state, action) => {
            
            state.loading =false,
            state.categoryData=[],
            state.error=action.error.message
           
        })

    }
})
export const {  } = categorySlice.actions;
export default categorySlice.reducer