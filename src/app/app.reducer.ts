import { Dispatch } from "redux";
import { authActions } from "features/auth/auth.reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "features/auth/auth.api";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "../common/utils";
import {ResultCode} from "../common/enums";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

export type AppInitialStateType = typeof initialState;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
  },
  extraReducers: builder => {
    builder
        .addCase(appThunk.initializeApp.fulfilled, (state, action)=>{
          state.isInitialized = action.payload.isInitialized;
        })
  }
});

export const initializeApp = createAppAsyncThunk<{ isInitialized: boolean }, undefined
    >('app/initializeApp', async (_, thunkAPI)=>{
  const {dispatch, rejectWithValue} = thunkAPI
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
      return { isInitialized: true }
    } else {
      return { isInitialized: true }
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

export const appReducer = slice.reducer;
export const appActions = slice.actions;
export const appThunk = {initializeApp}