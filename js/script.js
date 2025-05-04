const inputNote = document.querySelector(".note-form");
const saveNote = document.querySelector(".notes-list");
const editModal = document.getElementById("edit-modal");
const editNote = editModal.querySelector(".edit-form");
const editTitleNote = document.getElementById("edit-title-note");
const editBodyNote = document.getElementById("edit-body-note");
const cancelEdit = editModal.querySelector(".cancel-btn");

// Notification
const notificationModal = document.getElementById("notification-modal");
const notif_icon = document.getElementById("notification-icon");
const notif_title = document.getElementById("notification-title");
const notif_message = document.getElementById("notification-message");
const notif_confirmButton = notificationModal.querySelector(".confirm-btn");
const notif_cancelButton = notificationModal.querySelector(".cancel-btn");

let editIndex = -1; // untuk melacak catatan yang diedit
let deleteIndex = -1; // untuk melacak catatan yang dihapus

function showNotifications({ title, message, icon, onConfirm }) {
  notif_title.textContent = title;
  notif_message.innerHTML = message;
  notif_icon.src = icon;
  notif_icon.alt = `${title.toLowerCase()}-icon`;

  // refresh confirm button supaya tidak bertumpuk pada event listener sebelumnya
  const refreshedConfirmButton = notif_confirmButton.cloneNode(true);
  refreshedConfirmButton.parentNode.replaceChild(
    refreshedConfirmButton,
    notif_confirmButton
  );
  notif_confirmButton = refreshedConfirmButton;

  // add event listener ke tombol confirm
  notif_confirmButton.addEventListener("click", () => {
    onConfirm(); // jalankan fungsi yang diberikan
    notificationModal.hidden = true; // tutup notifikasi setelah pilih tombol confirm
  });

  // refresh cancel button supaya tidak bertumpuk pada event listener sebelumnya
  const refreshedCancelButton = notif_cancelButton.cloneNode(true);
  refreshedCancelButton.parentNode.replaceChild(
    refreshedCancelButton,
    notif_cancelButton
  );
  notif_cancelButton = refreshedCancelButton;

  // add event listener ke tombol cancel
  notif_cancelButton.addEventListener("click", () => {
    notificationModal.hidden = true; // tutup notifikasi ketika pilih tombol cancel
  });

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
    alert("Notes can't be empty!");
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
    alert("Notes can't be empty!");
    return;
  }

  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes[editIndex] = { title: titleNote, body: bodyNote };
  localStorage.setItem("notes", JSON.stringify(notes));
  editModal.hidden = true;
  loadAllNotes();
});

cancelEdit.addEventListener("click", () => {
  editModal.hidden = true;
});

function createNotes(title, body, index) {
  const cardNote = document.createElement("div");
  cardNote.classList.add("notes-list-item");
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
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    console.log("Index saat edit:", index, "Notes:", notes); // Debugging
    const note = notes[index];

    if (!note) {
      console.error("Catatan tidak ditemukan untuk index:", index);
      alert("Catatan tidak ditemukan. Memperbarui daftar...");
      loadNotes(); // Refreshed daftar jika index tidak valid
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
    deleteNotes(index);
  });

  saveNote.appendChild(cardNote);
  // console.log("Card ditambahkan ke saveNote");
}

function deleteNotes(index) {
  console.log("Menghapus catatan pada index ke ", index);

  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));

  loadAllNotes();
}

function loadAllNotes() {
  // console.log("Memuat catatan dari localStorage...");
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  // console.log("Catatan yang dimuat:", notes);
  saveNote.innerHTML = "";
  notes.forEach((note) => {
    createNotes(note.title, note.body);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadAllNotes);
} else {
  loadAllNotes();
}
