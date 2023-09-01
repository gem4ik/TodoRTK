import {Dispatch} from "redux";
import {appActions} from "app/app.reducer";
import {BaseResponseType} from "common/types/common.types";


/**
 Обработка ошибки сервера в приложении.
 @template D - тип данных ответа сервера.
 @param {BaseResponseType<D>} data - данные ответа сервера.
 @param {Dispatch} dispatch - функция диспетчеризации Redux.
 @param {boolean} [showError=true] - флаг, указывающий, нужно ли показывать ошибке.
 @returns {void} - ничего не возвращает
 */
export const handleServerAppError = <D>(
    data: BaseResponseType<D>,
    dispatch: Dispatch,
    showError: boolean = true): void => {
   if(showError) {
       if (data.messages.length) {
           dispatch(appActions.setAppError({error: data.messages[0]}));
       } else {
           dispatch(appActions.setAppError({error: "Some error occurred"}));
       }
       dispatch(appActions.setAppStatus({status: "failed"}));
   }
};
