function parseLocalDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
}

export function getSalesDateRange(startDate, endDate) {
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);
    if (!start || !end || start > end) return null;

    return {
        start: start.getTime(),
        end: new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1).getTime(),
    };
}

export function getDeliveredSalesInRange(orders, startDate, endDate) {
    const range = getSalesDateRange(startDate, endDate);
    if (!range) return [];

    return orders.filter((order) => {
        if (order.estado !== "entregada") return false;
        const timestamp = new Date(order.fecha).getTime();
        return Number.isFinite(timestamp) && timestamp >= range.start && timestamp < range.end;
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
    }).format(Number(value) || 0);
}

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Fecha no disponible";
    return new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export async function generateSalesReport(orders, { startDate, endDate, audience }) {
    const { jsPDF } = await import("jspdf");
    const document = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = document.internal.pageSize.getWidth();
    const margin = 14;
    const rows = [...orders].sort((first, second) => new Date(first.fecha) - new Date(second.fecha));
    const total = rows.reduce((sum, order) => sum + (Number(order.precio_total) || 0), 0);
    const activityName = audience === "admin" ? "ventas" : "compras";
    const activityLabel = audience === "admin" ? "ventas realizadas" : "compras realizadas";
    const totalLabel = audience === "admin" ? "Total vendido" : "Total de compras";
    const adminColumns = [
        { label: "Pedido", width: 18 },
        { label: "Fecha", width: 34 },
        { label: "Comprador", width: 51 },
        { label: "Especie", width: 48 },
        { label: "Cantidad", width: 30 },
        { label: "Precio/kg", width: 39 },
        { label: "Total", width: 39 },
    ];
    const buyerColumns = [
        { label: "Pedido", width: 23 },
        { label: "Fecha", width: 42 },
        { label: "Especie", width: 73 },
        { label: "Cantidad", width: 41 },
        { label: "Precio/kg", width: 43 },
        { label: "Total", width: 43 },
    ];
    const columns = audience === "admin" ? adminColumns : buyerColumns;
    const availableWidth = pageWidth - margin * 2;
    const columnScale = availableWidth / columns.reduce((sum, column) => sum + column.width, 0);
    const scaledColumns = columns.map((column) => ({ ...column, width: column.width * columnScale }));

    function drawHeader(pageNumber) {
        document.setFillColor(45, 23, 9);
        document.rect(0, 0, pageWidth, 34, "F");
        document.setTextColor(247, 243, 235);
        document.setFont("helvetica", "bold");
        document.setFontSize(18);
        document.text("LONJA DE VERACRUZ", margin, 14);
        document.setFontSize(12);
        document.text(`Reporte de ${activityLabel}`, margin, 24);
        document.setFont("helvetica", "normal");
        document.setFontSize(9);
        document.setTextColor(45, 23, 9);
        document.text(`Periodo: ${startDate} al ${endDate}`, margin, 43);
        document.text(`${activityName === "ventas" ? "Ventas" : "Compras"}: ${rows.length}`, margin, 50);
        document.text(`${totalLabel}: ${formatCurrency(total)}`, margin + 43, 50);
        if (pageNumber > 1) {
            document.setTextColor(125, 112, 99);
            document.text(`Página ${pageNumber}`, pageWidth - margin, 43, { align: "right" });
        }
    }

    let pageNumber = 1;
    drawHeader(pageNumber);
    let y = 59;

    function drawTableHeader() {
        document.setFillColor(223, 169, 120);
        document.rect(margin, y, availableWidth, 8, "F");
        document.setFont("helvetica", "bold");
        document.setFontSize(8);
        document.setTextColor(45, 23, 9);
        let x = margin;
        for (const column of scaledColumns) {
            document.text(column.label, x + 2, y + 5.5);
            x += column.width;
        }
        y += 8;
    }

    drawTableHeader();
    if (!rows.length) {
        document.setFont("helvetica", "normal");
        document.setFontSize(10);
        document.setTextColor(74, 62, 52);
        document.text(`No se registraron ${activityLabel} durante este periodo.`, margin, y + 8);
    }

    for (const order of rows) {
        const lot = order.lote || {};
        const buyer = order.comprador || {};
        const values = audience === "admin"
            ? [
                `#${order.id_cmp}`,
                formatDate(order.fecha),
                [buyer.name, buyer.firstLastName, buyer.secondLastName].filter(Boolean).join(" ") || "Comprador",
                lot.especie?.nombre || "Especie no disponible",
                `${lot.kilos ?? "-"} kg / ${lot.numero_cajas ?? "-"} cajas`,
                formatCurrency(order.precio_kilo_final ?? lot.precio_kilo_salida),
                formatCurrency(order.precio_total),
            ]
            : [
                `#${order.id_cmp}`,
                formatDate(order.fecha),
                lot.especie?.nombre || "Especie no disponible",
                `${lot.kilos ?? "-"} kg / ${lot.numero_cajas ?? "-"} cajas`,
                formatCurrency(order.precio_kilo_final ?? lot.precio_kilo_salida),
                formatCurrency(order.precio_total),
            ];
        document.setFont("helvetica", "normal");
        document.setFontSize(8);
        const cellLines = values.map((value, index) => document.splitTextToSize(String(value), scaledColumns[index].width - 4));
        const rowHeight = Math.max(8, ...cellLines.map((lines) => lines.length * 4 + 3));

        if (y + rowHeight > 195) {
            pageNumber += 1;
            document.addPage();
            drawHeader(pageNumber);
            y = 59;
            drawTableHeader();
        }

        document.setDrawColor(231, 226, 215);
        document.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);
        document.setTextColor(74, 62, 52);
        let x = margin;
        cellLines.forEach((lines, index) => {
            document.text(lines, x + 2, y + 5);
            x += scaledColumns[index].width;
        });
        y += rowHeight;
    }

    document.setProperties({
        title: `Reporte de ${activityLabel} - Lonja de Veracruz`,
        subject: `${activityLabel} del ${startDate} al ${endDate}`,
        author: "Lonja de Veracruz",
    });
    document.save(`reporte-${activityName}-${startDate}-${endDate}.pdf`);
}
