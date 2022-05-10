const title = document.getElementById("note_title");
const body = document.getElementById("note_body");
const notes_container = $(".note-container");
const submit = $(".submit");

class Note {
    constructor(title, body, id) {
        this.title = title;
        this.body = body;
        this.id = id;
    }
}

function renderNote(note) {
    let newNote = document.createElement("div");
    newNote.classList.add("note-wrap");
    newNote.innerHTML =
        `<div class="note-block">
            <span class="note-id" hidden>${note.id}</span>
            <div class="note-title" id="note-title-${note.id}">${note.title}</div>
                <p class="note-text" id="note-body-${note.id}">${note.body}</p>
            <div class="bottom-notes">
                <ul class="note-actions">     
                    <li class="edit">Editar</li>                  
                    <li class="delete">Borrar</li>                    
                </ul>
            </div>
        </div>`;
    notes_container.append(newNote);
}

function editNotePrompt(id) {
    const current_title = $("#note-title-" + id).text();
    const current_body = $("#note-body-" + id).text();

    let new_title = prompt("Modifica el titulo", current_title);
    let new_body = prompt("Modifica la descripcion", current_body);

    let text;
    if (!new_title || new_title === "" || !new_body || new_body === "") {
        text = "Error, uno de los campos estaba vacio";
        alert(text);
    } else {
        const editedNote = new Note(new_title, new_body, id);
        editNote(editedNote);
    }
}

submit.on("click", (e) => {
    e.preventDefault();

    if (title.value.length > 0 && body.value.length > 0) {
        const newNote = new Note(title.value, body.value, undefined);
        createNote(newNote);
        title.value = "";
        body.value = "";
    } else {
        alert("Por favor agrega un titulo y un texto");
    }
});

notes_container.on('click', (e) => {
    const currentNote = e.target.closest('.note-wrap');
    const id = currentNote.querySelector('span.note-id').textContent;

    if (e.target.classList.contains("delete")) {
        deleteNote(id);
    } else if (e.target.classList.contains("edit")) {
        editNotePrompt(id);
    }
});