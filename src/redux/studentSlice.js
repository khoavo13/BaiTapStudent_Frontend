import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const getAll=createAsyncThunk("student/getAll",async ({currentPage,limit},thunkAPI)=>{
    const url=BASE_URL+`/student/list?page=${currentPage}&size=${limit}`;
    try{
        const response=await axios.get(url);
        return response.data;
    }
    catch (error){
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});

export const addNewStudent = createAsyncThunk("student/addNewStudent", async (student, thunkAPI)=>{
    const url = BASE_URL + "/student";
    try {
        const response = await axios.post(url, student);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
})

export const deleteStudent = createAsyncThunk("student/deleteStudent", async (id, thunkAPI)=>{
    const url = BASE_URL + `/student/${id}`;
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
})

const studentSlice=createSlice({
    name:"student",
    initialState:{
        students: null,
        totalPages:10,
        error: null,
        message: "",
        status: ""
    },
    reducers:{
        resetStatusAndMessage: (state)=>{
            state.status = null;
            state.message = "";
            state.error = null;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAll.fulfilled,(state,action)=>{
            state.students=action.payload.data.students
            state.totalPages=action.payload.data.totalPages
        })
        .addCase(addNewStudent.fulfilled, (state, action)=>{
            state.status = action.payload.status
            state.message = action.payload.message
            state.students = [...state.students, action.payload.data]
        })
        .addCase(addNewStudent.rejected, (state, action)=>{
            state.status = action.payload.status
            state.message = action.payload.message
            state.error = action.payload.data
        })
        .addCase(deleteStudent.fulfilled, (state, action)=>{
            state.status = action.payload.status
            state.message = action.payload.message
            state.students = state.students.filter(student => student.id != action.payload.data)
        })
        .addCase(deleteStudent.rejected, (state, action)=>{
            state.status = action.payload.status
            state.message = action.payload.message
            state.error = action.payload.data
        })
    }
})
export const {resetStatusAndMessage} = studentSlice.actions;
export default studentSlice.reducer;