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

export function estadoStock(producto) {
    const stock = Number(producto.stock);
    const critico = 
        producto.stockCritico === "" || producto.stockCritico == null ? null : Number(producto.stockCritico);

    if (stock <= 0) return { texto: "Agotado", clase: "bg-danger"};
    if (critico !== null && stock <= critico) return { texto: "Stock critico", clase: "bg-warning text-dark"};
    return { texto: "Normal", clase: "bg-success"};
}