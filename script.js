let carrito = [];
let subtotal = 0;

// Cambiar cantidad
function cambiarCantidad(boton, cambio) {
  let span = boton.parentNode.querySelector("span");
  let cantidad = parseInt(span.textContent);
  cantidad += cambio;
  if (cantidad < 0) cantidad = 0;
  span.textContent = cantidad;
}

// Agregar al carrito con opciones
function agregarAlCarrito(nombre, precioBase, boton) {
  let cantidad = parseInt(boton.parentNode.querySelector(".cantidad span").textContent);
  if (cantidad === 0) return; // no agregar si la cantidad es 0

  // Capturar opciones: checkboxes y selects
  let descripcionOpciones = [];
  let precioTotal = precioBase;

  // Opciones tipo checkbox (si las tienes)
  let opciones = boton.parentNode.querySelectorAll(".opcion");
  opciones.forEach(op => {
    if (op.checked) {
      precioTotal += parseInt(op.dataset.precio);
      descripcionOpciones.push(op.parentNode.textContent.trim());
    }
  });

  // Carne seleccionada
  let carneSeleccionada = boton.parentNode.querySelector("input.carne:checked");
  if (carneSeleccionada) descripcionOpciones.push(`Carne: ${carneSeleccionada.value}`);

  // Sazón seleccionada (select)
  let sazonSeleccionada = boton.parentNode.querySelector("select.sazon");
  if (sazonSeleccionada) {
    // Para refrescos, cerveza, malteadas, Freshers o cajita infantil, solo guardar el valor
    if (
      nombre.includes("Refresco") ||
      nombre === "Cerveza 350 ml" ||
      nombre === "Malteada" ||
      nombre === "Freshers" ||
      nombre === "Cajita Chuck Infantil"
    ) {
      descripcionOpciones.push(sazonSeleccionada.value); // solo el sabor o elección
    } else {
      descripcionOpciones.push(`Sazón: ${sazonSeleccionada.value}`); // mantiene Sazón: para otros productos
    }
  }

  // Crear objeto del carrito
  let item = {
    nombre: nombre,
    opciones: descripcionOpciones,
    precio: precioTotal,
    cantidad: cantidad
  };

  carrito.push(item);
  actualizarCarrito();
}

// Actualizar carrito en pantalla
function actualizarCarrito() {
  let lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";
  subtotal = 0;

  carrito.forEach(item => {
    let li = document.createElement("li");
    li.innerHTML = `<strong>${item.nombre}</strong><br>` +
                   item.opciones.map(op => op).join("<br>") +
                   `<br>Cantidad: ${item.cantidad} - Precio: $${item.precio * item.cantidad}`;
    lista.appendChild(li);

    subtotal += item.precio * item.cantidad;
  });

  document.getElementById("subtotal").textContent = subtotal;
  document.getElementById("total").textContent = subtotal;
}

// Botón “Vaciar carrito”
document.getElementById("btn-vaciar-carrito").addEventListener("click", () => {
  carrito = [];
  subtotal = 0;
  actualizarCarrito();
});

// Botón “Realizar pedido” que envía a WhatsApp
document.getElementById("btn-pedido").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let mensaje = "Hola, mi pedido es el siguiente:\n";
  carrito.forEach(item => {
    mensaje += `- ${item.nombre}\n`;
    item.opciones.forEach(op => {
      mensaje += `${op}\n`;
    });
    mensaje += `Cantidad: ${item.cantidad} - Precio: $${item.precio * item.cantidad}\n\n`;
  });
  mensaje += `Total: $${subtotal}`;

  let url = `https://api.whatsapp.com/send?phone=525578335249&text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});

