// VARIABLES //
// --- Add and Save Notes
const inputNote = document.querySelector(".note-form");
const saveNote = document.querySelector(".notes-list");
// --- Edit Notes
const editModal = document.getElementById("edit-modal");
const editNote = editModal ? editModal.querySelector(".edit-form") : null;
const editTitleNote = document.getElementById("edit-title-note");
const editBodyNote = document.getElementById("edit-body-note");
const cancelEdit = editModal ? editModal.querySelector(".cancel-btn") : null;
// --- Notification
const deleteNotification = document.getElementById("delete-modal");
let notif_confirmButton = deleteNotification ? deleteNotification.querySelector(".confirm-btn") : null;
let notif_cancelButton = deleteNotification  ? deleteNotification.querySelector(".cancel-btn") : null;
// --- Indexing
let editIndex = -1; // untuk melacak catatan yang diedit
let deleteIndex = -1; // Untuk melacak catatan yang dihapus
let isEditNoteListenerAdded = false; // Flag untuk mencegah event listener bertumpuk
// END OF VARIABLES //


inputNote.addEventListener("submit", (event) => {
  event.preventDefault();

  let titleNote = document.getElementById("note-title").value;
  const bodyNote = document.getElementById("note-content").value;

  if (titleNote.trim() === "") {
    titleNote = "UNTITLED";
  }
  if (bodyNote.trim() === "") {
    showToast({
      type: "error",
      message: "Notes can't be empty",
    });
    return;
  }

  const newNote = { title: titleNote, body: bodyNote };
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));
  createNotes(titleNote, bodyNote, notes.length - 1);
  showToast({
    type: "success",
    message: "Note added successfully!",
  });
  inputNote.reset();
});

function createNotes(title, body, index) {
  const cardNote = document.createElement("div");
  cardNote.classList.add("notes-list-item");
  cardNote.dataset.index = index; // Simpan index di dataset
  cardNote.innerHTML = `
    <div class="note-menu">
      <button class="menu-btn">⋮</button>
      <div class="menu-dropdown" hidden>
        <button class="edit-btn">
          <img
            src="./assets/images/icon-edit.png"
            alt="icon-edit"
            width="16"
          />Edit
        </button>
        <button class="delete-btn">
          <img
            src="./assets/images/icon-delete.png"
            alt="icon-delete"
            width="16"
          />Delete
        </button>
      </div>
    </div>
    <h3 class="note-title">${title}</h3>
    <p>${body}</p>
  `;

  // Kebab Menu for edit and delete
  const buttonMenu = cardNote.querySelector(".menu-btn");
  const dropdownMenu = cardNote.querySelector(".menu-dropdown");
  buttonMenu.addEventListener("click", (event) => {
    event.stopPropagation(); // Mencegah klik pada tombol menu memicu event klik di document
    dropdownMenu.hidden = !dropdownMenu.hidden;
  });

  // Edit option
  const editBtn = cardNote.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    console.log("Tombol Edit diklik, index:", index);
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    console.log("Index saat edit:", index, "Notes:", notes);
    const note = notes[index];

    if (typeof index === "undefined" || !note) {
      console.error("Catatan tidak ditemukan untuk index:", index);
      showToast({
        type: "error",
        message: "Note not found. Please refresh the page...",
      });
      loadAllNotes();
      return;
    }

    editIndex = index;
    editTitleNote.value = note.title;
    editBodyNote.value = note.body;
    editModal.hidden = false;
  });

  // Delete option
  const deleteBtn = cardNote.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    // console.log("Tombol Delete diklik, index:", index);
    if (typeof index === "undefined") {
      console.error("Index tidak valid saat menghapus:", index);
      return;
    }
    deleteIndex = index; // Simpan index catatan yang akan dihapus
    deleteConfirmation(() => deleteNotes(index));
  });

  saveNote.appendChild(cardNote);
}

function updateNotes(event) {
  event.preventDefault();
  
  let titleNote = editTitleNote.value;
  const bodyNote = editBodyNote.value;
  
  if (titleNote.trim() === "") {
    titleNote = "UNTITLED";
  }
  if (bodyNote.trim() === "") {
    showToast({
      type: "error",
      message: "Notes can't be empty",
    });
    return; // agar tidak melanjutkan jika ada error
  }

  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  if (editIndex >= 0 && editIndex < notes.length) {
    console.log("Menyimpan edit untuk index:", editIndex);
    notes[editIndex] = { title: titleNote, body: bodyNote };
    localStorage.setItem("notes", JSON.stringify(notes));
    showToast({
      type: "success",
      message: "Note updated successfully!",
    });
  } else {
    console.error("Index tidak valid saat menyimpan edit:", editIndex);
    showToast({
      type: "error",
      message: "Failed to save note, please try again.",
    });
  }
  editModal.hidden = true;
  editNote.reset();
  editIndex = -1; // Reset editIndex
  loadAllNotes();
}

