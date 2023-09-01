import { AppDispatch, AppRootStateType } from "app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {BaseResponseType} from "../types";



/**
 * Создает асинхронный Thunk для приложения с указанными типами.
 *
 * @template {AppRootStateType} TState - Тип состояния приложения.
 * @template {AppDispatch} TDispatch - Тип диспетчера приложения.
 * @template {BaseResponseType | null} TRejectValue - Тип значения отклонения.
 * @returns {AsyncThunk<any, void, { state: TState, dispatch: TDispatch, rejectValue: TRejectValue }>} - Созданный асинхронный Thunk.
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: BaseResponseType | null
}>();
