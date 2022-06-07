const IPFS = require('ipfs-core');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 8080;
let node;

app.use(express.static(__dirname+'/resources'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile('resources/index.html', { root: __dirname });
});

app.get('/notes', (req, res) => {
    getData().then((data) => {
        res.send(data).status(200);
    });
});

app.post('/notes', (req, res) => {
    getData().then((data) => {
        const parsedData = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuidv4();
        parsedData.push(newNote);
        
        node.files.write('/notes.json', new TextEncoder().encode(JSON.stringify(parsedData))).then(()=>{
            res.send("The Note has been created").status(200);
        });
    });
    
});

app.put('/notes/:id', (req, res) => {
    getData().then((data) => {
        const parsedData = JSON.parse(data);

        const newNote = req.body;

        let editIdx = -1;
        for(var i = 0; i<parsedData.length; i++){
            if (parsedData[i].id === req.params.id){
                editIdx = i;
            }
        }
        if (editIdx >= 0){
            parsedData.splice(editIdx, 1);
            parsedData.push(newNote);
            node.files.write('/notes.json', new TextEncoder().encode(JSON.stringify(parsedData)), { truncate: true }).then(() => {
                res.send("The note has been edited").status(200);
            });
        }
    });
});

app.delete('/notes/:id', async (req, res) => {
    getData().then((data) => {
        const parsedData = JSON.parse(data);

        let removeIdx = -1;
        for(var i = 0; i<parsedData.length; i++){
            if (parsedData[i].id === req.params.id){
                removeIdx = i;
            }
        }
        if (removeIdx >= 0){
            parsedData.splice(removeIdx, 1);
            node.files.write('/notes.json', new TextEncoder().encode(JSON.stringify(parsedData)), { truncate: true }).then(() => {
                res.send("The note has been removed").status(200);
            });
        }
    });
});

// ----------- Util functions --------------//
async function initializeNetwork(){
    node = await IPFS.create({ cid: 'QmdyyWzBrsJrngzcmeuPwecqUhpnhQV3jbcgSMF5AgHK3b' });
    let notesFile;
    //await node.files.rm('/notes.json'); // FOR DEBUGING PURPOSES, PLEASE DELETE
    try {
        notesFile = await node.files.stat('/notes.json');
    } catch (e) {
        notesFile = await node.files.write('/notes.json', new TextEncoder().encode(JSON.stringify([])), { create: true });
    }
    console.log("Service ready: Connection stablished");
}

async function getData(){
    let data = ''
    for await (const chunk of node.files.read('/notes.json')) {
        data += chunk.toString();
    }
    return data;
}


// ------------- App Initialization -----------//
initializeNetwork().then(()=>{
    app.listen(port, ()=>{ console.log(`Listening on port ${port}`) });
});