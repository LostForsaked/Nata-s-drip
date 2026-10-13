export function formatoCLP(valor) {
    return "$" + Number(valor || 0).toLocaleString("es-CL");
}

export function etiquetaPrecio(valor) {
    return Number(valor) === 0? "GRATIS" : formatoCLP(valor);
}

export function formatoFecha(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleString("es-CL", {dateStyle: "short", timeStyle: "short"});
}