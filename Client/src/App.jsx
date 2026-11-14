import { useEffect, useState } from "react";

const API_URL = "http://localhost:2900/api/productos";

function App() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [existencia, setExistencia] = useState("");

  // Consultar productos al cargar React
  async function obtenerProductos() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setProductos(data);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Registrar un producto
  async function registrarProducto(e) {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          precio: Number(precio),
          existencia: Number(existencia)
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setNombre("");
      setPrecio("");
      setExistencia("");

      obtenerProductos();

    } catch (error) {
      alert(error.message);
    }
  }

  // Vender una unidad
  async function venderProducto(id) {
    try {
      const response = await fetch(`${API_URL}/${id}/vender`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cantidad: 1 })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      obtenerProductos();

    } catch (error) {
      alert(error.message);
    }
  }

  async function eliminarProducto(id){
    try{
      const response = await fetch(`${API_URL}/${id}`,{
        method: "DELETE"
      });
      if (!response.ok){
        throw new Error ("No se pudo eliminar el producto");
      }  
      obtenerProductos();
    } catch (error){
      alert(error.message)
    }
  }

  return (
    <main>
      <h1>ApiLonja</h1>

      <h2>Registrar producto</h2>

      <form onSubmit={registrarProducto}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <input
          type="number"
          placeholder="Existencia"
          value={existencia}
          onChange={(e) => setExistencia(e.target.value)}
          min="0"
          required
        />

        <button type="submit">
          Registrar
        </button>
      </form>

      <h2>Productos disponibles</h2>

      {productos.map((producto) => (
        <article key={producto.id}>
          <h3>{producto.nombre}</h3>

          <p>Precio: ${producto.precio}</p>

          <p>Existencia: {producto.existencia}</p>

          <button
            onClick={() => venderProducto(producto.id)}
            disabled={producto.existencia <= 0}
          >
            Vender una unidad
          </button>
          <button
            onClick={() => eliminarProducto(producto.id)}
          >
            Eliminar producto
          </button>
        </article>
      ))}
    </main>
  );
}

export default App;