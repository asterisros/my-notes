const inputNote = document.querySelector('.note-form');
const saveNote = document.querySelector('.notes-list');

inputNote.addEventListener('submit', (event) => {
  event.preventDefault();
  // console.log('Form submitted.');

  let titleNote = document.getElementById('note-title').value;
  const bodyNote = document.getElementById('note-content').value;

  // console.log('Judul:', titleNote);
  // console.log('Isi:', bodyNote);

   if (titleNote.trim() === '') {
     titleNote = 'UNTITLED';
   }

   if (bodyNote.trim() === '') {
    alert('Notes can\'t be empty!');
    return;
   }

  const cardNote = document.createElement('div');
  cardNote.classList.add('notes-list-item');

  cardNote.innerHTML = `
    <div class="note-menu" hidden>
      <button class="menu-btn">⋮</button>
      <div class="menu-dropdown" hidden>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
    <h3 class="note-title">${titleNote}</h3>
    <p>${bodyNote}</p>
  `;

  saveNote.appendChild(cardNote);
  // console.log('Notes added.', { title: titleNote, body: bodyNote});

  inputNote.reset();
  // console.log('Form Reset');
});
