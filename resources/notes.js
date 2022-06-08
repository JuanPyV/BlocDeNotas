const title = document.getElementById("note_title");
const body = document.getElementById("note_body");
const notes_container = $(".note-container");
const submit = $(".submit");
const theme_icon = $(".theme_icon");
const slider = $(".font_slider");

let font_size = slider.val();

// Setup initial font size
const setFontSize = function() {
    $('.note-title').css('font-size', (font_size*1.2)+'px');
    $('.note-text').css('font-size', font_size+'px');
    $('#note_title').css('font-size', (font_size*1.2)+'px');
    $('#note_body').css('font-size', font_size+'px');
};


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
                    <li class="edit" tabindex="0">Editar</li>                  
                    <li class="delete" tabindex="0">Borrar</li>                    
                </ul>
            </div>
        </div>`;
    notes_container.append(newNote);
    setFontSize();
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

var notes_handler = function(e){
    const currentNote = e.target.closest('.note-wrap');
    const id = currentNote.querySelector('span.note-id').textContent;

    if (e.target.classList.contains("delete")) {
        deleteNote(id);
    } else if (e.target.classList.contains("edit")) {
        editNotePrompt(id);
    }
};

var submit_handler = function(e){
    e.preventDefault();

    if (title.value.length > 0 && body.value.length > 0) {
        const newNote = new Note(title.value, body.value, undefined);
        createNote(newNote);
        title.value = "";
        body.value = "";
    } else {
        alert("Por favor agrega un titulo y un texto");
    }
};

var theme_handler = function(e) {
    const $bodyElem = $('body');
    if($bodyElem.hasClass("dark-theme")){
        $bodyElem.removeClass("dark-theme");
        theme_icon.attr("src", "img/moon.png");
    } else {
        $bodyElem.addClass("dark-theme");
        theme_icon.attr("src", "img/sun.png");
    }
};

submit.on("click", submit_handler);
notes_container.on('click', notes_handler);
theme_icon.on('click', theme_handler);

submit.on('keypress',(e) => {
    if(e.which == 13) {
        submit_handler(e);
    }
});

notes_container.on('keypress',(e) => {
    if(e.which == 13) {
        notes_handler(e);
    }
});

theme_icon.on('keypress',(e) => {
    if(e.which == 13) {
        theme_handler(e);
    }
});

slider.on('input', (e) => {
    font_size = parseFloat(e.target.value);
    setFontSize();
});