import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "app/app.reducer";
import {authAPI, LoginParamsType} from "features/auth/auth.api";
import {createAppAsyncThunk, handleServerAppError, thunkTryCatch} from "common/utils";
import {ResultCode} from "../../common/enums";

export const Login = createAppAsyncThunk<{ isLoggedIn: boolean }, { data: LoginParamsType }>('auth/login', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async ()=>{
            const res = await authAPI.login(arg.data)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
                return {isLoggedIn: true}
            } else {
                const isShowAppError = !res.data.fieldsErrors.length
                handleServerAppError(res.data, dispatch, isShowAppError);
                return rejectWithValue(res.data)
            }
        })
    })

export const Logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>('auth/logout', async (_, thunkAPI) => {
    const {dispatch} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.logout()
        if (res.data.resultCode === ResultCode.Success) {
            return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, dispatch);
            return {isLoggedIn: true}
        }
    })
})

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(authThunk.Login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(authThunk.Logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            });
    }
})


export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunk = {Login, Logout}