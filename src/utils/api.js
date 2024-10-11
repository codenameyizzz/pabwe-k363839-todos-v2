const api = (() => {
  const BASE_URL = "https://public-api.delcom.org/api/v1"; // URL dasar untuk API

  // Fungsi untuk melakukan fetch dengan token otentikasi
  async function _fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`, // Menyisipkan token akses ke header
      },
    });
  }

  // Fungsi untuk menyimpan token akses ke local storage
  function putAccessToken(token) {
    localStorage.setItem("accessToken", token);
  }

  // Fungsi untuk mendapatkan token akses dari local storage
  function getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  // API Auth => Dokumentasi: https://public-api.delcom.org/docs/1.0/api-auth
  // Fungsi untuk mendaftar pengguna baru
  async function postAuthRegister({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const responseJson = await response.json(); // Mengonversi respons menjadi JSON
    const { success, message } = responseJson; // Mengambil status dan pesan dari respons
    if (success !== true) {
      throw new Error(message); // Jika gagal, lempar error
    }
    return message; // Mengembalikan pesan sukses
  }

  // Fungsi untuk login pengguna
  async function postAuthLogin({ email, password }) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const responseJson = await response.json(); // Mengonversi respons menjadi JSON
    const { success, message } = responseJson; // Mengambil status dan pesan dari respons
    if (success !== true) {
      throw new Error(message); // Jika gagal, lempar error
    }
    const {
      data: { token }, // Mengambil token dari data respons
    } = responseJson;
    return token; // Mengembalikan token
  }

  // API Users => Dokumentasi: https://public-api.delcom.org/docs/1.0/apiusers
  // Fungsi untuk mendapatkan data pengguna saat ini
  async function getMe() {
    const response = await _fetchWithAuth(`${BASE_URL}/users/me`);
    const responseJson = await response.json(); // Mengonversi respons menjadi JSON
    const { success, message } = responseJson; // Mengambil status dan pesan dari respons
    if (success !== true) {
      throw new Error(message); // Jika gagal, lempar error
    }
    const {
      data: { user }, // Mengambil data pengguna dari respons
    } = responseJson;
    return user; // Mengembalikan data pengguna
  }

  // Fungsi untuk mengubah foto profil pengguna
  async function postChangePhotoProfile({ photoFile }) {
    const formData = new FormData(); // Membuat FormData untuk upload file
    formData.append("photo", photoFile); // Menambahkan file foto ke FormData
    const response = await _fetchWithAuth(`${BASE_URL}/users/photo`, {
      method: "POST",
      body: formData, // Mengirim FormData sebagai body
    });
    const responseJson = await response.json(); // Mengonversi respons menjadi JSON
    const { success, message } = responseJson; // Mengambil status dan pesan dari respons
    if (success !== true) {
      throw new Error(message); // Jika gagal, lempar error
    }
    return message; // Mengembalikan pesan sukses
  }

  // API Todos => Dokumentasi: https://public-api.delcom.org/docs/1.0/apitodos
  // Fungsi untuk menambahkan todo baru
  async function postAddTodo({ title, description }) {
    const response = await _fetchWithAuth(`${BASE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
    const responseJson = await response.json(); // Mengonversi respons menjadi JSON
    const { success, message } = responseJson; // Mengambil status dan pesan dari respons
    if (success !== true) {
      throw new Error(message); // Jika gagal, lempar error
    }
    const {
      data: { todo_id }, // Mengambil ID todo dari data respons
    } = responseJson;
    return todo_id; // Mengembalikan ID todo
  }

  // Fungsi untuk mengubah cover foto todo
  async function postChangeCoverTodo({ id, cover }) {
    const formData = new FormData(); // Membuat FormData untuk upload file
    formData.append("cover", cover); // Menambahkan file cover ke FormData
    const response = await _fetchWithAuth(`${BASE_URL}/todos/${id}/cover`, {
      method: "POST",
      body: formData, // Mengirim FormData sebagai body
    });
    const responseJson = await response.json(); // Mengonversi respons menjadi JSON
    const { success, message } = responseJson; // Mengambil status dan pesan dari respons
    if (success !== true) {
      throw new Error(message); // Jika gagal, lempar error
    }
    return message; // Mengembalikan pesan sukses
  }

  // Fungsi untuk memperbarui todo yang sudah ada
  async function putUpdateTodo({ id, title, description, is_finished }) {
    const response = await _fetchWithAuth(`${BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        is_finished,
      }),
    });
    const responseJson = await response.json(); // Mengonversi respons menjadi JSON
    const { success, message, data } = responseJson; // Mengambil status, pesan, dan data dari respons

    if (!success) {
      throw new Error(message); // Jika gagal, lempar error
    }

    if (!data || !data.todo_id) {
      throw new Error("Todo update failed: todo_id missing in response."); // Pastikan todo_id ada dalam respons
    }

    return data.todo_id; // Mengembalikan ID todo
  }

  // Fungsi untuk menghapus todo berdasarkan ID
  async function deleteTodo(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json(); // Mengonversi respons menjadi JSON
    const { success, message } = responseJson; // Mengambil status dan pesan dari respons
    if (success !== true) {
      throw new Error(message); // Jika gagal, lempar error
    }
    return message; // Mengembalikan pesan sukses
  }

  // Fungsi untuk mendapatkan semua todo berdasarkan status
  async function getAllTodos(is_finished) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/todos?is_finished=${is_finished}` // Menyisipkan parameter status
    );
    const responseJson = await response.json(); // Mengonversi respons menjadi JSON

    const { success, message } = responseJson; // Mengambil status dan pesan dari respons
    if (success !== true) {
      throw new Error(message); // Jika gagal, lempar error
    }
    const {
      data: { todos }, // Mengambil daftar todos dari data respons
    } = responseJson;
    return todos; // Mengembalikan daftar todos
  }

  // Fungsi untuk mendapatkan detail todo berdasarkan ID
  async function getDetailTodo(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/todos/${id}`);
    const responseJson = await response.json(); // Mengonversi respons menjadi JSON
    const { success, message } = responseJson; // Mengambil status dan pesan dari respons
    if (success !== true) {
      throw new Error(message); // Jika gagal, lempar error
    }
    const {
      data: { todo }, // Mengambil detail todo dari data respons
    } = responseJson;
    return todo; // Mengembalikan detail todo
  }

  // Mengembalikan objek API yang berisi semua fungsi yang dapat diakses
  return {
    putAccessToken,
    getAccessToken,
    postAuthRegister,
    postAuthLogin,
    getMe,
    postChangePhotoProfile,
    postAddTodo,
    postChangeCoverTodo,
    putUpdateTodo,
    deleteTodo,
    getAllTodos,
    getDetailTodo,
  };
})();

export default api; // Mengekspor modul API
