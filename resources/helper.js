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

// CREATE NOTE AJAX REQUEST
function createNote(note){
    $.ajax({
        url: '/notes',
        type: 'POST',
        data: note,
        success: function(response){
            $(".note-container").empty(); // CLEAR NOTE CONTAINER
            getNotes();
        }
    });
}


getNotes();