async function testItems() {
    console.log("Probando creación de items...");
    await fetch('/api/items', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: '12', nombre: 'Espada', tipo: 'Arma', efecto: 'Ataque +10'})
    });

    console.log("Obteniendo todos los items...");
    const res = await fetch('/api/items');
    const data = await res.json();
    console.log(data);
}

async function getItemById() {
    const itemId = document.getElementById('itemIdInput').value;
    if (!itemId) {
        alert("Por favor escribe un ID.");
        return;
    }

    try {
        const res = await fetch(`/api/items/${itemId}`);
        const data = await res.json();

        const resultContainer = document.getElementById('result');
        resultContainer.innerHTML = '';

        if (res.status === 404) {
            resultContainer.innerHTML = `<p style="color: red;">${data.message}</p>`;
        } else {
            resultContainer.innerHTML = `
                <div><strong>${data.nombre}</strong> (${data.tipo}): ${data.efecto}</div>
            `;
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

async function updateItemById() {
    const id = document.getElementById('updateItemId').value;
    const nombre = document.getElementById('updateNombre').value;
    const tipo = document.getElementById('updateTipo').value;
    const efecto = document.getElementById('updateEfecto').value;

    if (!id) {
        console.error("Debes escribir el ID del item a actualizar.");
        return;
    }

    const updatedFields = {};
    if (nombre) updatedFields.nombre = nombre;
    if (tipo) updatedFields.tipo = tipo;
    if (efecto) updatedFields.efecto = efecto;

    try {
        const res = await fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFields)
        });

        const data = await res.json();

        if (res.status === 404) {
            console.warn("Item no encontrado:", data.message);
        } else {
            console.log(`Item ${id} actualizado exitosamente:`, data.item);
        }

    } catch (err) {
        console.error("Error al actualizar el item:", err);
    }
}

async function deleteItemById() {
    const id = document.getElementById('deleteItemId').value;

    if (!id) {
        console.error("Por favor escribe un ID para eliminar.");
        return;
    }

    try {
        const res = await fetch(`/api/items/${id}`, {
            method: 'DELETE'
        });

        const data = await res.json();

        if (res.status === 404) {
            console.warn("Item no encontrado:", data.message);
        } else {
            console.log(`Item ${id} eliminado correctamente:`, data.message);
        }

    } catch (err) {
        console.error("Error al eliminar el item:", err);
    }
}

