const orderStatuses = {
    pendiente: "Pendiente",
    confirmada: "Confirmado",
    en_preparacion: "En preparación",
    entregada: "Entregado",
    cancelada: "Cancelado",
};

function formatCurrency(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "No disponible";
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
}

function formatDate(value) {
    if (!value) return "No disponible";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No disponible";
    return date.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

function addField(document, label, value, y, margin, valueWidth) {
    document.setFont("helvetica", "bold");
    document.setFontSize(9);
    document.setTextColor(75, 85, 99);
    document.text(label, margin, y);

    document.setFont("helvetica", "normal");
    document.setTextColor(31, 41, 55);
    const lines = document.splitTextToSize(String(value || "No disponible"), valueWidth);
    document.text(lines, margin + 39, y);
    return y + Math.max(6, lines.length * 4.5);
}

export async function generateOrderTicket(order) {
    const { jsPDF } = await import("jspdf");
    const document = new jsPDF({ format: "a5", unit: "mm" });
    const pageWidth = document.internal.pageSize.getWidth();
    const margin = 16;
    const valueWidth = pageWidth - margin * 2 - 39;
    const lot = order.lote || {};
    const buyer = order.comprador || {};
    const buyerName = [buyer.name, buyer.firstLastName, buyer.secondLastName].filter(Boolean).join(" ");
    let y = 20;

    document.setFont("helvetica", "bold");
    document.setFontSize(16);
    document.setTextColor(20, 45, 59);
    document.text("LONJA DE VERACRUZ", margin, y);

    y += 7;
    document.setFontSize(10);
    document.setTextColor(75, 85, 99);
    document.text("TICKET DE PEDIDO", margin, y);

    y += 8;
    document.setDrawColor(205, 213, 219);
    document.line(margin, y, pageWidth - margin, y);
    y += 8;

    y = addField(document, "PEDIDO", `#${order.id_cmp ?? "No disponible"}`, y, margin, valueWidth);
    y = addField(document, "FECHA", formatDate(order.fecha), y, margin, valueWidth);
    y = addField(document, "COMPRADOR", buyerName || "No disponible", y, margin, valueWidth);
    y = addField(document, "ESTADO", orderStatuses[order.estado] || order.estado || "No disponible", y, margin, valueWidth);

    y += 3;
    document.setFont("helvetica", "bold");
    document.setFontSize(10);
    document.setTextColor(20, 45, 59);
    document.text("DETALLE DEL LOTE", margin, y);
    y += 7;

    y = addField(document, "ESPECIE", lot.especie?.nombre || "No disponible", y, margin, valueWidth);
    y = addField(document, "CANTIDAD", `${lot.kilos ?? "No disponible"} kg`, y, margin, valueWidth);
    y = addField(document, "CAJAS", lot.numero_cajas ?? "No disponible", y, margin, valueWidth);
    y = addField(document, "PRECIO / KG", formatCurrency(order.precio_kilo_final ?? lot.precio_kilo_salida), y, margin, valueWidth);

    y += 2;
    document.setDrawColor(205, 213, 219);
    document.line(margin, y, pageWidth - margin, y);
    y += 8;
    document.setFont("helvetica", "bold");
    document.setFontSize(12);
    document.setTextColor(20, 45, 59);
    document.text("TOTAL", margin, y);
    document.text(formatCurrency(order.precio_total), pageWidth - margin, y, { align: "right" });

    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.setTextColor(100, 110, 120);
    document.text("Ticket de pedido; no es un comprobante de pago.", margin, 195);

    document.save(`ticket-pedido-${order.id_cmp || "lonja"}.pdf`);
}
