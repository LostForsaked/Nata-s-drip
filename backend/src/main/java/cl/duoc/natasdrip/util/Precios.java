package cl.duoc.natasdrip.util;

public final class Precios {

    private Precios(){}

    public static int descuentoDe(int monto, int porcentaje){
        return (int) ((monto * (long) porcentaje + 50) / 100);
    }

    public static int precioFinal(int precio, int porcentaje){
        return precio - descuentoDe(precio, porcentaje);
    }
}
