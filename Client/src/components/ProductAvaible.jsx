import image from "../assets/images/defaultProductImage.jpg"
import "../styles/productAvaible.css"

function ProductAvaible({ lote, onAddToCart, onBuy, isInCart }) {
    const fecha = new Date(lote.fecha)
    return (
        <div className="card-lote">
            <img src={image} alt={lote.especie?.nombre || "Producto del lote"} />
            <h4>{lote.especie?.nombre || "Especie"}</h4>
            <p>{lote.kilos} Kilos | {lote.numero_cajas} Cajas</p>
            <p>{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(lote.precio_kilo_salida)} / kg</p>
            <p>Publicado el: {Number.isNaN(fecha.getTime()) ? "Fecha no disponible" : fecha.toLocaleDateString("es-MX")}</p>
            <div className="card-buttons">
                <button className="add-cart-button" type="button" onClick={() => onAddToCart(lote)} disabled={isInCart}>
                    {isInCart ? "En el carrito" : "Agregar al carrito"}
                </button>
                <button className="buy-button" type="button" onClick={() => onBuy(lote)}>Comprar</button>
            </div>
        </div>
    )
}

export default ProductAvaible