// console.log("Script dimuat");

const inputNote = document.querySelector(".note-form");
const saveNote = document.querySelector(".notes-list");

function createNotes(title, body) {
  // console.log("Membuat card untuk:", { title, body });
  const cardNote = document.createElement("div");
  cardNote.classList.add("notes-list-item");
  cardNote.innerHTML = `
    <div class="note-menu" hidden>
      <button class="menu-btn">⋮</button>
      <div class="menu-dropdown" hidden>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
    <h3 class="note-title">${title}</h3>
    <p>${body}</p>
  `;
  saveNote.appendChild(cardNote);
  // console.log("Card ditambahkan ke saveNote");
}

function loadAllNotes() {
  // console.log("Memuat catatan dari localStorage...");
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  // console.log("Catatan yang dimuat:", notes);
  notes.forEach((note) => {
    createNotes(note.title, note.body);
  });
}
document.addEventListener("DOMContentLoaded", loadAllNotes);

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
  createNotes(titleNote, bodyNote);
  inputNote.reset();
});
