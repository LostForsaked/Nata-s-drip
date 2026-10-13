import {
    buscarProductoPorId,
    buscarOrdenPorId,
    crearOrden,
    actualizarOrden,
    descontarStock,
} from "../data/db";
import {vaciarCarritoGlobal, CUPON} from "./cardLogic";

export function verificarStock(items) {
    for (const item of items) {
        const producto = buscarProductoPorId(item.productoId);
        if (!producto) return `El producto "${item.nombre}" ya no está disponible.`;
        if (Number(producto.stock) < Number(item.cantidad)) {
            return `solo quedan ${producto.stock} unidades de "${item.nombre}" (pediste ${item.cantidad}).`;
        }
    }
    return null;
}

export function crearOrdenPendiente({cliente, direccion, items, totales, cuponAplicado, usuarioId}) {
    return crearOrden({
        estado: "pendiente de pago",
        usuarioId: usuarioId ?? null,
        cliente,
        direccion,
        items: items.map((i) => ({
            productoId: i.id,
            nombre: i.nombre,
            imagen: i.imagen,
            precioUnitario: i.precioUnitario,
            cantidad: i.cantidad,
            subtotal: i.subtotal,
        })),
        subtotal: totales.subtotal,
        descuento: totales.descuento,
        total: totales.total,
        cupon: cuponAplicado ? CUPON.codigo : null,
    });
}

//pago aprobado

export function aprobarPago(ordenId) {
    const orden = buscarOrdenPorId(ordenId);
    if(!orden) return {ok: false, error: "La orden no existe."};
    if (orden.estado === "Pagada") return {ok: true};

    const problema = verificarStock(orden.items);
    if (problema) return {ok: false, error:problema};

    descontarStock(orden.items);
    actualizarOrden(ordenId, {estado: "Pagada", fechaPago: new Date().toISOString() });
    vaciarCarritoGlobal();
    return {ok: true};
}

//pago rechazado

export function rechazarPago(ordenId){
    actualizarOrden(ordenId, {estado: "Pago fallido"});
}