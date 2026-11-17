import { useEffect, useState } from "react";
import ProductAvaible from "../components/ProductAvaible.jsx";
import { createCompra, getCompras } from "../services/compra.js";
import { getLotes } from "../services/lote.js";
import { generateOrderTicket } from "../utils/generateOrderTicket.js";
import "../styles/dashboard.css";

const paymentMethods = [
    { id: "visa", name: "Visa", description: "Tarjeta de crédito o débito" },
    { id: "mastercard", name: "Mastercard", description: "Tarjeta de crédito o débito" },
    { id: "amex", name: "American Express", description: "Tarjeta de crédito" },
];

function getLotTotal(lote) {
    return Number(lote.kilos) * Number(lote.precio_kilo_salida);
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);
}

function getOrderStatusLabel(status) {
    const labels = {
        pendiente: "Pendiente",
        confirmada: "Confirmado",
        en_preparacion: "En preparación",
        entregada: "Entregado",
        cancelada: "Cancelado",
    };
    return labels[status] || status || "Sin estado";
}

function formatOrderDate(value) {
    if (!value) return "Fecha no disponible";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "Fecha no disponible"
        : date.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

function Dashboard() {
    const [lotes, setLotes] = useState([]);
    const [activeView, setActiveView] = useState("lotes");
    const [cartItems, setCartItems] = useState([]);
    const [loadingLots, setLoadingLots] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");
    const [ticketError, setTicketError] = useState("");
    const [ticketGenerating, setTicketGenerating] = useState(false);
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
    const [checkoutError, setCheckoutError] = useState("");
    const [purchaseNotice, setPurchaseNotice] = useState("");
    const [isPurchasing, setIsPurchasing] = useState(false);

    useEffect(() => {
        let cancelled = false;
        getLotes()
            .then((data) => {
                if (!cancelled) setLotes(data.filter((lote) => !lote.compra));
            })
            .catch((error) => {
                if (!cancelled) setLoadError(error.message);
            })
            .finally(() => {
                if (!cancelled) setLoadingLots(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    function addToCart(lote) {
        setPurchaseNotice("");
        setCartItems((items) => items.some((item) => item.id_lte === lote.id_lte) ? items : [...items, lote]);
    }

    function removeFromCart(loteId) {
        setCartItems((items) => items.filter((item) => item.id_lte !== loteId));
    }

    function openCheckout(items) {
        if (!items.length) return;
        setCheckoutItems(items);
        setPaymentMethod(paymentMethods[0].id);
        setCheckoutError("");
        setPurchaseNotice("");
        setCheckoutOpen(true);
    }

    async function loadOrders() {
        setOrdersLoading(true);
        setOrdersError("");
        try {
            const data = await getCompras();
            setOrders(data);
        } catch (error) {
            setOrdersError(error.message);
        } finally {
            setOrdersLoading(false);
        }
    }

    function showOrders() {
        setActiveView("pedidos");
        if (!ordersLoading) loadOrders();
    }

    async function downloadTicket(order) {
        setTicketError("");
        setTicketGenerating(true);
        try {
            await generateOrderTicket(order);
        } catch (error) {
            setTicketError(error instanceof Error ? error.message : "No se pudo generar el ticket.");
        } finally {
            setTicketGenerating(false);
        }
    }

    async function confirmPurchase() {
        setIsPurchasing(true);
        setCheckoutError("");
        const purchasedIds = new Set();
        const successfulOrders = [];
        const failures = [];

        for (const lote of checkoutItems) {
            try {
                const result = await createCompra({ id_lte: lote.id_lte });
                purchasedIds.add(lote.id_lte);
                if (result.compra) successfulOrders.push(result.compra);
            } catch (error) {
                failures.push({ lote, message: error.message });
            }
        }

        if (purchasedIds.size) {
            const remainingItems = checkoutItems.filter((lote) => !purchasedIds.has(lote.id_lte));
            setLotes((items) => items.filter((lote) => !purchasedIds.has(lote.id_lte)));
            setCartItems((items) => items.filter((lote) => !purchasedIds.has(lote.id_lte)));
            setOrders((items) => [...successfulOrders, ...items.filter((order) => !purchasedIds.has(order.id_cmp))]);
            setCheckoutItems(remainingItems);

            if (!remainingItems.length) {
                setCheckoutOpen(false);
                setPurchaseNotice(`Se registró${purchasedIds.size > 1 ? "n" : ""} ${purchasedIds.size} pedido${purchasedIds.size > 1 ? "s" : ""} correctamente.`);
            }
        }

        if (failures.length) {
            const completedCount = purchasedIds.size;
            const failedMessage = failures[0].message;
            setCheckoutError(completedCount
                ? `Se registraron ${completedCount} pedido(s), pero algunos no se pudieron completar. ${failedMessage}`
                : failedMessage);
        }

        setIsPurchasing(false);
    }

    const availableLots = lotes.filter((lote) => !lote.compra);
    const cartTotal = cartItems.reduce((total, lote) => total + getLotTotal(lote), 0);

    return(
        <div className="dashboard"> 
            <section className=" hero-container">
                <div className="hero-element element-top">
                    <span>· Mercado Mayorista · Veracruz</span>
                </div>
                <div className="hero-element element-h1">
                    <h1>Lo mejor de la <span>marea de hoy</span></h1>
                    <p><strong>La pesca de esta mañana, lista para tu negocio</strong></p>
                </div>
                <div className="hero-element element-bottom">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M13.41,11.41Q14,10.83 14,10q0-0.83-0.59-1.41T12,8T10.59,8.59T10,10t0.59,1.41T12,12t1.41-0.59ZM12,19.35q3.05-2.8 4.53-5.09Q18,11.98 18,10.2q0-2.73-1.74-4.46Q14.53,4 12,4T7.74,5.74Q6,7.47 6,10.2q0,1.78 1.48,4.06T12,19.35ZM12,22q-4.02-3.43-6.01-6.36T4,10.2Q4,6.45 6.41,4.22T12,2t5.59,2.22T20,10.2q0,2.5-1.99,5.44Q16.03,18.58 12,22Zm0-12Z"/></svg>
                    <p><strong>Muelle de Veracruz</strong> <span>|</span> </p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M15.3,16.7l1.4-1.4L13,11.6V7H11v5.4l4.3,4.3ZM12,22q-2.07,0-3.9-0.79q-1.82-0.79-3.17-2.14Q3.58,17.73 2.79,15.9T2,12Q2,9.92 2.79,8.1Q3.58,6.27 4.93,4.93Q6.28,3.57 8.1,2.79Q9.93,2 12,2t3.9,0.79t3.17,2.14q1.35,1.35 2.14,3.17Q22,9.92 22,12t-0.79,3.9t-2.14,3.17q-1.35,1.35-3.17,2.14T12,22Zm0-10Zm0,8q3.33,0 5.66-2.34T20,12q0-3.33-2.34-5.66T12,4Q8.68,4 6.34,6.34T4,12t2.34,5.66T12,20Z"/></svg>
                    <p><strong>Ingreso desde las 02:00</strong></p>
                </div>
            </section>

            <section className={`products-container${activeView === "pedidos" ? " orders-view" : ""}`}>
                <div className="products-element element-products">
                    <div className="products-buttons">
                        <button className={activeView === "lotes" ? "is-active" : ""} type="button" aria-pressed={activeView === "lotes"} onClick={() => setActiveView("lotes")}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M6.75,19.25Q5,17.5 5,15V9l5,5L8.6,15.43L7,13.83V15q0,1.65 1.18,2.82T11,19t2.83-1.18T15,15V11.83q-0.9-0.35-1.45-1.11T13,9t0.55-1.71T15,6.18V2h2V6.18q0.9,0.35 1.45,1.11T19,9t-0.55,1.72T17,11.83V15q0,2.5-1.75,4.25T11,21T6.75,19.25Zm9.96-9.54Q17,9.42 17,9q0-0.43-0.29-0.71T16,8T15.29,8.29T15,9q0,0.42 0.29,0.71T16,10q0.43,0 0.71-0.29ZM16,9Z"/></svg>
                            Lotes disponibles
                        </button>
                        <button className={activeView === "pedidos" ? "is-active" : ""} type="button" aria-pressed={activeView === "pedidos"} disabled={ordersLoading} onClick={showOrders}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M5.59,21.41Q5,20.83 5,20t0.59-1.41T7,18q0.83,0 1.41,0.59Q9,19.18 9,20T8.41,21.41Q7.83,22 7,22T5.59,21.41Zm10,0Q15,20.83 15,20t0.59-1.41T17,18t1.41,0.59Q19,19.18 19,20t-0.59,1.41T17,22t-1.41-0.59ZM6.15,6l2.4,5h7L18.3,6H6.15ZM5.2,4H19.95q0.57,0 0.88,0.51t0.02,1.04l-3.55,6.4q-0.27,0.5-0.74,0.78T15.55,13H8.1L7,15H19v2H7q-1.13,0-1.7-0.99q-0.58-0.99-0.05-1.96L6.6,11.6L3,4H1V2H4.25L5.2,4Zm3.35,7h7h-7Z"/></svg>
                            Mis pedidos
                        </button>
                    </div>

                    {activeView === "lotes" ? (
                    <div className="products-avaible">
                        <span className="pre-h2">Selección del Día</span>
                        <h2>Disponibles esta mañana</h2>
                        <p><small>Precios por kilogramo · cantidades sujetas a disponibilidad</small></p>
                        <form action="" className="search-products">
                            <div className="input-search">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M19.6,21l-6.3-6.3q-0.75,0.6-1.72,0.95T9.5,16q-2.72,0-4.61-1.89Q3,12.23 3,9.5Q3,6.77 4.89,4.89T9.5,3t4.61,1.89T16,9.5q0,1.1-0.35,2.07T14.7,13.3L21,19.6L19.6,21ZM9.5,14q1.88,0 3.19-1.31T14,9.5T12.69,6.31T9.5,5T6.31,6.31T5,9.5t1.31,3.19T9.5,14Z"/></svg>
                                <input type="text" name="search" id="search" placeholder="Busca una especie, presentacion u origen"/>
                            </div>
                            <div className="input-filter">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M10,18V16h4v2H10ZM6,13V11H18v2H6ZM3,8V6H21V8H3Z"/></svg>
                                <select name="type-products" id="type-products">
                                    <option value="">Todos los productos</option>
                                    <option value="">Productos</option>
                                </select>
                            </div>
                            <div className="order">
                                <select name="order" id="order">
                                    <option value="asc-price">Menor Precio</option>
                                    <option value="desc-price">Mayor Precio</option>
                                    <option value="asc-name">Nombre: A-Z</option>
                                    <option value="desc-name">Nombre: Z-A</option>
                                    <option value="newest">Más recientes</option>
                                </select>
                            </div>
                        </form>
                        <div className="products-avaibles">
                            {loadError && <p className="dashboard-alert" role="alert">{loadError}</p>}
                            {loadingLots ? <p className="dashboard-empty-state">Cargando lotes disponibles…</p> : availableLots.length ? availableLots.map((lote) => (
                                <ProductAvaible
                                    key={lote.id_lte}
                                    lote={lote}
                                    isInCart={cartItems.some((item) => item.id_lte === lote.id_lte)}
                                    onAddToCart={addToCart}
                                    onBuy={(selectedLote) => openCheckout([selectedLote])}
                                />
                            )) : !loadError && <p className="dashboard-empty-state">No hay lotes disponibles por el momento.</p>}
                        </div>
                    </div>
                    ) : (
                        <div className="products-avaible orders-panel">
                            <span className="pre-h2">Tu actividad</span>
                            <h2>Mis pedidos</h2>
                            <p><small>Consulta el estado y el detalle de tus pedidos.</small></p>
                            {ticketError && <p className="dashboard-alert" role="alert">{ticketError}</p>}
                            {ordersLoading ? <p className="dashboard-empty-state">Cargando tus pedidos…</p> : ordersError ? (
                                <div className="dashboard-alert" role="alert">
                                    <span>{ordersError}</span>
                                    <button type="button" onClick={loadOrders}>Reintentar</button>
                                </div>
                            ) : orders.length ? (
                                <div className="orders-list">
                                    {orders.map((order) => (
                                        <article className="order-card" key={order.id_cmp}>
                                            <div className="order-card-heading">
                                                <strong>Pedido #{order.id_cmp}</strong>
                                                <span className={`order-status ${order.estado || "desconocido"}`}>{getOrderStatusLabel(order.estado)}</span>
                                            </div>
                                            <div className="order-card-details">
                                                <strong>{order.lote?.especie?.nombre || `Lote #${order.id_cmp}`}</strong>
                                                <span>{order.lote?.kilos ?? "—"} kg · {order.lote?.numero_cajas ?? "—"} cajas</span>
                                                <span>Solicitado el {formatOrderDate(order.fecha)}</span>
                                            </div>
                                            <div className="order-card-total">
                                                <span>Total del pedido</span>
                                                <strong>{formatCurrency(order.precio_total)}</strong>
                                            </div>
                                            <button className="order-ticket-button" type="button" disabled={ticketGenerating} onClick={() => downloadTicket(order)} aria-label={`Descargar ticket del pedido ${order.id_cmp}`}>
                                                {ticketGenerating ? "Generando…" : "Ticket"}
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            ) : <p className="dashboard-empty-state">Todavía no tienes pedidos solicitados.</p>}
                        </div>
                    )}
                </div>
                {activeView === "lotes" && <div className="products-element element-cart">
                    <div className="cart-container">
                        <small>Tu lista de hoy</small>
                        <h3>Carrito <span className="cart-count">{cartItems.length}</span></h3>
                        {purchaseNotice && <p className="purchase-notice" role="status">{purchaseNotice}</p>}
                        {cartItems.length ? (
                            <>
                                <div className="cart-items">
                                    {cartItems.map((lote) => (
                                        <article className="cart-item" key={lote.id_lte}>
                                            <div>
                                                <strong>{lote.especie?.nombre || "Especie"}</strong>
                                                <small>{lote.kilos} kg · {lote.numero_cajas} cajas</small>
                                            </div>
                                            <div className="cart-item-price">
                                                <strong>{formatCurrency(getLotTotal(lote))}</strong>
                                                <button type="button" onClick={() => removeFromCart(lote.id_lte)} aria-label={`Quitar ${lote.especie?.nombre || "lote"} del carrito`}>Quitar</button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                                <div className="cart-total"><span>Total</span><strong>{formatCurrency(cartTotal)}</strong></div>
                                <button className="cart-checkout-button" type="button" onClick={() => openCheckout(cartItems)}>Continuar compra</button>
                            </>
                        ) : <p className="cart-empty-state">Agrega lotes para comenzar tu compra.</p>}
                    </div>
                </div>}
            </section>
            {checkoutOpen && (
                <div
                    className="payment-modal-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (!isPurchasing && event.target === event.currentTarget) setCheckoutOpen(false);
                    }}
                >
                    <section className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
                        <div className="payment-modal-heading">
                            <div>
                                <span className="pre-h2">Confirmación de pedido</span>
                                <h2 id="payment-modal-title">Elige cómo pagar</h2>
                            </div>
                            <button className="payment-modal-close" type="button" aria-label="Cerrar" disabled={isPurchasing} onClick={() => setCheckoutOpen(false)}>×</button>
                        </div>
                        <div className="payment-order-summary">
                            {checkoutItems.map((lote) => (
                                <div key={lote.id_lte}>
                                    <span>{lote.especie?.nombre || "Especie"} · {lote.kilos} kg</span>
                                    <strong>{formatCurrency(getLotTotal(lote))}</strong>
                                </div>
                            ))}
                            <div className="payment-order-total">
                                <span>Total del pedido</span>
                                <strong>{formatCurrency(checkoutItems.reduce((total, lote) => total + getLotTotal(lote), 0))}</strong>
                            </div>
                        </div>
                        <div className="payment-methods" role="group" aria-label="Selecciona una tarjeta">
                            {paymentMethods.map((method) => (
                                <button
                                    className={`payment-method${paymentMethod === method.id ? " is-selected" : ""}`}
                                    key={method.id}
                                    type="button"
                                    aria-pressed={paymentMethod === method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                >
                                    <span className={`payment-brand ${method.id}`}>{method.name === "American Express" ? "AMEX" : method.name.toUpperCase()}</span>
                                    <span className="payment-method-copy"><strong>{method.name}</strong><small>{method.description}</small></span>
                                    <span className="payment-method-check" aria-hidden="true">{paymentMethod === method.id ? "✓" : ""}</span>
                                </button>
                            ))}
                        </div>
                        {checkoutError && <p className="dashboard-alert" role="alert">{checkoutError}</p>}
                        <button className="payment-confirm-button" type="button" disabled={isPurchasing || !checkoutItems.length} onClick={confirmPurchase}>
                            {isPurchasing ? "Procesando pedido…" : "Comprar"}
                        </button>
                        <p className="payment-disclaimer">El pedido se registrará para confirmación. No se realizará un cargo con tarjeta desde esta página.</p>
                    </section>
                </div>
            )}
        </div>
    )
}

export default Dashboard