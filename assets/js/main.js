const inputCargo = document.querySelector("#cargo");
const inputEmpresa = document.querySelector("#empresa");
const inputFecha = document.querySelector("#fecha");
const inputNota = document.querySelector("#nota");
const btnGuardar = document.querySelector("#guardar");
const contenedorPostulaciones = document.querySelector("#postulaciones");
const btnEliminar = document.querySelectorAll(".btnEliminar");

let db;
let openRequest = indexedDB.open("postulaciones", 1);

openRequest.onupgradeneeded = function () {
  db = openRequest.result;
  if (!db.objectStoreNames.contains("postulaciones")) {
    db.createObjectStore("postulaciones", {
      keyPath: "id",
      autoIncrement: true,
    });
  }
};

openRequest.onsuccess = function () {
  db = openRequest.result;
  console.log("Base de datos abierta exitosamente");
  obtenerPostulaciones();

  // Manejar la lógica de guardar aquí ya que db está disponible
  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();
    const datos = {
      cargo: inputCargo.value,
      empresa: inputEmpresa.value,
      fecha: inputFecha.value,
      nota: inputNota.value,
    };

    if (
      datos.cargo === "" ||
      datos.empresa === "" ||
      datos.fecha === "" ||
      datos.nota === ""
    ) {
      alert("Falta rellenar campos");
      return;
    }
    guardarPostulacion(datos);
    limpiarFormulario();
  });
};

openRequest.onerror = function () {
  console.error("Error al abrir la base de datos:", openRequest.error);
};

const guardarPostulacion = ({ cargo, empresa, fecha, nota }) => {
  if (!db) {
    console.error("La base de datos no está lista");
    return;
  }

  let transaction = db.transaction("postulaciones", "readwrite");
  let store = transaction.objectStore("postulaciones");

  let request = store.add({
    cargo,
    empresa,
    fecha,
    nota,
  });

  request.onsuccess = function () {
    console.log("Postulación guardada exitosamente");
    obtenerPostulaciones(); // Actualizar la lista de postulaciones en la UI
  };

  request.onerror = function () {
    console.error("Error al guardar la postulación:", request.error);
  };
};

const obtenerPostulaciones = () => {
  if (!db) {
    console.error("La base de datos no está lista");
    return;
  }
  let transaction = db.transaction("postulaciones", "readonly");
  let store = transaction.objectStore("postulaciones");

  let request = store.getAll();

  request.onsuccess = function () {
    console.log("Postulaciones obtenidas:", request.result);
    renderizarPostulaciones(request.result);
  };

  request.onerror = function () {
    console.error("Error al obtener las postulaciones:", request.error);
  };
};

const renderizarPostulaciones = (postulaciones) => {
  contenedorPostulaciones.innerHTML = ""; // Limpiar el contenedor
  postulaciones.forEach((postulacion) => {
    const div = document.createElement("div");
    div.classList.add("m-4", "w-50");
    div.innerHTML = `
                    <li class="list-group-item rounded"><strong>Cargo:</strong> ${postulacion.cargo}</li>
                    <li class="list-group-item rounded"><strong>Empresa:</strong> ${postulacion.empresa}</li>
                    <li class="list-group-item rounded"><strong>Fecha:</strong> ${postulacion.fecha}</li>
                    <li class="list-group-item rounded"><strong>Nota:</strong> ${postulacion.nota}</li>
                    <button class="btn btn-danger my-2" onclick="eliminarPostulacion(${postulacion.id})">Eliminar</button>
            `;
    contenedorPostulaciones.appendChild(div);
  });
};
const eliminarPostulacion = (id) => {
  let transaction = db.transaction("postulaciones", "readwrite");
  let store = transaction.objectStore("postulaciones");

  let request = store.delete(id);

  request.onsuccess = function () {
    console.log("Postulación eliminada exitosamente");
    obtenerPostulaciones();
  };

  request.onerror = function () {
    console.error("Error al eliminar la postulación:", request.error);
  };
};

const limpiarFormulario = () => {
  inputCargo.value = "";
  inputEmpresa.value = "";
  inputFecha.value = "";
  inputNota.value = "";
  return;
};
