// Import the express library
import express from 'express'

// Import the file system library
import fs from 'fs'

// Create a new express application
const app = express()

// Define the port to listen on
const port = 7500

// Use the express.json() middleware to parse the body of the request
app.use(express.json())

// The ./public directory will be used to serve static files (html, css, js, images, etc.)
app.use(express.static('./public'))

// Redirige directamente a la vista
app.get('/', (req, res) => {
    res.redirect('html/index.html');
  });
  


// Datos locales (en memoria)
let itemsCatalog = [
    { id: 1, nombre: 'Healing Potion', tipo: 'Potion', efecto: 'Restores 50 HP' },
    { id: 2, nombre: 'Mana Potion', tipo: 'Potion', efecto: 'Restores 30 MP' },
    { id: 3, nombre: 'Iron Sword', tipo: 'Weapon', efecto: 'Basic melee weapon' }
];

let users = [
    { id: 1, nombre: 'John Doe', correo: 'john@example.com', items: [1, 2] },
    { id: 2, nombre: 'Jane Smith', correo: 'jane@example.com', items: [3] }
];

// POST: Agregar uno o varios items
app.post('/api/items', (req, res) => {
    const newItems = Array.isArray(req.body) ? req.body : [req.body];
    const messages = [];

    for (let item of newItems) {
        const { id, nombre, tipo, efecto } = item;

        if (!id || !nombre || !tipo || !efecto) {
            return res.status(400).json({ error: "Todos los campos son obligatorios (id, nombre, tipo, efecto)." });
        }

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

// GET: Obtener un solo item por su ID
app.get('/api/items/:id', (req, res) => {
    const itemId = req.params.id;
    const item = itemsCatalog.find(i => String(i.id) === itemId);

    if (!item) {
        return res.status(404).json({ message: `Item con ID ${itemId} no encontrado.` });
    }

    res.status(200).json(item);
});

// PUT: Actualizar un item por ID
app.put('/api/items/:id', (req, res) => {
    const itemId = req.params.id;
    const index = itemsCatalog.findIndex(item => String(item.id) === itemId);

    if (index === -1) {
        return res.status(404).json({ message: `Item con ID ${itemId} no encontrado.` });
    }

    const { nombre, tipo, efecto } = req.body;

    if (nombre) itemsCatalog[index].nombre = nombre;
    if (tipo) itemsCatalog[index].tipo = tipo;
    if (efecto) itemsCatalog[index].efecto = efecto;

    res.status(200).json({ message: `Item ${itemId} actualizado.`, item: itemsCatalog[index] });
});

// DELETE: Borrar un item por ID
app.delete('/api/items/:id', (req, res) => {
    const itemId = req.params.id;
    const index = itemsCatalog.findIndex(item => String(item.id) === itemId);

    if (index === -1) {
        return res.status(404).json({ message: `Item con ID ${itemId} no encontrado.` });
    }

    itemsCatalog.splice(index, 1);
    res.status(200).json({ message: `Item ${itemId} eliminado correctamente.` });
});

// POST: Registrar uno o varios usuarios
app.post('/api/users', (req, res) => {
    const newUsers = Array.isArray(req.body) ? req.body : [req.body];
    const messages = [];

    for (let user of newUsers) {
        const { id, nombre, correo, items } = user;

        if (!id || !nombre || !correo || !Array.isArray(items)) {
            return res.status(400).json({ error: "Todos los campos (id, nombre, correo, items) son obligatorios." });
        }

        if (users.find(u => u.id === id)) {
            messages.push(`El usuario con ID ${id} ya existe.`);
            continue;
        }

        const invalidItems = items.filter(itemId => !itemsCatalog.find(i => String(i.id) === String(itemId)));
        if (invalidItems.length > 0) {
            messages.push(`El usuario con ID ${id} tiene items inválidos: ${invalidItems.join(', ')}`);
            continue;
        }

        users.push({ id, nombre, correo, items });
        messages.push(`Usuario ${id} agregado correctamente.`);
    }

    res.status(201).json({ messages });
});

// GET: Obtener todos los usuarios con sus items
app.get('/api/users', (req, res) => {
    if (users.length === 0) {
        return res.status(404).json({ message: "No hay usuarios disponibles." });
    }

    const enrichedUsers = users.map(user => ({
        ...user,
        items: user.items.map(itemId => itemsCatalog.find(item => item.id === itemId))
    }));

    res.status(200).json(enrichedUsers);
});

// GET: Obtener un usuario por ID
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(u => String(u.id) === userId);

    if (!user) {
        return res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` });
    }

    const enrichedUser = {
        ...user,
        items: user.items.map(itemId => itemsCatalog.find(item => item.id === itemId))
    };

    res.status(200).json(enrichedUser);
});

// PUT: Actualizar un usuario por ID
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const index = users.findIndex(u => String(u.id) === userId);

    if (index === -1) {
        return res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` });
    }

    const { nombre, correo, items } = req.body;

    if (items && Array.isArray(items)) {
        const invalidItems = items.filter(itemId => !itemsCatalog.find(i => i.id === itemId));
        if (invalidItems.length > 0) {
            return res.status(400).json({ message: `Items inválidos: ${invalidItems.join(', ')}` });
        }
        users[index].items = items;
    }

    if (nombre) users[index].nombre = nombre;
    if (correo) users[index].correo = correo;

    res.status(200).json({ message: `Usuario ${userId} actualizado.`, user: users[index] });
});

// DELETE: Eliminar un usuario por ID
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const index = users.findIndex(u => String(u.id) === userId);

    if (index === -1) {
        return res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` });
    }

    users.splice(index, 1);
    res.status(200).json({ message: `Usuario ${userId} eliminado correctamente.` });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
