const inputNote = document.querySelector(".note-form");
const saveNote = document.querySelector(".notes-list");
const editModal = document.getElementById("edit-modal");
const editNote = editModal ? editModal.querySelector(".edit-form") : null;
const editTitleNote = document.getElementById("edit-title-note");
const editBodyNote = document.getElementById("edit-body-note");
const cancelEdit = editModal ? editModal.querySelector(".cancel-btn") : null;

// Notification
const notificationModal = document.getElementById("notification-modal");
const notif_icon = document.getElementById("notification-icon");
const notif_title = document.getElementById("notification-title");
const notif_message = document.getElementById("notification-message");
let notif_confirmButton = notificationModal
  ? notificationModal.querySelector(".confirm-btn")
  : null;
let notif_cancelButton = notificationModal
  ? notificationModal.querySelector(".cancel-btn")
  : null;

let editIndex = -1; // untuk melacak catatan yang diedit
let deleteIndex = -1; // Untuk melacak catatan yang dihapus
let isEditNoteListenerAdded = false; // Flag untuk mencegah event listener bertumpuk

// Pengecekan elemen
if (!editModal) {
  console.error("editModal tidak ditemukan. Periksa ID edit-modal di HTML.");
}
if (!editNote) {
  console.error(
    "editForm tidak ditemukan di dalam editModal. Periksa class edit-form di HTML."
  );
}
if (!cancelEdit) {
  console.error(
    "editCancelBtn tidak ditemukan di dalam editModal. Periksa class cancel-btn di HTML."
  );
}

function showNotifications({
  title,
  message,
  icon,
  onConfirm,
  showCancelButton = false,
}) {
  console.log("Menampilkan notifikasi:", { title, message });
  if (!notificationModal || !notif_confirmButton || !notif_cancelButton) {
    console.error(
      "Elemen notifikasi tidak lengkap. Periksa HTML untuk modal notifikasi."
    );
    return;
  }

  notif_title.textContent = title;
  notif_message.innerHTML = message;
  notif_icon.src = icon;
  notif_icon.alt = `${title.toLowerCase()}-icon`;

  // refresh confirm button supaya tidak bertumpuk pada event listener sebelumnya
  if (notif_confirmButton && notif_confirmButton.parentNode) {
    const newConfirmBtn = notif_confirmButton.cloneNode(true);
    notif_confirmButton.parentNode.replaceChild(
      newConfirmBtn,
      notif_confirmButton
    );
    notif_confirmButton = newConfirmBtn; // Update variabel global
  } else {
    console.error("Confirm button tidak ditemukan atau sudah dihapus dari DOM");
    return;
  }

  notif_confirmButton.textContent = showCancelButton ? "Confirm" : "OK";

  // add event listener ke tombol confirm
  notif_confirmButton.addEventListener("click", () => {
    console.log("Tombol Confirm/OK diklik"); // Debugging
    onConfirm(); // jalankan fungsi yang diberikan
    notificationModal.hidden = true; // tutup notifikasi setelah pilih tombol confirm
  });

  // Hanya tampilkan tombol Cancel jika showCancelButton true
  if (showCancelButton) {
    // refresh cancel button supaya tidak bertumpuk pada event listener sebelumnya
    if (notif_cancelButton && notif_cancelButton.parentNode) {
      const newCancelBtn = notif_cancelButton.cloneNode(true);
      notif_cancelButton.parentNode.replaceChild(
        newCancelBtn,
        notif_cancelButton
      );
      notif_cancelButton = newCancelBtn;
    } else {
      console.error(
        "Cancel button tidak ditemukan atau sudah dihapus dari DOM"
      );
      return;
    }

    notif_cancelButton.style.display = "block"; // Tampilkan tombol Cancel
    // add event listener ke tombol cancel
    notif_cancelButton.addEventListener("click", () => {
      console.log("Tombol Cancel diklik"); // Debugging
      notificationModal.hidden = true; // tutup notifikasi ketika pilih tombol cancel
    });
  } else {
    notif_cancelButton.style.display = "none"; // Sembunyikan tombol Cancel
  }

  notificationModal.hidden = false;
}

