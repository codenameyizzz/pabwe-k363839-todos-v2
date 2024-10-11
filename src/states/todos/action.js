import { hideLoading, showLoading } from "react-redux-loading-bar";
import api from "../../utils/api";
import { showErrorDialog } from "../../utils/tools";

const ActionType = {
  GET_TODOS: "GET_TODOS",
  ADD_TODO: "ADD_TODO",
  DELETE_TODO: "DELETE_TODO",
  DETAIL_TODO: "DETAIL_TODO",
  UPDATE_TODO: "UPDATE_TODO", // Tambahkan action baru
};

// Action creator untuk mendapatkan semua todos
function getTodosActionCreator(todos) {
  return {
    type: ActionType.GET_TODOS,
    payload: {
      todos,
    },
  };
}

// Action creator untuk menambahkan todo baru
function addTodoActionCreator(status) {
  return {
    type: ActionType.ADD_TODO,
    payload: {
      status,
    },
  };
}

// Action creator untuk menghapus todo
function deleteTodoActionCreator(status) {
  return {
    type: ActionType.DELETE_TODO,
    payload: {
      status,
    },
  };
}

// Action creator untuk mendapatkan detail todo
function detailTodoActionCreator(todo) {
  return {
    type: ActionType.DETAIL_TODO,
    payload: {
      todo,
    },
  };
}

// Action creator untuk mengupdate todo
function updateTodoActionCreator(status) {
  return {
    type: ActionType.UPDATE_TODO,
    payload: {
      status,
    },
  };
}

// Async function untuk mendapatkan semua todos
function asyncGetTodos(is_finished) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const todos = await api.getAllTodos(is_finished);
      dispatch(getTodosActionCreator(todos));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

// Async function untuk menambahkan todo baru
function asyncAddTodo({ title, description }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.postAddTodo({ title, description });
      dispatch(addTodoActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

// Async function untuk menghapus todo
function asyncDeleteTodo(id) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.deleteTodo(id);
      dispatch(deleteTodoActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

// Async function untuk mendapatkan detail todo
function asyncDetailTodo(id) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const todo = await api.getDetailTodo(id);
      dispatch(detailTodoActionCreator(todo));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

// Async function untuk mengupdate todo
function asyncUpdateTodo({ id, title, description, is_finished }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      // Lakukan pembaruan todo di API
      await api.putUpdateTodo({ id, title, description, is_finished });

      // Dispatch action untuk mengupdate state di Redux
      dispatch(
        updateTodoActionCreator({ id, title, description, is_finished })
      );
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

export {
  ActionType,
  getTodosActionCreator,
  asyncGetTodos,
  addTodoActionCreator,
  asyncAddTodo,
  deleteTodoActionCreator,
  asyncDeleteTodo,
  detailTodoActionCreator,
  asyncDetailTodo,
  updateTodoActionCreator, // Export action creator update
  asyncUpdateTodo, // Export async update function
};
