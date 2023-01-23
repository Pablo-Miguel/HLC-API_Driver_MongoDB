const express = require('express');
const { crearContacto, buscarContacto } = require('./utils/crudDB');

const app = express();
app.use(express.json());

app.post('/crearcontacto', (req, res) => {

    const { dni, nombre, edad, telefono } = req.body;

    crearContacto(dni, nombre, edad, telefono, (error, obj)=>{
        if(error){
            return res.send({ error });
        }

        res.send(obj);
        
    });
})

app.get('/buscarcontacto', (req, res) => {

    if(!req.query.id){
        return res.send({ error: "The param Id doesn't exists!" });
    }

    buscarContacto(req.query.id, (error, obj)=>{
        if(error){
            return res.send({ error });
        }

        res.send(obj);
        
    });
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.');
});