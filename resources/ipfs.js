let IPFSNet;
let documentID = 'QmdyyWzBrsJrngzcmeuPwecqUhpnhQV3jbcgSMF5AgHK3b';
let notitas = [];

async function configureNet () {
    IPFSNet = await window.IpfsCore.create({ cid: documentID });
    let stats;
    try {
        stats = await IPFSNet.files.stat('/notes.json');
    } catch (e) {
        stats = await IPFSNet.files.write('/notes.json', new TextEncoder().encode(JSON.stringify(notitas)), { create: true });
    }
    console.log("Service ready: Connection stablished");
    fetchData();
}

async function addNote(note){
    notitas.push(note);
    await IPFSNet.files.write('/notes.json', new TextEncoder().encode(JSON.stringify(notitas)));
}

async function removeNote(id){
    let removeIdx = -1;
    for(var i = 0; i<notitas.length; i++){
        if (notitas[i].id === id){
            removeIdx = i;
        }
    }
    if (removeIdx >= 0){
        notitas.splice(removeIdx,1);
        await IPFSNet.files.write('/notes.json', new TextEncoder().encode(JSON.stringify(notitas)), { truncate: true });
    }
}

async function readFile() {
    let data = ''
    for await (const chunk of IPFSNet.files.read('/notes.json')) {
        data += chunk.toString()
    }
    return data;
}


async function fetchData(){
    const data = await readFile();
    notitas = JSON.parse(data);
    for(var i = 0; i<notitas.length; i++){
        let newNote = new Note(notitas[i].title, notitas[i].body, notitas[i].id);
        addNotes(newNote);
    }
}

configureNet();