inputNote.addEventListener("submit", (event) => {
  event.preventDefault();

  let titleNote = document.getElementById("note-title").value;
  const bodyNote = document.getElementById("note-content").value;

  if (titleNote.trim() === "") {
    titleNote = "UNTITLED";
  }
  if (bodyNote.trim() === "") {
    showNotifications({
      title: "Error",
      message: "Notes can't be empty",
      icon: "./assets/images/icon-warning.png",
      onConfirm: () => {},
      showCancelButton: false,
    });
    return;
  }

  const newNote = { title: titleNote, body: bodyNote };
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));
  createNotes(titleNote, bodyNote, notes.length - 1);
  inputNote.reset();
});

editNote.addEventListener("submit", (event) => {
  event.preventDefault();

  let titleNote = editTitleNote.value;
  const bodyNote = editBodyNote.value;

  if (titleNote.trim() === "") {
    titleNote = "UNTITLED";
  }
  if (bodyNote.trim() === "") {
    showNotifications({
      title: "Error",
      message: "Notes can't be empty",
      icon: "./assets/images/icon-warning.png",
      onConfirm: () => {},
      showCancelButton: false,
    });
  }

  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  if (editIndex >= 0 && editIndex < notes.length) {
    console.log("Menyimpan edit untuk index:", editIndex); // Debugging
    notes[editIndex] = { title: titleNote, body: bodyNote };
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotifications({
      title: "Success",
      message: "Note updated successfully!",
      icon: "./assets/images/icon-success.png",
      onConfirm: () => {},
      showCancelButton: false,
    });
  } else {
    console.error("Index tidak valid saat menyimpan edit:", editIndex);
  }
  editModal.hidden = true;
  editNote.reset(); // Reset form edit
  editIndex = -1; // Reset editIndex
  loadAllNotes();
});

cancelEdit.addEventListener("click", () => {
  console.log("Tombol Cancel di modal edit diklik"); // Debugging
  editModal.hidden = true;
  editNote.reset(); // Reset form edit
  editIndex = -1; // Reset editIndex
});

function createNotes(title, body, index) {
  if (typeof index === "undefined") {
    console.error("Index tidak didefinisikan saat membuat card:", {
      title,
      body,
    });
    return;
  }

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
  buttonMenu.addEventListener("click", () => {
    dropdownMenu.hidden = !dropdownMenu.hidden;
  });

  // Edit option
  const editBtn = cardNote.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    console.log("Tombol Edit diklik, index:", index); // Debugging
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    console.log("Index saat edit:", index, "Notes:", notes); // Debugging
    const note = notes[index];

    if (typeof index === "undefined" || !note) {
      console.error("Catatan tidak ditemukan untuk index:", index);
      showNotifications({
        title: "Error",
        message: "Note not found. Updating notes list...",
        icon: "./assets/images/icon-error.png",
        onConfirm: () => loadAllNotes(), // Refreshed daftar jika index tidak valid
        showCancelButton: false,
      });
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
    console.log("Tombol Delete diklik, index:", index);
    if (typeof index === "undefined") {
      console.error("Index tidak valid saat menghapus:", index);
      return;
    }
    showNotifications({
      title: "Warning",
      message:
        "Are you sure you want to delete this note?<br/>This action cannot be undone.",
      icon: "./assets/images/icon-warning.png",
      onConfirm: () => deleteNotes(index),
      showCancelButton: true,
    });
  });

  saveNote.appendChild(cardNote);
  // console.log("Card ditambahkan ke saveNote");
}

function deleteNotes(index) {
  console.log("Menghapus catatan pada index ke ", index);

  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  if (index >= 0 && index < notes.length) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
  } else {
    console.error("Index tidak valid saat menghapus:", index);
  }
  loadAllNotes();
}

function loadAllNotes() {
  console.log("Memuat catatan dari localStorage...");
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  console.log("Catatan yang dimuat:", notes);
  saveNote.innerHTML = "";
  notes.forEach((note, index) => {
    createNotes(note.title, note.body, index);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadAllNotes);
} else {
  loadAllNotes();
}
