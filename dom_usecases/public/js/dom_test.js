const PORT = 7500;
const API = `http://localhost:${PORT}/api`;

// Helpers
function createListElement(text) {
  const li = document.createElement('li');
  li.textContent = text;
  return li;
}

// ============ ITEM HANDLERS ============

// Register Item
document.getElementById('itemForm').addEventListener('submit', async e => {
  e.preventDefault();
  const item = {
    id: parseInt(document.getElementById('itemId').value),
    nombre: document.getElementById('itemNombre').value,
    tipo: document.getElementById('itemTipo').value,
    efecto: document.getElementById('itemEfecto').value
  };
  const res = await fetch(`${API}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  const json = await res.json();
  alert(json.messages?.join('\n') || json.error);
});

// Get Items
document.getElementById('getItemForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('getItemId').value;
  const res = await fetch(id ? `${API}/items/${id}` : `${API}/items`);
  const json = await res.json();
  const list = document.getElementById('itemList');
  list.innerHTML = '';
  if (Array.isArray(json)) {
    json.forEach(item => list.appendChild(createListElement(`${item.id} - ${item.nombre} (${item.tipo}): ${item.efecto}`)));
  } else if (json.nombre) {
    list.appendChild(createListElement(`${json.id} - ${json.nombre} (${json.tipo}): ${json.efecto}`));
  } else {
    alert(json.message);
  }
});

// Update Item
document.getElementById('updateItemForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('updateItemId').value;
  const body = {
    nombre: document.getElementById('updateItemNombre').value,
    tipo: document.getElementById('updateItemTipo').value,
    efecto: document.getElementById('updateItemEfecto').value
  };
  const res = await fetch(`${API}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  alert(json.message || json.error);
});

// Delete Item
document.getElementById('deleteItemForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('deleteItemId').value;
  const res = await fetch(`${API}/items/${id}`, { method: 'DELETE' });
  const json = await res.json();
  alert(json.message);
});

// ============ USER HANDLERS ============

// Register User
document.getElementById('userForm').addEventListener('submit', async e => {
  e.preventDefault();
  const user = {
    id: parseInt(document.getElementById('userId').value),
    nombre: document.getElementById('userNombre').value,
    correo: document.getElementById('userCorreo').value,
    items: document.getElementById('userItems').value.split(',').map(x => parseInt(x.trim()))
  };
  const res = await fetch(`${API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  const json = await res.json();
  alert(json.messages?.join('\n') || json.error);
});

// Get Users
document.getElementById('getUserForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('getUserId').value;
  const res = await fetch(id ? `${API}/users/${id}` : `${API}/users`);
  const json = await res.json();
  const list = document.getElementById('userList');
  list.innerHTML = '';
  if (Array.isArray(json)) {
    json.forEach(u => {
      const itemsStr = u.items.map(i => `${i.nombre} (${i.tipo})`).join(', ');
      list.appendChild(createListElement(`${u.id} - ${u.nombre} (${u.correo}) => Items: ${itemsStr}`));
    });
  } else if (json.nombre) {
    const itemsStr = json.items.map(i => `${i.nombre} (${i.tipo})`).join(', ');
    list.appendChild(createListElement(`${json.id} - ${json.nombre} (${json.correo}) => Items: ${itemsStr}`));
  } else {
    alert(json.message);
  }
});

// Update User
document.getElementById('updateUserForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('updateUserId').value;
  const body = {
    nombre: document.getElementById('updateUserNombre').value,
    correo: document.getElementById('updateUserCorreo').value,
    items: document.getElementById('updateUserItems').value ? document.getElementById('updateUserItems').value.split(',').map(x => parseInt(x.trim())) : undefined
  };
  const res = await fetch(`${API}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  alert(json.message || json.error);
});

// Delete User
document.getElementById('deleteUserForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('deleteUserId').value;
  const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
  const json = await res.json();
  alert(json.message);
});
