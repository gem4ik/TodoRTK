import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {FilterValuesType, todolistsActions, todolistsThunks} from "features/TodolistsList/todolists.reducer";
import {tasksThunks} from "features/TodolistsList/tasks.reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "common/components";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {useActions, useAppDispatch} from "common/hooks";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTasks} from "features/TodolistsList/tasks.selectors";
import {selectTodolists} from "features/TodolistsList/todolists.selectors";
import {TaskStatuses} from "common/enums";

export const TodolistsList = () => {
    const todolists = useSelector(selectTodolists);
    const tasks = useSelector(selectTasks);
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const {
        fetchTodolists,
        changeTodolistFilter,
        removeTodolist,
        changeTodolistTitle,
        addTodolist,
        removeTask,
        addTask,
        updateTask
    } = useActions({
        ...todolistsThunks,
        ...todolistsActions,
        ...tasksThunks
    })

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetchTodolists()
    }, []);

    const removeTaskThunk = useCallback(function (taskId: string, todolistId: string) {removeTask({taskId, todolistId})}, []);
    const addTaskThunk = useCallback(function (title: string, todolistId: string) {addTask({title, todolistId})}, []);
    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {updateTask({taskId, domainModel: {status}, todolistId})}, []);
    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {updateTask({taskId, domainModel: {title}, todolistId})}, []);

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {changeTodolistFilter({id, filter})}, []);
    const removeTodolistThunk = useCallback(function (id: string) {removeTodolist(id)}, []);
    const changeTodolistTitleThunk = useCallback(function (id: string, title: string) {changeTodolistTitle({id, title})}, []);
    const addTodolistThunk = useCallback((title: string) => {addTodolist(title)}, [], );

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>;
    }

    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodolistThunk}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map((tl) => {
                    let allTodolistTasks = tasks[tl.id];

                    return (
                        <Grid item key={tl.id}>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    todolist={tl}
                                    tasks={allTodolistTasks}
                                    removeTask={removeTaskThunk}
                                    changeFilter={changeFilter}
                                    addTask={addTaskThunk}
                                    changeTaskStatus={changeStatus}
                                    removeTodolist={removeTodolistThunk}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitleThunk}
                                />
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};
