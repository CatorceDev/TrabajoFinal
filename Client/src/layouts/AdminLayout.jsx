import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { createEspecie, deleteEspecie, updateEspecie } from "../services/especie.js";
import { createLote, deleteLote, updateLote } from "../services/lote.js";
import { createTipo, deleteTipo, updateTipo } from "../services/tipo.js";
import { getAdminData } from "../services/adminServices.js";
import { updateCompraEstado } from "../services/compra.js";
import "../styles/admin-layout.css";

const navigation = [
    { label: "Resumen", icon: "grid" },
    { label: "Especies", icon: "fish" },
    { label: "Lotes", icon: "box" },
    { label: "Compradores", icon: "users" },
    { label: "Pedidos", icon: "receipt" },
    { label: "Reportes", icon: "chart" },
];

const sectionContent = {
    Especies: {
        eyebrow: "CATÁLOGO",
        title: "Especies",
        description: "Administra las especies del catálogo y sus tipos.",
        firstColumn: "Especie",
        secondColumn: "Lotes registrados",
        thirdColumn: "Imagen",
    },
    Lotes: {
        eyebrow: "INVENTARIO",
        title: "Lotes disponibles",
        description: "Da seguimiento a la disponibilidad de cada lote.",
        firstColumn: "Lote / especie",
        secondColumn: "Cantidad",
        thirdColumn: "Precio / kg",
    },
    Compradores: {
        eyebrow: "CLIENTES",
        title: "Compradores",
        description: "Consulta las cuentas registradas en el mercado.",
        firstColumn: "Comprador",
        secondColumn: "Actividad",
        thirdColumn: "Último pedido",
    },
    Pedidos: {
        eyebrow: "OPERACIÓN",
        title: "Pedidos",
        description: "Revisa y prepara los pedidos más recientes.",
        firstColumn: "Pedido",
        secondColumn: "Cantidad",
        thirdColumn: "Total",
    },
};

const orderStates = [
    { value: "pendiente", label: "Pendiente" },
    { value: "confirmada", label: "Confirmado" },
    { value: "en_preparacion", label: "En preparación" },
    { value: "entregada", label: "Entregado" },
    { value: "cancelada", label: "Cancelado" },
];

const tones = ["coral", "sand", "blue", "green"];

function initials(value = "") {
    return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "LV";
}

function formatCurrency(value, compact = false) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
        ...(compact ? { notation: "compact" } : {}),
    }).format(Number(value) || 0);
}

function formatDate(value, options = { day: "2-digit", month: "short" }) {
    if (!value) return "Sin fecha";
    return new Intl.DateTimeFormat("es-MX", options).format(new Date(value));
}

function isSameDay(first, second) {
    return first.getFullYear() === second.getFullYear()
        && first.getMonth() === second.getMonth()
        && first.getDate() === second.getDate();
}

function statusLabel(status) {
    return orderStates.find((item) => item.value === status)?.label || status || "Sin estado";
}

function statusClass(status) {
    if (["pendiente", "cancelada", "Pendiente", "Por agotarse"].includes(status)) return "pending";
    if (["confirmada", "entregada", "Disponible", "Activo", "Vendido"].includes(status)) return "confirmed";
    return "preparing";
}

function lotStatus(lote) {
    if (lote.compra) return statusLabel(lote.compra.estado);
    return Number(lote.kilos) <= 12 ? "Por agotarse" : "Disponible";
}

function Icon({ name, size = 20 }) {
    const paths = {
        grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
        fish: <><path d="M3 12s3.2-5 9-5c3.5 0 6 2 7.5 5-1.5 3-4 5-7.5 5-5.8 0-9-5-9-5Z" /><path d="m3 12-2-3v6l2-3Z" /><circle cx="16" cy="11" r=".7" fill="currentColor" /></>,
        box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 8 9 5 9-5" /><path d="M3 8v9l9 5 9-5V8M12 13v9" /></>,
        users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
        receipt: <><path d="M4 3h16v18l-3-2-3 2-2-2-3 2-2-2-3 2V3Z" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
        chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /><path d="M15 9h4v4" /></>,
        search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
        bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
        arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
        plus: <><path d="M12 5v14M5 12h14" /></>,
        chevron: <path d="m9 18 6-6-6-6" />,
        filter: <><path d="M4 6h16M7 12h10M10 18h4" /><circle cx="8" cy="6" r="1.5" fill="currentColor" /><circle cx="15" cy="12" r="1.5" fill="currentColor" /></>,
        more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    };

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {paths[name]}
        </svg>
    );
}

