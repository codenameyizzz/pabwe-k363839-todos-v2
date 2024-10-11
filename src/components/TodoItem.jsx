import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { postedAt } from "../utils/tools";
import { FaClock, FaTrash, FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { asyncUpdateTodo } from "../states/todos/action"; // Import asyncUpdateTodo dari action

function TodoItem({ todo, onDeleteTodo }) {
  let badgeStatus, badgeLabel;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const dispatch = useDispatch(); // Tambahkan useDispatch untuk melakukan dispatch

  if (todo.is_finished) {
    badgeStatus = "badge bg-success text-white ms-3";
    badgeLabel = "Selesai";
  } else {
    badgeStatus = "badge bg-warning text-dark ms-3";
    badgeLabel = "Belum Selesai";
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleSaveEdit = async () => {
    try {
      await dispatch(
        asyncUpdateTodo({
          id: todo.id,
          title: editTitle,
          description: editDescription,
          is_finished: todo.is_finished,
        })
      );
      Swal.fire({
        title: "Success",
        text: "Todo berhasil diubah!",
        icon: "success",
        confirmButtonText: "Tutup",
        customClass: {
          confirmButton: "btn btn-success",
        },
        buttonsStyling: false,
      });
      setIsEditing(false); // Close edit mode
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Tutup",
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-8 d-flex">
            {isEditing ? (
              <div className="w-100">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Edit Title"
                />
                <textarea
                  className="form-control"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Edit Description"
                  rows="3"
                ></textarea>
              </div>
            ) : (
              <>
                <h5>
                  <Link to={`/todos/${todo.id}`} className="text-primary">
                    {todo.title}
                  </Link>
                </h5>
                <div>
                  <span className={badgeStatus}>{badgeLabel}</span>
                </div>
              </>
            )}
          </div>
          <div className="col-4 text-end">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="btn btn-sm btn-success me-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-sm btn-secondary"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Hapus Todo",
                      text: `Apakah kamu yakin ingin menghapus todo: ${todo.title}?`,
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Ya, Tetap Hapus",
                      customClass: {
                        confirmButton: "btn btn-danger me-3 mb-4",
                        cancelButton: "btn btn-secondary mb-4",
                      },
                      buttonsStyling: false,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        onDeleteTodo(todo.id);
                      }
                    });
                  }}
                  className="btn btn-sm btn-outline-danger"
                >
                  <FaTrash /> Hapus
                </button>
              </>
            )}
          </div>
          <div className="col-12">
            <div className="text-sm op-5">
              <FaClock />
              <span className="ps-2">{postedAt(todo.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const todoItemShape = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  is_finished: PropTypes.number.isRequired,
  cover: PropTypes.string,
  created_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
};

TodoItem.propTypes = {
  todo: PropTypes.shape(todoItemShape).isRequired,
  onDeleteTodo: PropTypes.func.isRequired,
};

export { todoItemShape };
export default TodoItem;
