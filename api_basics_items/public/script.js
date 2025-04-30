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