if (editNote && !isEditNoteListenerAdded) {
  editNote.addEventListener("submit", updateNotes);
  isEditNoteListenerAdded = true;
} else if (!editNote) {
  console.error(
    "Tidak dapat menambahkan event listener ke editNote karena elemen tidak ditemukan."
  );
}

if (cancelEdit) {
  cancelEdit.addEventListener("click", () => {
    console.log("Tombol Cancel di modal edit diklik"); // Debugging
    editModal.hidden = true;
    editNote.reset(); // Reset form edit
    editIndex = -1; // Reset editIndex
  });
} else {
  console.error(
    "Tidak dapat menambahkan event listener ke cancelEdit karena elemen tidak ditemukan."
  );
}

function deleteNotes(index) {
  console.log("Menghapus catatan pada index ke ", index);

  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  if (index >= 0 && index < notes.length) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showToast({
      type: "success",
      message: "Note deleted successfully!",
    });
  } else {
    console.error("Index tidak valid saat menghapus:", index);
    showToast({
      type: "error",
      message: "Failed to delete note. Please try again.",
    });
  }
  loadAllNotes();
}

function loadAllNotes() {
  console.log("Memuat catatan dari localStorage...");
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  console.log("Catatan yang dimuat:", notes);

  // Empty State
  const emptyState = document.querySelector(".empty-state");
  console.log("Jumlah card sebelum dihapus:", saveNote.children.length);
  saveNote.innerHTML = "";
  saveNote.appendChild(emptyState);
  console.log("Jumlah card setelah dihapus:", saveNote.children.length);

  if (notes.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    notes.forEach((note, index) => {
      createNotes(note.title, note.body, index);
    });
  }
}

function deleteConfirmation(onConfirm) {
  if (!deleteNotification || !notif_confirmButton || !notif_cancelButton) {
    console.error("Elemen modal tidak lengkap. Periksa HTML.");
    return;
  }
  // Tambah event listener ke tombol Yes (Confirm)
  const newConfirmBtn = notif_confirmButton.cloneNode(true);
  notif_confirmButton.parentNode.replaceChild(
    newConfirmBtn,
    notif_confirmButton
  );
  notif_confirmButton = newConfirmBtn;
  notif_confirmButton.addEventListener("click", () => {
    console.log("Tombol Yes diklik");
    onConfirm();
    deleteNotification.hidden = true;
  });

  // Tambah event listener ke tombol No (Cancel)
  const newCancelBtn = notif_cancelButton.cloneNode(true);
  notif_cancelButton.parentNode.replaceChild(newCancelBtn, notif_cancelButton);
  notif_cancelButton = newCancelBtn;
  notif_cancelButton.addEventListener("click", () => {
    console.log("Tombol No diklik");
    deleteNotification.hidden = true;
  });

  // Tampilkan modal
  deleteNotification.hidden = false;
}

function showToast({ type, message }) {
  // Ambil elemen toast berdasarkan tipe (success atau error)
  const toast = document.getElementById(`toast-${type}`);
  const toastMessage = toast.querySelector(".toast-message");

  if (!toast || !toastMessage) {
    console.error(`Toast untuk tipe ${type} tidak ditemukan. Periksa HTML.`);
    return;
  }

  toastMessage.textContent = message;

  // Hapus kelas hide (jika ada) dan tambah kelas show untuk animasi muncul
  toast.classList.remove("hide");
  toast.hidden = false;
  toast.classList.add("show");

  // Sembunyikan toast setelah 3 detik
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => {
      toast.hidden = true;
    }, 300);
  }, 3000);
}

// Event listener global untuk menutup dropdown saat klik di luar area dropdown
document.addEventListener("click", (event) => {
  const allDropdowns = document.querySelectorAll(".menu-dropdown");
  const allMenuButtons = document.querySelectorAll(".menu-btn");

  // Cek apakah klik terjadi di dalam tombol menu atau dropdown
  const isClickInsideMenu = Array.from(allMenuButtons).some((button) =>
    button.contains(event.target)
  );
  const isClickInsideDropdown = Array.from(allDropdowns).some((dropdown) =>
    dropdown.contains(event.target)
  );

  // Jika klik bukan di tombol menu atau dropdown, sembunyikan semua dropdown
  if (!isClickInsideMenu && !isClickInsideDropdown) {
    allDropdowns.forEach((dropdown) => {
      dropdown.hidden = true;
    });
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadAllNotes);
} else {
  loadAllNotes();
}
