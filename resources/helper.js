// STARTUP AJAX REQUEST
function getNotes(){
    $.ajax({
        url: '/notes',
        type: 'GET',
        success: function(response){
            const notes = JSON.parse(response);
            for(let i = 0; i<notes.length; i++){
                const newNote = new Note(notes[i].title, notes[i].body, notes[i].id);
                renderNote(newNote);
            }
        }
    });
}

function refreshNotes(response){
    $(".note-container").empty(); // CLEAR NOTE CONTAINER
    getNotes();
}

// CREATE NOTE AJAX REQUEST
function createNote(note){
    $.ajax({
        url: '/notes',
        type: 'POST',
        data: note,
        success: refreshNotes
    });
}

// DELETE NOTE AJAX REQUEST
function deleteNote(id){
    $.ajax({
        url: '/notes/'+id,
        type: 'DELETE',
        success: refreshNotes
    });
}

// EDIT NOTE AJAX REQUEST
function editNote(note){
    $.ajax({
        url: '/notes/'+note.id,
        type: 'PUT',
        data: note,
        success: refreshNotes
    });
}


getNotes();