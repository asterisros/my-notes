const inputNote = document.querySelector(".note-form");
const saveNote = document.querySelector(".notes-list");
const editModal = document.getElementById("edit-modal");
const editNote = editModal.querySelector(".edit-form");
const editTitleNote = document.getElementById("edit-title-note");
const editBodyNote = document.getElementById("edit-body-note");
const cancelEdit = editModal.querySelector(".cancel-btn");

let editIndex = -1; // untuk melacak catatan yang diedit

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

cancelEdit.addEventListener('click', () => {
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
  const buttonMenu = cardNote.querySelector('.menu-btn');
  const dropdownMenu = cardNote.querySelector('.menu-dropdown');
  buttonMenu.addEventListener('click', () => {
    dropdownMenu.hidden = !dropdownMenu.hidden;
  });

  // Edit option
  const editBtn = cardNote.querySelector('.edit-btn');
  editBtn.addEventListener('click', () => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    console.log("Index saat edit:", index, "Notes:", notes); // Debugging
    const note = notes[index];

    if (!note) {
      console.error("Catatan tidak ditemukan untuk index:", index);
      alert("Catatan tidak ditemukan. Memperbarui daftar...");
      loadNotes(); // Refresh daftar jika index tidak valid
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
  saveNote.innerHTML = '';
  notes.forEach((note) => {
    createNotes(note.title, note.body);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadAllNotes);
} else {
  loadAllNotes();
}
