const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");

// Consultar todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar productos" });
  }
});

// Registrar un producto
router.post("/", async (req, res) => {
  try {
    const { nombre, precio, existencia } = req.body;

    // Validaciones del negocio
    if (!nombre || precio <= 0 || existencia < 0) {
      return res.status(400).json({
        error: "Datos del producto inválidos"
      });
    }

    const producto = await Producto.create({
      nombre,
      precio,
      existencia
    });

    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar producto" });
  }
});

// Vender unidades de un producto
router.post("/:id/vender", async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    const cantidad = Number(req.body.cantidad);

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        error: "La cantidad debe ser un entero positivo"
      });
    }

    // Lógica de negocio
    if (producto.existencia < cantidad) {
      return res.status(400).json({
        error: "No hay suficiente existencia"
      });
    }

    producto.existencia -= cantidad;
    await producto.save();

    res.json({
      mensaje: "Venta realizada",
      producto
    });

  } catch (error) {
    res.status(500).json({ error: "Error al realizar la venta" });
  }
});

//Eliminar un producto
router.delete("/:id", async (req, res)=>{
  try{
    const producto = await Producto.findByPk(req.params.id)
    if (!producto){
      return res.status(404).json({error: "Producto no encontrado"})
    }

    await producto.destroy();

    res.status(204).end();

  } catch(error){
    res.status(500).json({error: "Error al eliminar el producto (backend)"})
  }
})

module.exports = router;