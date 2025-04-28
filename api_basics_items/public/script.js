async function testItems() {
    console.log("Probando creación de items...");
    await fetch('/api/items', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: 'item1', nombre: 'Espada', tipo: 'Arma', efecto: 'Ataque +10'})
    });

    console.log("Obteniendo todos los items...");
    const res = await fetch('/api/items');
    const data = await res.json();
    console.log(data);
}