function AdminLayout() {
    const session = useOutletContext();
    const usuario = session?.comprador || session;
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("Resumen");
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const [catalogTab, setCatalogTab] = useState("especies");
    const [adminData, setAdminData] = useState({
        especies: [],
        lotes: [],
        tipos: [],
        compradores: [],
        compras: [],
    });
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [speciesDialog, setSpeciesDialog] = useState(null);
    const [speciesForm, setSpeciesForm] = useState({
        nombre: "",
        id_tpo: "",
        imagen: "",
    });
    const [lotDialog, setLotDialog] = useState(null);
    const [lotForm, setLotForm] = useState({
        id_epe: "",
        kilos: "",
        numero_cajas: "",
        precio_kilo_salida: "",
    });
    const [typeDialog, setTypeDialog] = useState(null);
    const [typeForm, setTypeForm] = useState({ nombre: "" });
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const adminName = usuario?.name || usuario?.nombre || "Administrador";
    const isTypesTab = activeSection === "Especies" && catalogTab === "tipos";
    const section = isTypesTab
        ? {
            ...sectionContent.Especies,
            title: "Tipos",
            description: "Administra las categorías de las especies.",
        }
        : sectionContent[activeSection];

    useEffect(() => {
        if (!profileMenuOpen) return undefined;

        function closeOnOutsideClick(event) {
            if (!profileMenuRef.current?.contains(event.target)) setProfileMenuOpen(false);
        }

        function closeOnEscape(event) {
            if (event.key === "Escape") setProfileMenuOpen(false);
        }

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [profileMenuOpen]);

    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getAdminData();
            setAdminData(result);
            setError("");
            setLoaded(true);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        getAdminData()
            .then((result) => {
                if (!cancelled) {
                    setAdminData(result);
                    setError("");
                    setLoaded(true);
                }
            })
            .catch((requestError) => {
                if (!cancelled) setError(requestError.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const speciesRows = useMemo(() => adminData.especies.map((species, index) => ({
        id: species.id_epe,
        name: species.nombre,
        detail: "Especie del catálogo",
        status: species.tipo?.nombre || "Sin tipo",
        amount: `${adminData.lotes.filter((lot) => Number(lot.id_epe) === Number(species.id_epe)).length} lotes`,
        price: species.imagen ? "Asignada" : "Opcional",
        image: species.imagen,
        initials: initials(species.nombre),
        tone: tones[index % tones.length],
        raw: species,
    })), [adminData.especies, adminData.lotes]);

    const lotRows = useMemo(() => adminData.lotes.map((lot, index) => {
        const species = lot.especie;
        return {
            id: lot.id_lte,
            name: `Lote #${lot.id_lte}`,
            detail: species ? `${species.nombre} · ${species.tipo?.nombre || "Sin tipo"}` : "Sin especie asignada",
            status: lotStatus(lot),
            amount: `${Number(lot.kilos)} kg · ${lot.numero_cajas} cajas`,
            price: formatCurrency(lot.precio_kilo_salida),
            initials: initials(species?.nombre || `Lote ${lot.id_lte}`),
            tone: tones[index % tones.length],
            raw: lot,
        };
    }), [adminData.lotes]);

    const typeRows = useMemo(() => adminData.tipos.map((type, index) => ({
        id: type.id_tpo,
        name: type.nombre,
        detail: "Clasificación de especies",
        status: "Tipo",
        amount: `${adminData.especies.filter((species) => Number(species.id_tpo) === Number(type.id_tpo)).length} especies`,
        initials: initials(type.nombre),
        tone: tones[index % tones.length],
        raw: type,
    })), [adminData.tipos, adminData.especies]);

    const buyerRows = useMemo(() => adminData.compradores.map((buyer, index) => {
        const purchases = adminData.compras.filter((order) => Number(order.codigo_cpr) === Number(buyer.codigo_cpr));
        const lastPurchase = purchases[0];
        return {
            id: buyer.codigo_cpr,
            name: [buyer.name, buyer.firstLastName, buyer.secondLastName].filter(Boolean).join(" "),
            detail: buyer.email,
            status: buyer.verify ? "Activo" : "Pendiente",
            amount: `${purchases.length} pedidos`,
            price: lastPurchase ? formatDate(lastPurchase.fecha) : "Sin pedidos",
            initials: initials(`${buyer.name} ${buyer.firstLastName}`),
            tone: tones[index % tones.length],
            raw: buyer,
        };
    }), [adminData.compradores, adminData.compras]);

    const orderRows = useMemo(() => adminData.compras.map((order, index) => {
        const buyer = order.comprador;
        const species = order.lote?.especie;
        const buyerName = [buyer?.name, buyer?.firstLastName].filter(Boolean).join(" ") || "Comprador";
        return {
            id: order.id_cmp,
            name: `Pedido #${order.id_cmp}`,
            detail: buyerName,
            status: order.estado,
            amount: `${Number(order.lote?.kilos || 0)} kg`,
            price: formatCurrency(order.precio_total),
            date: formatDate(order.fecha, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
            initials: initials(buyerName),
            tone: tones[index % tones.length],
            speciesName: species?.nombre || "Especie",
            raw: order,
        };
    }), [adminData.compras]);

    const sectionRows = useMemo(() => {
        if (activeSection === "Especies") return catalogTab === "tipos" ? typeRows : speciesRows;
        if (activeSection === "Lotes") return lotRows;
        if (activeSection === "Compradores") return buyerRows;
        if (activeSection === "Pedidos") return orderRows;
        return [];
    }, [activeSection, catalogTab, speciesRows, typeRows, lotRows, buyerRows, orderRows]);
    const tableRows = useMemo(() => sectionRows.filter((row) => {
        const matchesSearch = `${row.name} ${row.detail} ${row.status} ${row.amount}`.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "todos" || row.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [sectionRows, search, statusFilter]);
    const availableLots = adminData.lotes.filter((lot) => !lot.compra && Number(lot.kilos) > 0);
    const availableLotRows = lotRows.filter((lot) => !lot.raw.compra && Number(lot.raw.kilos) > 0);
    const activeOrders = adminData.compras.filter((order) => ["pendiente", "confirmada", "en_preparacion"].includes(order.estado));
    const today = new Date();
    const todaySales = adminData.compras
        .filter((order) => order.estado !== "cancelada" && isSameDay(new Date(order.fecha), today))
        .reduce((total, order) => total + Number(order.precio_total || 0), 0);
    const weekSales = useMemo(() => {
        const days = Array.from({ length: 7 }, (_, index) => {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() - (6 - index));
            const total = adminData.compras
                .filter((order) => order.estado !== "cancelada" && isSameDay(new Date(order.fecha), date))
                .reduce((sum, order) => sum + Number(order.precio_total || 0), 0);
            return {
                date,
                day: new Intl.DateTimeFormat("es-MX", { weekday: "short" }).format(date).replace(".", ""),
                total,
            };
        });
        const max = Math.max(...days.map((day) => day.total), 1);
        return days.map((day) => ({
            ...day,
            height: Math.max(day.total ? 9 : 4, (day.total / max) * 92),
            value: formatCurrency(day.total, true),
        }));
    }, [adminData.compras]);
    const weekSalesTotal = weekSales.reduce((total, day) => total + day.total, 0);
    const dateHeading = new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(today).toLocaleUpperCase("es-MX");

    function openSpeciesDialog(species = null) {
        setSpeciesForm({
            nombre: species?.nombre || "",
            id_tpo: String(species?.id_tpo || adminData.tipos[0]?.id_tpo || ""),
            imagen: species?.imagen || "",
        });
        setSpeciesDialog(species ? { id: species.id_epe } : { id: null });
        setFormError("");
    }

    function openLotDialog(lot = null) {
        setLotForm({
            id_epe: String(lot?.id_epe ?? adminData.especies[0]?.id_epe ?? ""),
            kilos: lot?.kilos || "",
            numero_cajas: lot?.numero_cajas || "",
            precio_kilo_salida: lot?.precio_kilo_salida || "",
        });
        setLotDialog(lot ? { id: lot.id_lte } : { id: null });
        setFormError("");
    }

    function openTypeDialog(type = null) {
        setTypeForm({ nombre: type?.nombre || "" });
        setTypeDialog(type ? { id: type.id_tpo } : { id: null });
        setFormError("");
    }

    async function saveSpecies(event) {
        event.preventDefault();
        setSaving(true);
        setFormError("");
        const species = {
            ...speciesForm,
            nombre: speciesForm.nombre.trim(),
            id_tpo: Number(speciesForm.id_tpo),
            imagen: speciesForm.imagen.trim() || null,
        };

        try {
            if (speciesDialog.id) {
                await updateEspecie(speciesDialog.id, species);
            } else {
                await createEspecie(species);
            }
            setSpeciesDialog(null);
            await refreshData();
        } catch (requestError) {
            setFormError(requestError.message);
        } finally {
            setSaving(false);
        }
    }

    async function saveLot(event) {
        event.preventDefault();
        setSaving(true);
        setFormError("");
        const lot = {
            ...lotForm,
            id_epe: Number(lotForm.id_epe),
            kilos: Number(lotForm.kilos),
            numero_cajas: Number(lotForm.numero_cajas),
            precio_kilo_salida: Number(lotForm.precio_kilo_salida),
        };

        try {
            if (lotDialog.id) {
                await updateLote(lotDialog.id, lot);
            } else {
                await createLote(lot);
            }
            setLotDialog(null);
            await refreshData();
        } catch (requestError) {
            setFormError(requestError.message);
        } finally {
            setSaving(false);
        }
    }

    async function saveType(event) {
        event.preventDefault();
        setSaving(true);
        setFormError("");

        try {
            if (typeDialog.id) {
                await updateTipo(typeDialog.id, typeForm);
            } else {
                await createTipo(typeForm);
            }
            setTypeDialog(null);
            await refreshData();
        } catch (requestError) {
            setFormError(requestError.message);
        } finally {
            setSaving(false);
        }
    }

    async function removeSpecies(species) {
        if (!window.confirm(`¿Eliminar la especie ${species.nombre}? Primero debes eliminar sus lotes.`)) return;
        try {
            await deleteEspecie(species.id_epe);
            await refreshData();
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    async function removeLot(lot) {
        if (!window.confirm(`¿Eliminar el lote #${lot.id_lte}?`)) return;
        try {
            await deleteLote(lot.id_lte);
            await refreshData();
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    async function removeType(type) {
        if (!window.confirm(`¿Eliminar el tipo ${type.nombre}? No se puede borrar si clasifica especies.`)) return;
        try {
            await deleteTipo(type.id_tpo);
            await refreshData();
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    async function changeOrderStatus(id, estado) {
        try {
            await updateCompraEstado(id, estado);
            await refreshData();
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        setProfileMenuOpen(false);
        navigate("/login", { replace: true });
    }

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <a className="admin-brand" href="#inicio" aria-label="Lonja de Veracruz, inicio">
                    <span className="admin-brand-mark"><Icon name="fish" size={23} /></span>
                    <span className="admin-brand-copy">
                        <strong>Lonja</strong>
                        <small>VERACRUZ · ADMIN</small>
                    </span>
                </a>

                <div className="admin-workspace">
                    <span className="workspace-avatar">LV</span>
                    <span className="workspace-copy"><strong>Dashboard</strong><small>Panel de administración</small></span>
                </div>

                <span className="admin-nav-label">MENÚ PRINCIPAL</span>
                <nav className="admin-nav" aria-label="Navegación de administración">
                    {navigation.map((item) => (
                        <button
                            className={`admin-nav-item${activeSection === item.label ? " is-active" : ""}`}
                            key={item.label}
                            onClick={() => setActiveSection(item.label)}
                            type="button"
                        >
                            <Icon name={item.icon} />
                            <span>{item.label}</span>
                            {item.label === "Pedidos" && activeOrders.length > 0 && <span className="admin-nav-badge">{activeOrders.length}</span>}
                        </button>
                    ))}
                </nav>

                <div className="admin-sidebar-bottom">
                    <div className="admin-help-card">
                        <span className="help-icon">?</span>
                        <strong>¿Necesitas ayuda?</strong>
                        <p>Consulta la guía de administración.</p>
                        <button type="button" onClick={() => window.open(`${import.meta.env.BASE_URL}guia-administrador.pdf`, "_blank", "noopener,noreferrer")}>
                            Ver guía <Icon name="arrow" size={14} />
                        </button>
                    </div>
                </div>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-breadcrumb"><span>Lonja</span><Icon name="chevron" size={15} /><strong>Administración</strong></div>
                    <div className="admin-topbar-actions">
                        <label className="admin-search">
                            <Icon name="search" size={18} />
                            <input type="search" placeholder="Buscar..." aria-label="Buscar" value={search} onChange={(event) => setSearch(event.target.value)} />
                            <kbd>⌘ K</kbd>
                        </label>
                        <button className="admin-icon-button" type="button" aria-label="Notificaciones">
                            <Icon name="bell" size={19} /><span className="notification-dot" />
                        </button>
                        <span className="admin-topbar-divider" />
                        <div className="admin-profile-menu" ref={profileMenuRef}>
                            <button
                                className={`admin-profile-trigger${profileMenuOpen ? " is-open" : ""}`}
                                type="button"
                                aria-label="Abrir menú de perfil"
                                aria-haspopup="menu"
                                aria-expanded={profileMenuOpen}
                                aria-controls="admin-profile-dropdown"
                                onClick={() => setProfileMenuOpen((isOpen) => !isOpen)}
                            >
                                <span className="admin-avatar topbar-avatar">{initials(adminName)}</span>
                                <Icon name="chevron" size={14} />
                            </button>
                            {profileMenuOpen && (
                                <div className="admin-profile-dropdown" id="admin-profile-dropdown" role="menu" aria-label="Menú de perfil">
                                    <Link to="/profile" role="menuitem" onClick={() => setProfileMenuOpen(false)}>Editar perfil</Link>
                                    <button type="button" role="menuitem" onClick={logout}>Cerrar sesión</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    {error && <div className="admin-alert" role="alert"><span>{error}</span><button type="button" onClick={refreshData}>Reintentar</button></div>}
                    {!loaded && loading ? (
                        <div className="admin-data-state">Cargando datos del mercado…</div>
                    ) : !loaded ? (
                        <div className="admin-data-state"><p>No se pudo cargar el panel.</p><button className="admin-outline-button" type="button" onClick={refreshData}>Reintentar</button></div>
                    ) : activeSection === "Resumen" || activeSection === "Reportes" ? (
                        <>
                            <div className="admin-page-heading">
                                <div>
                                    <span className="admin-eyebrow">{activeSection === "Reportes" ? "ANÁLISIS DEL MERCADO" : dateHeading}</span>
                                    <h1>{activeSection === "Reportes" ? "Reportes" : `Buenos días, ${adminName.split(" ")[0]}`} <span>✦</span></h1>
                                    <p>{activeSection === "Reportes" ? "Una mirada clara al movimiento de la lonja." : "Esto es lo que está pasando hoy en la lonja."}</p>
                                </div>
                                <button className="admin-primary-button" type="button" onClick={() => openSpeciesDialog()}>
                                    <Icon name="plus" size={18} /> Nueva especie
                                </button>
                            </div>

                            <section className="admin-metrics" aria-label="Indicadores del mercado">
                                <article className="metric-card">
                                    <div className="metric-card-top"><span>Ventas de hoy</span><span className="metric-icon blue"><Icon name="chart" size={18} /></span></div>
                                    <strong className="metric-value">{formatCurrency(todaySales)}</strong>
                                    <div className="metric-foot"><span>Pedidos no cancelados de hoy</span></div>
                                </article>
                                <article className="metric-card">
                                    <div className="metric-card-top"><span>Pedidos activos</span><span className="metric-icon amber"><Icon name="receipt" size={18} /></span></div>
                                    <strong className="metric-value">{activeOrders.length}</strong>
                                    <div className="metric-foot"><span className="metric-note">{adminData.compras.filter((order) => order.estado === "pendiente").length} por confirmar</span><span>de {adminData.compras.length} pedidos</span></div>
                                </article>
                                <article className="metric-card">
                                    <div className="metric-card-top"><span>Lotes disponibles</span><span className="metric-icon green"><Icon name="box" size={18} /></span></div>
                                    <strong className="metric-value">{availableLots.length}</strong>
                                    <div className="metric-foot"><span>Lotes sin pedido asociado</span></div>
                                </article>
                                <article className="metric-card">
                                    <div className="metric-card-top"><span>Compradores activos</span><span className="metric-icon lilac"><Icon name="users" size={18} /></span></div>
                                    <strong className="metric-value">{adminData.compradores.filter((buyer) => buyer.verify).length}</strong>
                                    <div className="metric-foot"><span>De {adminData.compradores.length} cuentas</span></div>
                                </article>
                            </section>

                            <section className="admin-overview-grid">
                                <article className="admin-panel sales-panel">
                                    <div className="panel-heading">
                                        <div><h2>Actividad de ventas</h2><p>El movimiento de la lonja durante esta semana.</p></div>
                                        <span className="admin-select">Últimos 7 días</span>
                                    </div>
                                    <div className="sales-total"><strong>{formatCurrency(weekSalesTotal)}</strong><span>MXN</span></div>
                                    <div className="chart-area">
                                        <div className="chart-y-labels"><span>{formatCurrency(Math.max(...weekSales.map((item) => item.total)), true)}</span><span>{formatCurrency(weekSalesTotal / 2, true)}</span><span>$0</span></div>
                                        <div className="chart-columns">
                                            {weekSales.map((item) => (
                                                <div className="chart-column" key={item.date.toISOString()}>
                                                    <span className="chart-tooltip">{item.value}</span>
                                                    <div className={`chart-bar${isSameDay(item.date, today) ? " is-highlighted" : ""}`} style={{ height: `${item.height}%` }} />
                                                    <span className="chart-day">{item.day}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </article>

                                <article className="admin-panel inventory-panel">
                                    <div className="panel-heading">
                                        <div><h2>Lotes disponibles</h2><p>Presentaciones listas para venta mayorista.</p></div>
                                        <button className="panel-more" type="button" aria-label="Ver inventario" onClick={() => setActiveSection("Lotes")}><Icon name="arrow" size={18} /></button>
                                    </div>
                                    <div className="inventory-list">
                                        {availableLotRows.slice(0, 3).map((lot) => (
                                            <div className="inventory-item" key={lot.id}>
                                                <span className={`product-avatar ${lot.tone}`}>{lot.initials}</span>
                                                <span className="inventory-name"><strong>{lot.detail.split(" · ")[0]}</strong><small>{lot.name}</small></span>
                                                <span className="inventory-amount"><strong>{lot.amount.split(" · ")[0]}</strong><small>{lot.price} / kg</small></span>
                                            </div>
                                        ))}
                                        {!availableLots.length && <p className="admin-empty-note">No hay lotes disponibles.</p>}
                                    </div>
                                    <button className="text-link" type="button" onClick={() => setActiveSection("Lotes")}>Ver todos los lotes <Icon name="chevron" size={15} /></button>
                                </article>
                            </section>

                            <section className="admin-panel recent-orders">
                                <div className="panel-heading">
                                    <div><h2>Pedidos recientes</h2><p>Los últimos movimientos de tus compradores.</p></div>
                                    <button className="admin-outline-button" type="button" onClick={() => setActiveSection("Pedidos")}>Ver todos <Icon name="chevron" size={15} /></button>
                                </div>
                                <div className="admin-table-wrap">
                                    <table className="admin-table">
                                        <thead><tr><th>Pedido</th><th>Comprador</th><th>Fecha</th><th>Estado</th><th>Total</th><th /></tr></thead>
                                        <tbody>
                                            {orderRows.filter((order) => `${order.name} ${order.detail} ${order.speciesName}`.toLowerCase().includes(search.toLowerCase())).slice(0, 3).map((order) => (
                                                <tr key={order.id}>
                                                    <td><strong className="order-id">{order.name}</strong></td>
                                                    <td><span className="buyer-cell"><span className={`table-avatar ${order.tone}`}>{order.initials}</span>{order.detail}</span></td>
                                                    <td>{order.date}</td>
                                                    <td>
                                                        <select className={`status-pill ${statusClass(order.status)}`} aria-label={`Estado de ${order.name}`} value={order.status} onChange={(event) => changeOrderStatus(order.id, event.target.value)}>
                                                            {orderStates.map((state) => <option key={state.value} value={state.value}>{state.label}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="table-total">{order.price}</td>
                                                    <td />
                                                </tr>
                                            ))}
                                            {!orderRows.length && <tr><td className="table-empty" colSpan="6">Todavía no hay pedidos.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    ) : (
                        <section className="admin-section-page">
                            <div className="admin-page-heading">
                                <div><span className="admin-eyebrow">{section?.eyebrow || "MERCADO"}</span><h1>{section?.title || activeSection}</h1><p>{section?.description || "Consulta el resumen de actividad del mercado."}</p></div>
                                {activeSection === "Especies" && (
                                    <button className="admin-primary-button" type="button" onClick={() => catalogTab === "tipos" ? openTypeDialog() : openSpeciesDialog()}>
                                        <Icon name="plus" size={18} /> {catalogTab === "tipos" ? "Nuevo tipo" : "Nueva especie"}
                                    </button>
                                )}
                                {activeSection === "Lotes" && <button className="admin-primary-button" type="button" onClick={() => openLotDialog()}><Icon name="plus" size={18} /> Nuevo lote</button>}
                            </div>
                            <section className="admin-panel recent-orders section-table-panel">
                                <div className="panel-heading">
                                    <div><h2>{section?.title || activeSection}</h2><p>{tableRows.length} de {sectionRows.length} registros</p></div>
                                    {!isTypesTab && <label className="admin-filter-control"><Icon name="filter" size={16} /><select aria-label="Filtrar por estado" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="todos">Todos los estados</option>{Array.from(new Set(sectionRows.map((row) => row.status))).map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></label>}
                                </div>
                                {activeSection === "Especies" && (
                                    <div className="admin-catalog-tabs" role="tablist" aria-label="Catálogo">
                                        <button className={catalogTab === "especies" ? "is-active" : ""} type="button" role="tab" aria-selected={catalogTab === "especies"} onClick={() => { setCatalogTab("especies"); setStatusFilter("todos"); }}>Especies <span>{adminData.especies.length}</span></button>
                                        <button className={catalogTab === "tipos" ? "is-active" : ""} type="button" role="tab" aria-selected={catalogTab === "tipos"} onClick={() => { setCatalogTab("tipos"); setStatusFilter("todos"); }}>Tipos <span>{adminData.tipos.length}</span></button>
                                    </div>
                                )}
                                <div className="admin-table-wrap">
                                    <table className="admin-table">
                                        <thead><tr><th>{section?.firstColumn || "Nombre"}</th>{isTypesTab ? <th>Especies</th> : <><th>{activeSection === "Especies" ? "Tipo" : "Estado"}</th><th>{section?.secondColumn || "Actividad"}</th><th>{section?.thirdColumn || "Actualización"}</th></>}<th /></tr></thead>
                                        <tbody>{tableRows.map((row) => (
                                            <tr key={row.id}>
                                                <td><span className="buyer-cell"><span className={`table-avatar ${row.tone}`}>{activeSection === "Especies" && catalogTab === "especies" && row.image ? <img src={row.image} alt="" loading="lazy" /> : row.initials}</span><span className="table-name"><strong>{row.name}</strong><small>{row.detail}</small></span></span></td>
                                                {isTypesTab ? <td>{row.amount}</td> : <>
                                                    <td>{activeSection === "Pedidos" ? (
                                                        <select className={`status-pill ${statusClass(row.status)}`} aria-label={`Estado de ${row.name}`} value={row.status} onChange={(event) => changeOrderStatus(row.id, event.target.value)}>
                                                            {orderStates.map((state) => <option key={state.value} value={state.value}>{state.label}</option>)}
                                                        </select>
                                                    ) : <span className={`status-pill ${statusClass(row.status)}`}><i />{statusLabel(row.status)}</span>}</td>
                                                    <td>{row.amount}</td><td className="table-total">{row.price}</td>
                                                </>}
                                                <td>
                                                    {activeSection === "Especies" && catalogTab === "especies" && <div className="admin-row-actions"><button type="button" onClick={() => openSpeciesDialog(row.raw)}>Editar</button><button type="button" onClick={() => removeSpecies(row.raw)}>Eliminar</button></div>}
                                                    {activeSection === "Especies" && catalogTab === "tipos" && <div className="admin-row-actions"><button type="button" onClick={() => openTypeDialog(row.raw)}>Editar</button><button type="button" onClick={() => removeType(row.raw)}>Eliminar</button></div>}
                                                    {activeSection === "Lotes" && <div className="admin-row-actions"><button type="button" onClick={() => openLotDialog(row.raw)}>Editar</button><button type="button" onClick={() => removeLot(row.raw)}>Eliminar</button></div>}
                                                </td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                    {!tableRows.length && <p className="table-empty">{sectionRows.length ? "No hay resultados para estos filtros." : "No hay registros para mostrar."}</p>}
                                </div>
                            </section>
                        </section>
                    )}
                    <footer className="admin-footer"><span>© {new Date().getFullYear()} Lonja de Veracruz</span><span>Hecho para una mejor jornada <span className="footer-heart">♥</span></span></footer>
                </main>
            </div>
            {speciesDialog && (
                <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) setSpeciesDialog(null);
                }}>
                    <form className="admin-product-dialog" onSubmit={saveSpecies} aria-labelledby="species-dialog-title">
                        <div className="panel-heading">
                            <div><h2 id="species-dialog-title">{speciesDialog.id ? "Editar especie" : "Nueva especie"}</h2><p>La especie queda en el catálogo para asignarla a distintos lotes.</p></div>
                            <button className="row-more" type="button" aria-label="Cerrar formulario" onClick={() => setSpeciesDialog(null)}>×</button>
                        </div>
                        <label>Nombre de la especie<input name="nombre" maxLength="25" placeholder="Ej. Jaiba, almeja, atún" required value={speciesForm.nombre} onChange={(event) => setSpeciesForm({ ...speciesForm, nombre: event.target.value })} /></label>
                        <label>Tipo<select name="id_tpo" required value={speciesForm.id_tpo} onChange={(event) => setSpeciesForm({ ...speciesForm, id_tpo: event.target.value })}><option value="">Selecciona un tipo</option>{adminData.tipos.map((tipo) => <option key={tipo.id_tpo} value={tipo.id_tpo}>{tipo.nombre}</option>)}</select></label>
                        <label>Imagen opcional<input name="imagen" type="url" maxLength="100" placeholder="https://..." value={speciesForm.imagen} onChange={(event) => setSpeciesForm({ ...speciesForm, imagen: event.target.value })} /></label>
                        {formError && <p className="admin-form-error" role="alert">{formError}</p>}
                        <div className="admin-dialog-actions"><button className="admin-outline-button" type="button" onClick={() => setSpeciesDialog(null)}>Cancelar</button><button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar especie"}</button></div>
                    </form>
                </div>
            )}
            {lotDialog && (
                <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) setLotDialog(null);
                }}>
                    <form className="admin-product-dialog" onSubmit={saveLot} aria-labelledby="lot-dialog-title">
                        <div className="panel-heading">
                            <div><h2 id="lot-dialog-title">{lotDialog.id ? "Editar lote" : "Nuevo lote mayorista"}</h2><p>Selecciona una especie y define la presentación para venta.</p></div>
                            <button className="row-more" type="button" aria-label="Cerrar formulario" onClick={() => setLotDialog(null)}>×</button>
                        </div>
                        <label>Especie<select required value={lotForm.id_epe} onChange={(event) => setLotForm({ ...lotForm, id_epe: event.target.value })}><option value="">Selecciona una especie</option>{adminData.especies.map((species) => <option key={species.id_epe} value={species.id_epe}>{species.nombre} · {species.tipo?.nombre}</option>)}</select></label>
                        <div className="admin-form-grid">
                            <label>Kilos<input type="number" min="0.01" step="0.01" required value={lotForm.kilos} onChange={(event) => setLotForm({ ...lotForm, kilos: event.target.value })} /></label>
                            <label>Número de cajas<input type="number" min="1" step="1" required value={lotForm.numero_cajas} onChange={(event) => setLotForm({ ...lotForm, numero_cajas: event.target.value })} /></label>
                        </div>
                        <label>Precio de salida por kilo<input type="number" min="0.01" step="0.01" required value={lotForm.precio_kilo_salida} onChange={(event) => setLotForm({ ...lotForm, precio_kilo_salida: event.target.value })} /></label>
                        {formError && <p className="admin-form-error" role="alert">{formError}</p>}
                        <div className="admin-dialog-actions"><button className="admin-outline-button" type="button" onClick={() => setLotDialog(null)}>Cancelar</button><button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar lote"}</button></div>
                    </form>
                </div>
            )}
            {typeDialog && (
                <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) setTypeDialog(null);
                }}>
                    <form className="admin-product-dialog" onSubmit={saveType} aria-labelledby="type-dialog-title">
                        <div className="panel-heading">
                            <div><h2 id="type-dialog-title">{typeDialog.id ? "Editar tipo" : "Nuevo tipo"}</h2><p>Ejemplos: pescado, crustáceo o molusco.</p></div>
                            <button className="row-more" type="button" aria-label="Cerrar formulario" onClick={() => setTypeDialog(null)}>×</button>
                        </div>
                        <label>Nombre del tipo<input maxLength="30" required value={typeForm.nombre} onChange={(event) => setTypeForm({ nombre: event.target.value })} /></label>
                        {formError && <p className="admin-form-error" role="alert">{formError}</p>}
                        <div className="admin-dialog-actions"><button className="admin-outline-button" type="button" onClick={() => setTypeDialog(null)}>Cancelar</button><button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar tipo"}</button></div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminLayout;
