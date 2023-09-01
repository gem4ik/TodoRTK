import { Dispatch } from "redux";
import axios, { AxiosError } from "axios";
import { appActions } from "app/app.reducer";



/**
 * Обрабатывает ошибки сети от сервера.
 * @param {unknown} e - Ошибка, которая возникла при работе с сервером.
 * @param {Dispatch} dispatch - Функция для отправки действий в Redux store.
 * @returns {void} - ничего не возвращает
 */
export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) : void => {
  const err = e as Error | AxiosError<{ error: string }>;
  if (axios.isAxiosError(err)) {
    const error = err.message ? err.message : "Some error occurred";
    dispatch(appActions.setAppError({ error }));
  } else {
    dispatch(appActions.setAppError({ error: `Native error ${err.message}` }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
