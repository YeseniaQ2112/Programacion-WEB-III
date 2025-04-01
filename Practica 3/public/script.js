document.addEventListener("DOMContentLoaded", function () {
    const itemList = document.getElementById("itemList");
    const addForm = document.getElementById("addForm");
    let editId = null;

    function loadItems() {
        fetch("/items")
            .then(response => response.json())
            .then(items => {
                itemList.innerHTML = "";
                items.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.nombre}</td>
                        <td>${item.edad}</td>
                        <td>${item.especie}</td>
                        <td>${item.sexo}</td>
                        <td>
                            <button class="btn btn-warning btn-sm editBtn" data-id="${item.id}">Editar</button>
                            <button class="btn btn-danger btn-sm deleteBtn" data-id="${item.id}">Eliminar</button>
                        </td>
                    `;
                    itemList.appendChild(row);

                    row.querySelector(".editBtn").addEventListener("click", () => {
                        document.getElementById("nombre").value = item.nombre;
                        document.getElementById("edad").value = item.edad;
                        document.getElementById("especie").value = item.especie;
                        document.getElementById("sexo").value = item.sexo;
                        editId = item.id;
                        addForm.querySelector("button").textContent = "Actualizar";
                    });

                    row.querySelector(".deleteBtn").addEventListener("click", () => deleteItem(item.id));
                });
            });
    }

    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const edad = document.getElementById("edad").value;
        const especie = document.getElementById("especie").value;
        const sexo = document.getElementById("sexo").value;

        const url = editId ? `/update/${editId}` : "/create";
        const method = editId ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, edad, especie, sexo })
        }).then(() => {
            addForm.reset();
            editId = null;
            loadItems();
            addForm.querySelector("button").textContent = "Agregar";
        }).catch(err => console.error("Error:", err));
    });

    function deleteItem(id) {
        fetch(`/delete/${id}`, { method: "DELETE" })
            .then(() => loadItems())
            .catch(err => console.error("Error eliminando:", err));
    }

    loadItems();
});
