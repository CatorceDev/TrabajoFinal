import { useMemo, useState } from "react";
import { generateSalesReport, getDeliveredSalesInRange, getSalesDateRange } from "../utils/salesReport.js";
import "../styles/sales-report.css";

function formatCurrency(value) {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);
}

function SalesReportFilter({ orders, audience }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");
    const range = useMemo(() => getSalesDateRange(startDate, endDate), [startDate, endDate]);
    const deliveredOrders = useMemo(
        () => getDeliveredSalesInRange(orders, startDate, endDate),
        [orders, startDate, endDate],
    );
    const total = deliveredOrders.reduce((sum, order) => sum + (Number(order.precio_total) || 0), 0);
    const invalidOrder = Boolean(startDate && endDate && !range);
    const reportType = audience === "admin" ? "ventas" : "compras";

    async function downloadReport() {
        setError("");
        setGenerating(true);
        try {
            await generateSalesReport(deliveredOrders, { startDate, endDate, audience });
        } catch (generationError) {
            setError(generationError instanceof Error ? generationError.message : "No se pudo generar el reporte.");
        } finally {
            setGenerating(false);
        }
    }

    function updateDate(setter) {
        return (event) => {
            setter(event.target.value);
            setError("");
        };
    }

    return (
        <section className="sales-report-filter" aria-label={`Reporte de ${reportType}`}>
            <div className="sales-report-copy">
                <h2>Descargar reporte de {reportType}</h2>
                <p>La fecha corresponde a la solicitud. Selecciona el mismo día en ambos campos para un reporte diario; solo se incluyen pedidos entregados.</p>
            </div>
            <div className="sales-report-controls">
                <label>
                    Desde
                    <input type="date" value={startDate} max={endDate || undefined} onChange={updateDate(setStartDate)} />
                </label>
                <label>
                    Hasta
                    <input type="date" value={endDate} min={startDate || undefined} onChange={updateDate(setEndDate)} />
                </label>
                <button type="button" className="sales-report-button" disabled={!range || generating} onClick={downloadReport}>
                    {generating ? "Generando PDF…" : "Descargar PDF"}
                </button>
            </div>
            {invalidOrder && <p className="sales-report-error" role="alert">La fecha inicial debe ser igual o anterior a la fecha final.</p>}
            {range && <p className="sales-report-summary" role="status">{deliveredOrders.length} {audience === "admin" ? "ventas realizadas" : "compras realizadas"} · {formatCurrency(total)}</p>}
            {error && <p className="sales-report-error" role="alert">{error}</p>}
        </section>
    );
}

export default SalesReportFilter;
