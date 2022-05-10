const IPFS = require('ipfs-core');
const express = require('express');

const app = express();
const port = 8080;
let node;

async function initializeNetwork(){
    node = await IPFS.create({ cid: 'QmdyyWzBrsJrngzcmeuPwecqUhpnhQV3jbcgSMF5AgHK3b' });
    let notesFile;
    await node.files.rm('/notes.json'); // FOR DEBUGING PURPOSES, PLEASE DELETE
    try {
        notesFile = await node.files.stat('/notes.json');
    } catch (e) {
        notesFile = await node.files.write('/notes.json', new TextEncoder().encode(JSON.stringify([])), { create: true });
    }
    console.log("Service ready: Connection stablished");
}


app.use(express.static(__dirname+'/resources'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function getData(){
    let data = ''
    for await (const chunk of node.files.read('/notes.json')) {
        data += chunk.toString();
    }
    return data;
}


app.get('/', (req, res) => {
    res.sendFile('resources/index.html', { root: __dirname });
});

app.get('/notes', async (req, res) => {
    const data = await getData();
    res.send(data).status(200);
});

app.post('/notes', async (req, res) => {
    const data = await getData();
    const parsedData = JSON.parse(data);
    const newNote = req.body;
    parsedData.push(newNote);
    
    node.files.write('/notes.json', new TextEncoder().encode(JSON.stringify(parsedData))).then(()=>{
        res.send("The Note has been created").status(200);
    });
    
});

app.put('/notes/:id', async (req, res) => {
    const data = await getData();
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

app.delete('/notes/:id', async (req, res) => {
    const data = await getData();
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


initializeNetwork().then(()=>{
    app.listen(port, ()=>{ console.log(`Listening on port ${port}`) });
});