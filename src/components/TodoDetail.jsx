import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { asyncDetailTodo } from "../states/todos/action";
import Loading from "../components/Loading";

function TodoDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { todo, isLoading } = useSelector((state) => ({
    todo: state.detailTodo,
    isLoading: state.isLoading,
  }));

  useEffect(() => {
    dispatch(asyncDetailTodo(id));
  }, [dispatch, id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!todo) {
    return <p>Todo not found</p>;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h2>{todo.title}</h2>
        </div>
        <div className="card-body">
          <p>{todo.description}</p>
          <p>Created at: {new Date(todo.createdAt).toLocaleString()}</p>
          <p>Status: {todo.is_finished ? "Completed" : "Pending"}</p>
        </div>
        <div className="card-footer">
          <Link to={`/todos/${id}/edit`} className="btn btn-primary">
            Change Cover Todo
          </Link>
          {/* Tombol lain seperti Delete atau Mark as Done dapat ditambahkan di sini */}
        </div>
      </div>
    </div>
  );
}

export default TodoDetailPage;
