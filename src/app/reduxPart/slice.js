import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to get expenses data from the backend
export const getExpansesData = createAsyncThunk('expanses/getExpansesData', async () => {
    const response = await fetch('https://expense-tracking-server-six.vercel.app/tasks');
    const data = await response.json();
    return data;
});

// Async thunk to add new expense data to the backend
export const addExpansesData = createAsyncThunk('expanses/addExpansesData', async (values) => {
    const response = await fetch('https://expense-tracking-server-six.vercel.app/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            value: values.value,
            category: values.category,
            purpose: values.purpose,
            expansesDate: new Date().toISOString()
        })
    });
    return response.json();
});
//deleing data 
export const deleteExpanseData = createAsyncThunk('expanses/deleteExpanseData',async ({ recordId, date }) => {
      const response = await fetch(`https://expense-tracking-server-six.vercel.app/api/expense/${recordId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete the expense record');
      }
  
      const data = await response.json();
      return { recordId, date }; // Return the necessary data for deleting
    }
  );
  
// Slice to manage expense data in Redux store
const expanseSlice = createSlice({
    name: 'expanses',
    initialState: {
        loading: false,
        error: '',
        isSuccess: false,
        expanseData: {}
    },
    reducers: {},
    extraReducers: (builder) => {
        // Handle fetching expenses data
        builder.addCase(getExpansesData.pending, (state) => {
            state.loading = true;
            state.error = '';
        });
        builder.addCase(getExpansesData.fulfilled, (state, action) => {
            state.loading = false;
            state.expanseData = action.payload; // Store the full response 
        });
        builder.addCase(getExpansesData.rejected, (state, action) => {
            state.loading = false;
            state.expanseData = {};
            state.error = action.error.message;
        });

        // Handle adding new expense data
        builder.addCase(addExpansesData.pending, (state) => {
            state.loading = true;
            state.error = '';
        });
        builder.addCase(addExpansesData.fulfilled, (state, action) => {
            state.loading = false;
            // Add the new record to the corresponding date
            const newRecord = action.payload;
            const date = new Date(newRecord.expansesDate).toLocaleDateString(); // Format the date correctly
            if (!state.expanseData[date]) {
                state.expanseData[date] = { count: 0, records: [] };
            }
            state.expanseData[date].records.push(newRecord);
            state.expanseData[date].count += 1;
        });
        builder.addCase(addExpansesData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Handle deleting an expense record
        builder.addCase(deleteExpanseData.pending, (state) => {
            state.loading = true;
            state.error = '';
        });
        builder.addCase(deleteExpanseData.fulfilled, (state, action) => {
            const { recordId, date } = action.payload;
          
            if (state.expanseData[date]) {
              // Remove the record from the day's records
              state.expanseData[date].records = state.expanseData[date].records.filter(
                (record) => record._id !== recordId
              );
          
             
              state.expanseData[date].count -= 1;
            }
          });
          
          
        builder.addCase(deleteExpanseData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export default expanseSlice.reducer;
