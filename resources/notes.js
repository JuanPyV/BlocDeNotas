let submit = document.querySelector(".save");
let title = document.getElementById("note_title");
let body = document.getElementById("note_body");
let notesContainer = document.querySelector(".note-container");

class Note{
    constructor(title, body, id) {
        this.title = title;
        this.body = body;
        if(!id){
            this.id = Math.random(); // CONVERT TO STRING
        } else {
            this.id = id;
        }
    }
}

function renderNote(note) {
    let newNote = document.createElement("div");
    newNote.classList.add("note-wrap");
    newNote.innerHTML =
        `<div class="note-block">
            <span class="note-id" hidden>${note.id}</span>
            <div class="note-title">${note.title}</div>
                <p class="note-text">${note.body}</p>
            <div class="bottom-notes">
                <ul class="note-actions">                    
                    <li class="delete">Borrar</li>
                </ul>
            </div>
        </div>`;
    notesContainer.appendChild(newNote);
}

function deleteNote(id){
    console.log("ID BORRADA: " + id);
}

function editNote(id){
    alert("EDITADA " + id);
    console.log("EDITADA " + id);
}

submit.addEventListener("click", (e) => {
    e.preventDefault();

    if(title.value.length > 0 && body.value.length > 0){
        const newNote = new Note(title.value, body.value);
        createNote(newNote);
        title.value = "";
        body.value = "";
    }else{
        alert("Por favor aÃ±ade un titulo y un texto");
    }
});

notesContainer.addEventListener('click', (e) =>{
    if(e.target.classList.contains("delete")){
        const currentNote = e.target.closest('.note-wrap');
        const id = currentNote.querySelector('span.note-id').textContent;
        currentNote.remove();
        deleteNote(Number(id));
    }
    //Para la siguiente entrega
    if(e.target.classList.contains("edit")){
        const currentNote = e.target.closest('.note-wrap');
        const id = currentNote.querySelector('span.note-id').textContent;
        editNote(Number(id));
    }
});