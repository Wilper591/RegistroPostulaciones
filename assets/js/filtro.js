const inputBuscarEmpresa = document.querySelector("#buscarEmpresa");
const btnBuscarEmpresa = document.querySelector("#btnBuscarEmpresa");
const selectOrdenFecha = document.querySelector("#ordenFecha");

btnBuscarEmpresa.addEventListener("click", (e) => {
  e.preventDefault();
  const empresaBuscar = inputBuscarEmpresa.value.toLowerCase();

  let transaction = db.transaction("postulaciones", "readonly");
  let store = transaction.objectStore("postulaciones");

  let request = store.getAll();

  request.onsuccess = function () {
    const postulacionesFiltradas = request.result.filter((postulacion) =>
      postulacion.empresa.toLowerCase().includes(empresaBuscar)
    );
    renderizarPostulaciones(postulacionesFiltradas);
  };

  request.onerror = function () {
    console.error("Error al obtener las postulaciones:", request.error);
  };
});

btnOrdenarFecha.addEventListener("click", (e) => {
  e.preventDefault();

  let transaction = db.transaction("postulaciones", "readonly");
  let store = transaction.objectStore("postulaciones");

  let request = store.getAll();

  request.onsuccess = function () {
    const tipoOrden = selectOrdenFecha.value; // 'asc' o 'desc'

    const postulacionesOrdenadas = request.result.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);

      if (tipoOrden === "asc") {
        return fechaA - fechaB; // Más antigua primero
      } else {
        return fechaB - fechaA; // Más reciente primero
      }
    });

    renderizarPostulaciones(postulacionesOrdenadas);
  };

  request.onerror = function () {
    console.error("Error al obtener las postulaciones:", request.error);
  };
});
