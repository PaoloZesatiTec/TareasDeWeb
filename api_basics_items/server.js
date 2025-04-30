// Import the express library
import express from 'express'

// Import the file system library
import fs from 'fs'

// Create a new express application
const app = express()

// Define the port to listen on
const port = 3000

// Use the express.json() middleware to parse the body of the request
app.use(express.json())

// The ./public directory will be used to serve static files (html, css, js, images, etc.)
app.use(express.static('./public'))

// The root route will serve the index.html file, which is located in the ./public/html directory
app.get('/', (req, res)=>
    {
        fs.readFile('./public/index.html', 'utf8', 
        (err, html) => {
            if(err)
            {
                res.status(500).send('There was an error: ' + err)
                return 
            }
            
            console.log("Sending page...")
            res.send(html)
            console.log("Page sent!")
        })
    })

    // Datos locales (en memoria)
let itemsCatalog = []; // Lista de items
let users = [];        // Lista de usuarios

app.post('/api/items', (req,res) => {
    const newItems = Array.isArray(req.body) ? req.body : [req.body];
    const messages = [];
    for(let item of newItems){
        const{id,nombre,tipo,efecto} = item;
        
        // Validar que existan todos los campos
        if (!id || !nombre || !tipo || !efecto) {
            return res.status(400).json({ error: "Todos los campos son obligatorios (id, nombre, tipo, efecto)." });
        }
        // Validar que no exista ya el item
        if (itemsCatalog.find(existingItem => existingItem.id === id)) {
            messages.push(`El item con ID ${id} ya existe.`);
        } else {
            itemsCatalog.push(item);
            messages.push(`Item ${id} agregado exitosamente.`);
        }
    }
    
    res.status(201).json({ messages });
});

    
// GET: Obtener todos los items
app.get('/api/items', (req, res) => {
    if (itemsCatalog.length === 0) {
        return res.status(404).json({ message: "No hay items disponibles." });
    }
    res.status(200).json(itemsCatalog);
});

// GET: Obtener todos los usuarios con de items
app.get('/api/users', (req, res) => {
    if (users.length === 0) {
        return res.status(404).json({ message: "No hay usuarios disponibles." });
    }

    const enrichedUsers = users.map(user => ({
        ...user,  // copy id, nombre, correo
        items: user.items.map(itemId => itemsCatalog.find(item => item.id === itemId))
    }));

    res.status(200).json(enrichedUsers);
});

// GET: Obtener un solo item por su ID
app.get('/api/items/:id', (req, res) => {
    const itemId = req.params.id;
    const item = itemsCatalog.find(i => i.id === itemId);

    if (!item) {
        return res.status(404).json({ message: `Item con ID ${itemId} no encontrado.` });
    }

    res.status(200).json(item);
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
