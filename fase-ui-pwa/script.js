/* ============================================================================
   SISTEMA FULL FRONTEND SPA — SABORES DE MI TIERRA (MICROEMPRESA BOLIVIANA)
   JavaScript Vanilla Puro + LocalStorage (Cero Backend)
   Módulos incluidos:
     1. Configuración PWA (Service Worker sw.js, Fetch manifest, Red Online/Offline)
     2. Catálogo Base (5 Platos Típicos + 6 Bebidas Línea Embol) & Semilla de 207 Eventos
     3. Almacenamiento LocalStorage, Stock / Kardex y Cálculo de Métricas en Tiempo Real
     4. Navegación SPA (3 Vistas: Cliente / Trabajador / Admin), Mobile 0 Scroll y Roles
     5. Hidratación SSR (data-hidratado="false" -> "true"), Validación blur/input y Anti-XSS
   ============================================================================ */

'use strict';

// ============================================================================
// [MÓDULO 1]: CONSTANTES DEL CATÁLOGO (5 PLATOS TÍPICOS + LÍNEA EMBOL)
// ============================================================================
const STORAGE_KEYS = {
  EVENTOS: 'sabores_bolivia_eventos_v1',
  STOCK: 'sabores_bolivia_stock_v1',
  CAJA_INICIAL: 'sabores_bolivia_caja_inicial_v1',
  CARRITO: 'sabores_bolivia_carrito_v1',
  ROL: 'sabores_bolivia_rol_v1',
  TEMA: 'sabores_bolivia_tema_v1',
  COLA_COCINA: 'sabores_bolivia_cola_cocina_v1',
  COLA_OFFLINE: 'sabores_bolivia_offline_v1',
  PLANILLA: 'sabores_bolivia_planilla_v1'
};

const PRODUCTOS_BASE = [
  {
    id: 'plato-fritanga',
    nombre: 'Fritanga Boliviana',
    categoria: 'platos',
    precio: 51,
    costoRepo: 28,
    stockInicial: 28,
    img: './img/fritanga.svg',
    desc: 'Costilla de cerdo dorada en ají colorado con chuño phuti, mote blanco y papa.'
  },
  {
    id: 'plato-sajta',
    nombre: 'Sajta de Pollo',
    categoria: 'platos',
    precio: 41,
    costoRepo: 23,
    stockInicial: 32,
    img: './img/sajta.svg',
    desc: 'Presa de pollo en salsa de ají amarillo picante, tunta rebosada y zarza fresca.'
  },
  {
    id: 'plato-ranga',
    nombre: 'Ranga Ranga',
    categoria: 'platos',
    precio: 37,
    costoRepo: 21,
    stockInicial: 24,
    img: './img/ranga.svg',
    desc: 'Librillo tierno cocido al ají amarillo con papa blanca y sarza de cebolla.'
  },
  {
    id: 'plato-fricase',
    nombre: 'Fricasé Paceño',
    categoria: 'platos',
    precio: 51,
    costoRepo: 29,
    stockInicial: 26,
    img: './img/fricase.svg',
    desc: 'Caldo tradicional espeso de cerdo en ají amarillo con chuño negro y mote pelado.'
  },
  {
    id: 'plato-falso-conejo',
    nombre: 'Falso Conejo',
    categoria: 'platos',
    precio: 41,
    costoRepo: 23,
    stockInicial: 30,
    img: './img/falso-conejo.svg',
    desc: 'Milanesa apanada en pan molido con ahogado de ají colorado, arvejas, arroz y papa.'
  },
  {
    id: 'embol-cocacola-2l',
    nombre: 'Coca-Cola 2 Litros (Embol)',
    categoria: 'bebidas',
    precio: 19,
    costoRepo: 13,
    stockInicial: 48,
    img: './img/embol-cocacola.svg',
    desc: 'Botella retornable / no retornable 2L línea oficial Embol S.A. bien fría.'
  },
  {
    id: 'embol-cocacola-500',
    nombre: 'Coca-Cola Personal 500ml',
    categoria: 'bebidas',
    precio: 10,
    costoRepo: 6.5,
    stockInicial: 60,
    img: './img/embol-cocacola.svg',
    desc: 'Presentación personal Embol ideal para acompañar tu plato típico.'
  },
  {
    id: 'embol-fanta-2l',
    nombre: 'Fanta Naranja 2L (Embol)',
    categoria: 'bebidas',
    precio: 19,
    costoRepo: 13,
    stockInicial: 36,
    img: './img/embol-sabores.svg',
    desc: 'Sabor clásico naranja Embol S.A. 2 litros para compartir en mesa.'
  },
  {
    id: 'embol-sprite-2l',
    nombre: 'Sprite 500ml (Embol)',
    categoria: 'bebidas',
    precio: 10,
    costoRepo: 6.5,
    stockInicial: 30,
    img: './img/embol-sabores.svg',
    desc: 'Refrescante bebida lima-limón línea Embol S.A.'
  },
  {
    id: 'embol-simba-2l',
    nombre: 'Fanta Guaraná 2L (Embol)',
    categoria: 'bebidas',
    precio: 19,
    costoRepo: 13,
    stockInicial: 28,
    img: './img/embol-sabores.svg',
    desc: 'Sabor Guaraná Embol S.A. en envase familiar 2L.'
  },
  {
    id: 'embol-vital-600',
    nombre: 'Agua Vital 600ml (Embol)',
    categoria: 'bebidas',
    precio: 9,
    costoRepo: 5.5,
    stockInicial: 72,
    img: './img/embol-vital.svg',
    desc: 'Agua mineral sin gas Embol S.A. purificada de mesa.'
  }
];

// ============================================================================
// [MÓDULO 1B]: 36 ÍTEMS OFICIALES DE LA PLANILLA FÍSICA + DATOS DE LA FOTO
// ============================================================================
const ITEMS_PLANILLA_OFICIAL = [
  { id: 0, item: 'FRICASE', pu: 51, ini: 4, prodId: 'plato-fricase' },
  { id: 1, item: 'FRITANGA', pu: 51, ini: 8, prodId: 'plato-fritanga' },
  { id: 2, item: 'SAJTA', pu: 41, ini: 3, prodId: 'plato-sajta' },
  { id: 3, item: 'FALSO CONEJO', pu: 41, ini: 7, prodId: 'plato-falso-conejo' },
  { id: 4, item: 'RANGA', pu: 37, ini: 7, prodId: 'plato-ranga' },
  { id: 5, item: '2 L COCA COLA', pu: 19, ini: 19, prodId: 'embol-cocacola-2l' },
  { id: 6, item: '2 L S/A COCA COLA', pu: 19, ini: 0 },
  { id: 7, item: '2 L FANTA NARANJA', pu: 19, ini: 8, prodId: 'embol-fanta-2l' },
  { id: 8, item: '2 L FANTA PAPAYA', pu: 19, ini: 7 },
  { id: 9, item: '2 L FANTA MANDARINA', pu: 19, ini: 9 },
  { id: 10, item: '2 L FANTA GUARANA', pu: 19, ini: 3, prodId: 'embol-simba-2l' },
  { id: 11, item: '2 L VALLE DURAZNO', pu: 24, ini: 0 },
  { id: 12, item: '2 L VALLE MANZANA', pu: 24, ini: 4 },
  { id: 13, item: '2 L VALLE CITRUS', pu: 24, ini: 9 },
  { id: 14, item: '2 L AGUA', pu: 15, ini: 3 },
  { id: 15, item: '1.5 COCA COLA', pu: 16, ini: 13 },
  { id: 16, item: '500 COCA COLA', pu: 10, ini: 12, prodId: 'embol-cocacola-500' },
  { id: 17, item: '500 S/A COCA COLA', pu: 10, ini: 0 },
  { id: 18, item: '500 FANTA NARANJA', pu: 10, ini: 6 },
  { id: 19, item: '500 FANTA PAPAYA', pu: 10, ini: 8 },
  { id: 20, item: '500 FANTA MANDARINA', pu: 10, ini: 0 },
  { id: 21, item: '500 FANTA GUARANA', pu: 10, ini: 4 },
  { id: 22, item: '500 SPRITE', pu: 10, ini: 0, prodId: 'embol-sprite-2l' },
  { id: 23, item: '600 AGUA', pu: 9, ini: 0, prodId: 'embol-vital-600' },
  { id: 24, item: '300 COCA COLA', pu: 6, ini: 10 },
  { id: 25, item: '300 S/A COCA COLA', pu: 6, ini: 0 },
  { id: 26, item: '300 FANTA NARANJA', pu: 6, ini: 3 },
  { id: 27, item: '300 FANTA PAPAYA', pu: 6, ini: 7 },
  { id: 28, item: '300 FANTA GUARANA', pu: 6, ini: 0 },
  { id: 29, item: '300 VALLE DURAZNO', pu: 6, ini: 0 },
  { id: 30, item: '300 VALLE MANZANA', pu: 6, ini: 6 },
  { id: 31, item: '300 VALLE CITRUS', pu: 6, ini: 7 },
  { id: 32, item: 'BURGUESA', pu: 20, ini: 8 },
  { id: 33, item: 'PACENA/AMSTEL', pu: 20, ini: 0 },
  { id: 34, item: '2.5 L COCA COLA', pu: 25, ini: 1 },
  { id: 35, item: '2.5 L FANTA NARANJA', pu: 25, ini: 1 }
];

function crearPlanillaEjemploFoto() {
  return {
    dia: 'Miércoles',
    horario: '12:17 - 16:18',
    fecha: '2026-10-11',
    stockInicial: ITEMS_PLANILLA_OFICIAL.map((x) => x.ini),
    boletas: [
      { boleta: '77', metodo: 'QR', items: { 3: 1, 16: 1 }, ajuste: -1 },
      { boleta: '78', metodo: 'EF', items: { 1: 1, 3: 1 }, ajuste: -7 },
      { boleta: '78', metodo: 'EF', items: { 24: 2, 26: 1 }, ajuste: 0 },
      { boleta: '79', metodo: 'EF', items: { 4: 1 }, ajuste: 2 },
      { boleta: '79', metodo: 'EF', items: { 2: 3, 7: 1 }, ajuste: -3 },
      { boleta: '80', metodo: 'EF', items: { 1: 1, 16: 1 }, ajuste: -16 },
      { boleta: '80', metodo: 'QR', items: { 3: 1 }, ajuste: 9 },
      { boleta: '81', metodo: 'QR', items: { 3: 2 }, ajuste: -2 },
      { boleta: '81', metodo: 'EF', items: { 4: 1 }, ajuste: 2 },
      { boleta: '82', metodo: 'QR', items: { 4: 1 }, ajuste: 2 },
      { boleta: '83', metodo: 'EF', items: {}, ajuste: 0 },
      { boleta: '84', metodo: 'EF', items: {}, ajuste: 0 }
    ],
    descuentoB: 0,
    comprasF: 0,
    pagosG: 0,
    cajaInicioI: 87
  };
}

const CUENTAS_ROLES = {
  cliente: {
    pass: '1234',
    rol: 'cliente',
    etiqueta: '👤 Vista: Cliente',
    clase: 'rol-cliente',
    vistaDesktop: 'vista-cliente',
    tabMovil: 'tab-cliente'
  },
  trabajador: {
    pass: '1234',
    rol: 'trabajador',
    etiqueta: '💼 Vista: Trabajador',
    clase: 'rol-trabajador',
    vistaDesktop: 'vista-trabajador',
    tabMovil: 'tab-pos'
  },
  admin: {
    pass: '1234',
    rol: 'admin',
    etiqueta: '🛡️ Vista: Administrador',
    clase: 'rol-admin',
    vistaDesktop: 'vista-admin',
    tabMovil: 'tab-admin'
  }
};

// ============================================================================
// [MÓDULO 2]: GENERADOR DE 207 EVENTOS HISTÓRICOS INICIALES (MOCK -> LOCALSTORAGE)
// ============================================================================
function formatearFechaISO(fechaObj) {
  const y = fechaObj.getFullYear();
  const m = String(fechaObj.getMonth() + 1).padStart(2, '0');
  const d = String(fechaObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generarEventosIniciales() {
  const eventos = [];
  const ahora = new Date();
  const platos = PRODUCTOS_BASE.filter((p) => p.categoria === 'platos');
  const bebidas = PRODUCTOS_BASE.filter((p) => p.categoria === 'bebidas');
  const nombresClientes = [
    'Carlos Mamani',
    'Lucía Condori',
    'Jorge Quispe',
    'Ana Torrico',
    'Marco Flores',
    'Sofía Vargas',
    'Pedro Choque',
    'Elena Mendoza'
  ];

  let contadorId = 1001;

  // Genera 29 días anteriores x 7 eventos/día = 203 eventos históricos variados
  for (let diaAtras = 29; diaAtras >= 1; diaAtras--) {
    const fecha = new Date(ahora);
    fecha.setDate(ahora.getDate() - diaAtras);
    const fechaStr = formatearFechaISO(fecha);

    // 1. Compra de inventario (Factura Embol o insumos de cocina)
    const esFacturaEmbol = diaAtras % 2 === 1;
    if (esFacturaEmbol) {
      const bebida = bebidas[diaAtras % bebidas.length];
      const cantCajas = 12 + (diaAtras % 3) * 6;
      const montoCompra = Math.round(cantCajas * bebida.costoRepo);
      eventos.push({
        id: `EV-${contadorId++}`,
        fecha: fechaStr,
        hora: '08:30',
        tipo: 'COMPRA',
        subtipo: 'Factura Embol',
        descripcion: `Factura Embol S.A. N° 00${410 + diaAtras}: ${cantCajas}x ${bebida.nombre}`,
        metodo: 'Factura',
        monto: montoCompra,
        platosCant: 0,
        bebidasCant: 0,
        responsable: 'Trabajador Caja'
      });
    } else {
      const plato = platos[diaAtras % platos.length];
      const porc = 20 + (diaAtras % 3) * 5;
      const montoInsumos = Math.round(porc * plato.costoRepo);
      eventos.push({
        id: `EV-${contadorId++}`,
        fecha: fechaStr,
        hora: '07:45',
        tipo: 'COMPRA',
        subtipo: 'Insumos Cocina',
        descripcion: `Compra Frigorífico / Mercado (FAC-INS-${210 + diaAtras}): Insumos ${plato.nombre}`,
        metodo: 'Factura',
        monto: montoInsumos,
        platosCant: 0,
        bebidasCant: 0,
        responsable: 'Administrador'
      });
    }

    // 2. Cinco ventas variadas por día (5 platos + bebidas Embol en Efectivo y QR)
    let ventaEfectivoDia = 0;
    let ventaQRDia = 0;

    for (let v = 0; v < 5; v++) {
      const plato = platos[(diaAtras + v) % platos.length];
      const bebida = bebidas[(diaAtras + v * 2) % bebidas.length];
      const cantPlatos = 1 + ((diaAtras + v) % 3);
      const cantBebidas = (v % 2 === 0) ? 1 : 0;
      const metodo = ((diaAtras + v) % 3 === 0) ? 'QR' : 'Efectivo';
      const montoVenta = cantPlatos * plato.precio + cantBebidas * bebida.precio;

      if (metodo === 'Efectivo') ventaEfectivoDia += montoVenta;
      else ventaQRDia += montoVenta;

      const horaNum = 11 + v * 2;
      const cliente = nombresClientes[(diaAtras + v) % nombresClientes.length];
      const detalleBebida = cantBebidas > 0 ? ` + ${cantBebidas}x ${bebida.nombre}` : '';

      eventos.push({
        id: `EV-${contadorId++}`,
        fecha: fechaStr,
        hora: `${String(horaNum).padStart(2, '0')}:${(v * 11) % 60 < 10 ? '0' : ''}${(v * 11) % 60}`,
        tipo: 'VENTA',
        subtipo: 'Mostrador / Checkout',
        descripcion: `${cliente}: ${cantPlatos}x ${plato.nombre}${detalleBebida}`,
        metodo,
        monto: montoVenta,
        platosCant: cantPlatos,
        bebidasCant: cantBebidas,
        responsable: v % 2 === 0 ? 'Vista Cliente' : 'Trabajador POS'
      });
    }

    // 3. Cierre de caja diario al final de cada jornada
    eventos.push({
      id: `EV-${contadorId++}`,
      fecha: fechaStr,
      hora: '21:30',
      tipo: 'CIERRE_CAJA',
      subtipo: 'Arqueo Diario',
      descripcion: `Cierre de Caja Diario • Efectivo: ${ventaEfectivoDia} Bs | QR: ${ventaQRDia} Bs`,
      metodo: 'Arqueo',
      monto: ventaEfectivoDia + ventaQRDia,
      platosCant: 0,
      bebidasCant: 0,
      responsable: 'Trabajador Caja'
    });
  }

  // Eventos de HOY para poblar el tablero POS inicial del turno activo (+4 = 207 total)
  const hoyStr = formatearFechaISO(ahora);
  eventos.push(
    {
      id: `EV-${contadorId++}`,
      fecha: hoyStr,
      hora: '08:15',
      tipo: 'COMPRA',
      subtipo: 'Factura Embol',
      descripcion: 'Factura Embol S.A. N° 00981: 24x Coca-Cola 2 Litros (Embol)',
      metodo: 'Factura',
      monto: 264,
      platosCant: 0,
      bebidasCant: 0,
      responsable: 'Trabajador Caja'
    },
    {
      id: `EV-${contadorId++}`,
      fecha: hoyStr,
      hora: '11:40',
      tipo: 'VENTA',
      subtipo: 'POS Mesa',
      descripcion: 'Mesa 2: 2x Fritanga Boliviana + 1x Coca-Cola 2 Litros (Embol)',
      metodo: 'Efectivo',
      monto: 92,
      platosCant: 2,
      bebidasCant: 1,
      responsable: 'Trabajador POS'
    },
    {
      id: `EV-${contadorId++}`,
      fecha: hoyStr,
      hora: '12:25',
      tipo: 'VENTA',
      subtipo: 'Checkout Web',
      descripcion: 'Andrea Salvatierra: 1x Fricasé Paceño + 1x Agua Vital 600ml (Embol)',
      metodo: 'QR',
      monto: 47,
      platosCant: 1,
      bebidasCant: 1,
      responsable: 'Vista Cliente'
    },
    {
      id: `EV-${contadorId++}`,
      fecha: hoyStr,
      hora: '13:10',
      tipo: 'VENTA',
      subtipo: 'POS Mostrador',
      descripcion: 'Para Llevar: 2x Sajta de Pollo + 1x Fanta Naranja 2L (Embol)',
      metodo: 'Efectivo',
      monto: 85,
      platosCant: 2,
      bebidasCant: 1,
      responsable: 'Trabajador POS'
    }
  );

  // Más reciente primero para lectura inmediata en Auditoría y POS
  return eventos.reverse();
}

// ============================================================================
// [MÓDULO 3]: GESTIÓN DE ALMACENAMIENTO Y CÁLCULO DE MÉTRICAS (LOCALSTORAGE)
// ============================================================================
function inicializarDatosLocalStorage() {
  let eventos = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTOS) || 'null');
  if (!Array.isArray(eventos) || eventos.length < 200) {
    eventos = generarEventosIniciales();
    localStorage.setItem(STORAGE_KEYS.EVENTOS, JSON.stringify(eventos));
  }

  let stock = JSON.parse(localStorage.getItem(STORAGE_KEYS.STOCK) || 'null');
  if (!stock || typeof stock !== 'object') {
    stock = {};
    PRODUCTOS_BASE.forEach((p) => {
      stock[p.id] = p.stockInicial;
    });
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stock));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CAJA_INICIAL)) {
    localStorage.setItem(STORAGE_KEYS.CAJA_INICIAL, '350');
  }

  if (!localStorage.getItem(STORAGE_KEYS.COLA_COCINA)) {
    localStorage.setItem(
      STORAGE_KEYS.COLA_COCINA,
      JSON.stringify([
        'Mesa 2: 2x Fritanga Boliviana + Coca-Cola 2L fría',
        'Para Llevar: 2x Sajta de Pollo con tunta extra y Fanta 2L'
      ])
    );
  }

  let planilla = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANILLA) || 'null');
  if (!planilla || !Array.isArray(planilla.boletas)) {
    planilla = crearPlanillaEjemploFoto();
    localStorage.setItem(STORAGE_KEYS.PLANILLA, JSON.stringify(planilla));
  }
}

function obtenerPlanilla() {
  const planilla = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANILLA) || 'null');
  return planilla && Array.isArray(planilla.boletas) ? planilla : crearPlanillaEjemploFoto();
}

function guardarPlanilla(planilla) {
  localStorage.setItem(STORAGE_KEYS.PLANILLA, JSON.stringify(planilla));
}

function calcularTotalesPlanilla(planilla) {
  const filaStats = ITEMS_PLANILLA_OFICIAL.map((itemDef, idx) => {
    const ini = Number(planilla.stockInicial[idx]) || 0;
    let vendidos = 0;
    planilla.boletas.forEach((col) => {
      vendidos += Number(col.items[idx]) || 0;
    });
    const saldoFinal = ini - vendidos;
    const montoRow = vendidos * itemDef.pu;
    return { ini, vendidos, saldoFinal, montoRow };
  });

  const colTotals = planilla.boletas.map((col) => {
    let suma = 0;
    ITEMS_PLANILLA_OFICIAL.forEach((itemDef, idx) => {
      const q = Number(col.items[idx]) || 0;
      if (q > 0) suma += q * itemDef.pu;
    });
    return suma + (Number(col.ajuste) || 0);
  });

  let totalVentasA = 0;
  let totalQR_E = 0;
  let totalTarjeta_D = 0;

  colTotals.forEach((colMonto, colIdx) => {
    totalVentasA += colMonto;
    const met = planilla.boletas[colIdx].metodo;
    if (met === 'QR') totalQR_E += colMonto;
    else if (met === 'TARJ') totalTarjeta_D += colMonto;
  });

  const B = Number(planilla.descuentoB) || 0;
  const C = totalVentasA - B;
  const D = totalTarjeta_D;
  const E = totalQR_E;
  const F = Number(planilla.comprasF) || 0;
  const G = Number(planilla.pagosG) || 0;
  const H = C - D - E - F - G;
  const I = Number(planilla.cajaInicioI) || 0;
  const J = H + I;

  return { filaStats, colTotals, A: totalVentasA, B, C, D, E, F, G, H, I, J };
}

function registrarVentaEnPlanilla(itemsVendidos, metodoPago) {
  const planilla = obtenerPlanilla();
  let colIdx = planilla.boletas.findIndex((col) => {
    const tieneItems = Object.values(col.items).some((v) => Number(v) > 0);
    return !tieneItems && (Number(col.ajuste) || 0) === 0;
  });

  if (colIdx === -1) {
    const ultimaBoleta = parseInt(planilla.boletas[planilla.boletas.length - 1]?.boleta || '82', 10) || 82;
    planilla.boletas.push({
      boleta: String(ultimaBoleta + 1),
      metodo: metodoPago === 'QR' ? 'QR' : 'EF',
      items: {},
      ajuste: 0
    });
    colIdx = planilla.boletas.length - 1;
  } else {
    planilla.boletas[colIdx].metodo = metodoPago === 'QR' ? 'QR' : 'EF';
  }

  itemsVendidos.forEach(({ prodId, cantidad }) => {
    const rowIdx = ITEMS_PLANILLA_OFICIAL.findIndex((x) => x.prodId === prodId);
    if (rowIdx !== -1 && cantidad > 0) {
      planilla.boletas[colIdx].items[rowIdx] = (Number(planilla.boletas[colIdx].items[rowIdx]) || 0) + cantidad;
    }
  });

  guardarPlanilla(planilla);
}

function obtenerEventos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTOS) || '[]');
}

function guardarEventos(lista) {
  localStorage.setItem(STORAGE_KEYS.EVENTOS, JSON.stringify(lista));
}

function obtenerStock() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.STOCK) || '{}');
}

function guardarStock(stockObj) {
  localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stockObj));
}

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CARRITO) || '[]');
}

function guardarCarrito(carrito) {
  localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify(carrito));
}

function obtenerCajaInicial() {
  return parseFloat(localStorage.getItem(STORAGE_KEYS.CAJA_INICIAL) || '350') || 0;
}

function registrarNuevoEvento(datos) {
  const ahora = new Date();
  const eventos = obtenerEventos();
  const maxNumero = eventos.reduce((max, ev) => {
    const num = parseInt(String(ev.id || '').replace('EV-', ''), 10) || 1000;
    return Math.max(max, num);
  }, 1000);

  const nuevo = {
    id: `EV-${maxNumero + 1}`,
    fecha: formatearFechaISO(ahora),
    hora: `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`,
    tipo: datos.tipo,
    subtipo: datos.subtipo || 'Operación',
    descripcion: datos.descripcion,
    metodo: datos.metodo || 'Efectivo',
    monto: Number(datos.monto) || 0,
    platosCant: Number(datos.platosCant) || 0,
    bebidasCant: Number(datos.bebidasCant) || 0,
    responsable: datos.responsable || 'Sistema'
  };

  eventos.unshift(nuevo);
  guardarEventos(eventos);
  return nuevo;
}

function calcularMetricasGlobales() {
  const eventos = obtenerEventos();
  const hoy = formatearFechaISO(new Date());
  const cajaInicial = obtenerCajaInicial();

  let ingresosTotales = 0;
  let egresosTotales = 0;
  let platosVendidos = 0;
  let bebidasVendidas = 0;
  let hoyEfectivo = 0;
  let hoyQR = 0;
  let hoyEgresos = 0;

  eventos.forEach((ev) => {
    if (ev.tipo === 'VENTA') {
      ingresosTotales += Number(ev.monto) || 0;
      platosVendidos += Number(ev.platosCant) || 0;
      bebidasVendidas += Number(ev.bebidasCant) || 0;

      if (ev.fecha === hoy) {
        if (ev.metodo === 'Efectivo') hoyEfectivo += Number(ev.monto) || 0;
        else if (ev.metodo === 'QR') hoyQR += Number(ev.monto) || 0;
      }
    } else if (ev.tipo === 'COMPRA') {
      egresosTotales += Number(ev.monto) || 0;
      if (ev.fecha === hoy) {
        hoyEgresos += Number(ev.monto) || 0;
      }
    }
  });

  return {
    totalEventos: eventos.length,
    ingresosTotales,
    egresosTotales,
    saldoNeto: ingresosTotales - egresosTotales,
    platosVendidos,
    bebidasVendidas,
    cajaInicial,
    hoyEfectivo,
    hoyQR,
    hoyEgresos,
    saldoFisicoCaja: cajaInicial + hoyEfectivo - hoyEgresos
  };
}

// ============================================================================
// [MÓDULO 4]: UTILIDADES DOM SEGURAS (ANTI-XSS .textContent + HIDRATACIÓN)
// ============================================================================
function hidratarBotonesDOM(raiz = document) {
  const contenedor = document.getElementById('contenedorMenu');
  if (contenedor && contenedor.getAttribute('data-hidratado') !== 'true') {
    contenedor.setAttribute('data-hidratado', 'true');
  }

  raiz.querySelectorAll('button').forEach((btn) => {
    if (btn.getAttribute('data-hidratado') === 'true') return;
    btn.setAttribute('data-hidratado', 'true');
    btn.addEventListener('click', () => {
      btn.setAttribute('data-ultimo-evento', 'hidratado');
    });
  });
}

let timerToast = null;
function mostrarToast(titulo, mensaje) {
  const box = document.getElementById('toastNotificacion');
  const elTitulo = document.getElementById('toastTitulo');
  const elMsg = document.getElementById('toastMensaje');
  if (!box || !elTitulo || !elMsg) return;

  elTitulo.textContent = titulo;
  elMsg.textContent = mensaje;
  box.classList.add('visible');

  if (timerToast) clearTimeout(timerToast);
  timerToast = setTimeout(() => {
    box.classList.remove('visible');
  }, 3200);
}

function crearBadgeTexto(texto, clase) {
  const span = document.createElement('span');
  span.className = clase;
  span.textContent = texto;
  return span;
}

// ============================================================================
// [MÓDULO 5]: RENDERIZADO MODULAR DE LAS 3 VISTAS (SIN INNERHTML)
// ============================================================================
let filtroCatMenuActual = 'todos';
let textoBuscadorMenu = '';

function renderizarCatalogoCliente() {
  const grid = document.getElementById('catalogoClienteGrid');
  if (!grid) return;

  const stock = obtenerStock();
  const esMovil = document.body.classList.contains('vista-mobile');
  const cards = [];

  const filtrados = PRODUCTOS_BASE.filter((prod) => {
    const okCat = filtroCatMenuActual === 'todos' || prod.categoria === filtroCatMenuActual;
    const okTxt = !textoBuscadorMenu ||
      prod.nombre.toLowerCase().includes(textoBuscadorMenu) ||
      prod.desc.toLowerCase().includes(textoBuscadorMenu);
    return okCat && okTxt;
  });

  if (filtrados.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'col-12 text-center text-muted py-3 small';
    emptyMsg.textContent = 'No se encontraron platos o bebidas con ese criterio.';
    grid.replaceChildren(emptyMsg);
    return;
  }

  filtrados.forEach((prod) => {
    const disponibles = stock[prod.id] ?? 0;

    if (esMovil) {
      // Tarjeta compacta en grilla 2 columnas para mobile.html
      const card = document.createElement('article');
      card.className = 'compact-card';

      const img = document.createElement('img');
      img.src = prod.img;
      img.alt = prod.nombre;
      img.className = 'compact-card-img';
      img.loading = 'lazy';

      const h5 = document.createElement('h5');
      h5.textContent = prod.nombre;

      const pDesc = document.createElement('p');
      pDesc.textContent = prod.desc;

      const footer = document.createElement('div');
      footer.className = 'd-flex justify-content-between align-items-center mt-auto pt-1';

      const precioSpan = document.createElement('strong');
      precioSpan.className = 'text-success';
      precioSpan.style.fontSize = '0.76rem';
      precioSpan.textContent = `${prod.precio} Bs • (${disponibles})`;

      const btnAdd = document.createElement('button');
      btnAdd.type = 'button';
      btnAdd.className = 'btn btn-warning btn-sm py-0 px-2 fw-bold btn-add-carrito btn-hidratable';
      btnAdd.setAttribute('data-hidratado', 'false');
      btnAdd.setAttribute('data-id', prod.id);
      btnAdd.style.fontSize = '0.68rem';
      btnAdd.disabled = disponibles <= 0;
      btnAdd.textContent = disponibles > 0 ? '+ Pedir' : 'Agotado';

      footer.append(precioSpan, btnAdd);
      card.append(img, h5, pDesc, footer);
      cards.push(card);
    } else {
      // Tarjeta Bootstrap 5 para index.html escritorio
      const col = document.createElement('div');
      col.className = 'col-sm-6 col-xl-4';

      const card = document.createElement('article');
      card.className = 'producto-card';

      const img = document.createElement('img');
      img.src = prod.img;
      img.alt = prod.nombre;
      img.className = 'producto-card-img';
      img.loading = 'lazy';

      const body = document.createElement('div');
      body.className = 'p-3 d-flex flex-column flex-grow-1';

      const topRow = document.createElement('div');
      topRow.className = 'd-flex justify-content-between align-items-center gap-1 mb-1';
      topRow.append(
        crearBadgeTexto(
          prod.categoria === 'platos' ? 'Plato Típico' : 'Línea Embol',
          `badge ${prod.categoria === 'platos' ? 'badge-plato' : 'badge-embol'}`
        ),
        crearBadgeTexto(`Stock: ${disponibles}`, disponibles > 5 ? 'badge text-bg-light border' : 'badge text-bg-danger')
      );

      const h4 = document.createElement('h4');
      h4.className = 'h6 fw-bold mb-1';
      h4.textContent = prod.nombre;

      const pDesc = document.createElement('p');
      pDesc.className = 'small text-muted mb-3 flex-grow-1';
      pDesc.textContent = prod.desc;

      const bottomRow = document.createElement('div');
      bottomRow.className = 'd-flex align-items-center justify-content-between gap-2 pt-2 border-top';

      const price = document.createElement('span');
      price.className = 'fw-bold text-success fs-6';
      price.textContent = `${prod.precio} Bs`;

      const controls = document.createElement('div');
      controls.className = 'd-flex align-items-center gap-1';

      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = '1';
      qtyInput.max = String(Math.max(1, disponibles));
      qtyInput.value = '1';
      qtyInput.className = 'form-control form-control-sm input-qty-catalogo';
      qtyInput.style.width = '54px';
      qtyInput.setAttribute('aria-label', `Cantidad de ${prod.nombre}`);

      const btnAdd = document.createElement('button');
      btnAdd.type = 'button';
      btnAdd.className = 'btn btn-warning btn-sm fw-bold btn-add-carrito btn-hidratable';
      btnAdd.setAttribute('data-hidratado', 'false');
      btnAdd.setAttribute('data-id', prod.id);
      btnAdd.disabled = disponibles <= 0;
      const iconCart = document.createElement('i');
      iconCart.className = 'bi bi-cart-plus me-1';
      btnAdd.append(iconCart, document.createTextNode(disponibles > 0 ? 'Agregar' : 'Agotado'));

      controls.append(qtyInput, btnAdd);
      bottomRow.append(price, controls);
      body.append(topRow, h4, pDesc, bottomRow);
      card.append(img, body);
      col.appendChild(card);
      cards.push(col);
    }
  });

  grid.replaceChildren(...cards);
  hidratarBotonesDOM(grid);
}

function renderizarCarritoCliente() {
  const listaEl = document.getElementById('listaCarritoCliente');
  const totalEl = document.getElementById('totalCarritoCliente');
  const countEl = document.getElementById('carritoContador');
  const carrito = obtenerCarrito();

  let totalBs = 0;
  let totalUnid = 0;
  carrito.forEach((item) => {
    totalBs += item.precio * item.cantidad;
    totalUnid += item.cantidad;
  });

  if (countEl) countEl.textContent = String(totalUnid);
  if (totalEl) totalEl.textContent = `${totalBs} Bs`;
  if (!listaEl) return;

  if (carrito.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'small text-muted m-0 py-2 text-center';
    empty.textContent = 'Tu carrito está vacío. Elige platos típicos o bebidas Embol.';
    listaEl.replaceChildren(empty);
    return;
  }

  const nodos = carrito.map((item) => {
    const row = document.createElement('div');
    row.className = 'd-flex justify-content-between align-items-center gap-2 py-1 border-bottom';

    const info = document.createElement('div');
    info.style.minWidth = '0';
    info.className = 'flex-grow-1';

    const name = document.createElement('div');
    name.className = 'titulo-truncado';
    name.textContent = item.nombre;

    const sub = document.createElement('small');
    sub.className = 'text-muted';
    sub.textContent = `${item.cantidad} x ${item.precio} Bs = ${item.cantidad * item.precio} Bs`;

    info.append(name, sub);

    const btns = document.createElement('div');
    btns.className = 'd-flex align-items-center gap-1';

    const btnMenos = document.createElement('button');
    btnMenos.type = 'button';
    btnMenos.className = 'btn btn-outline-secondary btn-sm py-0 px-2 btn-carrito-qty btn-hidratable';
    btnMenos.setAttribute('data-hidratado', 'false');
    btnMenos.setAttribute('data-id', item.id);
    btnMenos.setAttribute('data-delta', '-1');
    btnMenos.textContent = '-';

    const btnMas = document.createElement('button');
    btnMas.type = 'button';
    btnMas.className = 'btn btn-outline-secondary btn-sm py-0 px-2 btn-carrito-qty btn-hidratable';
    btnMas.setAttribute('data-hidratado', 'false');
    btnMas.setAttribute('data-id', item.id);
    btnMas.setAttribute('data-delta', '1');
    btnMas.textContent = '+';

    const btnDel = document.createElement('button');
    btnDel.type = 'button';
    btnDel.className = 'btn btn-outline-danger btn-sm py-0 px-2 btn-carrito-del btn-hidratable';
    btnDel.setAttribute('data-hidratado', 'false');
    btnDel.setAttribute('data-id', item.id);
    btnDel.textContent = '✕';

    btns.append(btnMenos, btnMas, btnDel);
    row.append(info, btns);
    return row;
  });

  listaEl.replaceChildren(...nodos);
  hidratarBotonesDOM(listaEl);
}

function renderizarVistaTrabajador() {
  const metricas = calcularMetricasGlobales();
  const asignar = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  asignar('posCajaInicial', `${metricas.cajaInicial.toFixed(2)} Bs`);
  asignar('posVentasEfectivo', `${metricas.hoyEfectivo.toFixed(2)} Bs`);
  asignar('posVentasQR', `${metricas.hoyQR.toFixed(2)} Bs`);
  asignar('posEgresosEmbol', `${metricas.hoyEgresos.toFixed(2)} Bs`);
  asignar('posSaldoCaja', `${metricas.saldoFisicoCaja.toFixed(2)} Bs`);

  const tbodyPOS = document.getElementById('tablaMovimientosPOS');
  if (tbodyPOS) {
    const recientes = obtenerEventos().slice(0, 18);
    const filas = recientes.map((ev) => {
      const tr = document.createElement('tr');
      const tdHora = document.createElement('td');
      tdHora.textContent = `${ev.fecha.slice(5)} ${ev.hora}`;
      const tdTipo = document.createElement('td');
      tdTipo.appendChild(
        crearBadgeTexto(
          ev.tipo,
          ev.tipo === 'VENTA'
            ? 'badge text-bg-success'
            : ev.tipo === 'COMPRA'
              ? 'badge text-bg-danger'
              : 'badge text-bg-warning'
        )
      );
      const tdDesc = document.createElement('td');
      tdDesc.textContent = ev.descripcion;
      const tdMetodo = document.createElement('td');
      tdMetodo.textContent = ev.metodo;
      const tdMonto = document.createElement('td');
      tdMonto.className = 'text-end fw-bold';
      tdMonto.textContent = `${ev.monto} Bs`;
      tr.append(tdHora, tdTipo, tdDesc, tdMetodo, tdMonto);
      return tr;
    });
    tbodyPOS.replaceChildren(...filas);
  }
}

function renderizarStockAdmin() {
  const tbody = document.getElementById('tablaStockAdmin');
  if (!tbody) return;
  const stock = obtenerStock();

  const filas = PRODUCTOS_BASE.map((prod) => {
    const cant = stock[prod.id] ?? 0;
    const tr = document.createElement('tr');

    const tdNombre = document.createElement('td');
    const title = document.createElement('div');
    title.className = 'fw-semibold';
    title.textContent = prod.nombre;
    const cat = document.createElement('small');
    cat.className = 'text-muted';
    cat.textContent = prod.categoria === 'platos' ? 'Plato típico' : 'Línea Embol';
    tdNombre.append(title, cat);

    const tdStock = document.createElement('td');
    tdStock.className = 'text-center';
    tdStock.appendChild(
      crearBadgeTexto(`${cant} u.`, cant > 8 ? 'badge text-bg-success' : 'badge text-bg-danger')
    );

    const tdPrecio = document.createElement('td');
    tdPrecio.className = 'text-end fw-semibold';
    tdPrecio.textContent = `${prod.precio} Bs`;

    const tdAccion = document.createElement('td');
    tdAccion.className = 'text-end';
    const btnRepo = document.createElement('button');
    btnRepo.type = 'button';
    btnRepo.className = 'btn btn-outline-primary btn-sm py-0 px-2 btn-reponer-stock btn-hidratable';
    btnRepo.setAttribute('data-hidratado', 'false');
    btnRepo.setAttribute('data-id', prod.id);
    btnRepo.textContent = '+12';
    tdAccion.appendChild(btnRepo);

    tr.append(tdNombre, tdStock, tdPrecio, tdAccion);
    return tr;
  });

  tbody.replaceChildren(...filas);
  hidratarBotonesDOM(tbody);
}

function renderizarVistaAdmin() {
  const metricas = calcularMetricasGlobales();
  const asignar = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  asignar('kpiTotalEventos', String(metricas.totalEventos));
  asignar('kpiIngresosTotales', `${metricas.ingresosTotales.toFixed(0)} Bs`);
  asignar('kpiEgresosTotales', `${metricas.egresosTotales.toFixed(0)} Bs`);
  asignar('kpiSaldoNeto', `${metricas.saldoNeto.toFixed(0)} Bs`);
  asignar('kpiPlatosVendidos', String(metricas.platosVendidos));
  asignar('kpiBebidasVendidas', String(metricas.bebidasVendidas));

  renderizarStockAdmin();

  const tbodyAudit = document.getElementById('tablaAuditoriaEventos');
  const contadorAudit = document.getElementById('contadorEventosAuditoria');
  if (!tbodyAudit) return;

  const tipoFiltro = document.getElementById('filtroTipoEvento')?.value || 'todos';
  const metodoFiltro = document.getElementById('filtroMetodoEvento')?.value || 'todos';
  const textoFiltro = (document.getElementById('buscarEventoAdmin')?.value || '').trim().toLowerCase();

  const eventos = obtenerEventos().filter((ev) => {
    const okTipo = tipoFiltro === 'todos' || ev.tipo === tipoFiltro;
    const okMetodo = metodoFiltro === 'todos' || ev.metodo === metodoFiltro;
    const okTexto = !textoFiltro ||
      ev.descripcion.toLowerCase().includes(textoFiltro) ||
      ev.id.toLowerCase().includes(textoFiltro) ||
      ev.responsable.toLowerCase().includes(textoFiltro);
    return okTipo && okMetodo && okTexto;
  });

  if (contadorAudit) contadorAudit.textContent = `${eventos.length} registros`;

  const filas = eventos.map((ev) => {
    const tr = document.createElement('tr');
    const tdId = document.createElement('td');
    tdId.className = 'text-muted';
    tdId.textContent = ev.id;
    const tdFecha = document.createElement('td');
    tdFecha.textContent = `${ev.fecha} ${ev.hora}`;
    const tdTipo = document.createElement('td');
    tdTipo.appendChild(
      crearBadgeTexto(
        ev.tipo,
        ev.tipo === 'VENTA'
          ? 'badge text-bg-success'
          : ev.tipo === 'COMPRA'
            ? 'badge text-bg-danger'
            : 'badge text-bg-warning'
      )
    );
    const tdDesc = document.createElement('td');
    tdDesc.textContent = ev.descripcion;
    const tdMetodo = document.createElement('td');
    tdMetodo.textContent = ev.metodo;
    const tdMonto = document.createElement('td');
    tdMonto.className = 'text-end fw-bold';
    tdMonto.textContent = `${ev.monto} Bs`;
    tr.append(tdId, tdFecha, tdTipo, tdDesc, tdMetodo, tdMonto);
    return tr;
  });

  tbodyAudit.replaceChildren(...filas);
}

function poblarSelectsProductos() {
  const selPos = document.getElementById('posSelectProducto');
  const selEmbol = document.getElementById('embolProducto');

  [selPos, selEmbol].forEach((sel) => {
    if (!sel) return;
    sel.replaceChildren();
    PRODUCTOS_BASE.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = sel === selPos ? `${p.nombre} (${p.precio} Bs)` : `${p.nombre} (Costo ref. ${p.costoRepo} Bs)`;
      sel.appendChild(opt);
    });
  });
}

function refrescarTotalesPlanillaEnVivo(planilla) {
  const calc = calcularTotalesPlanilla(planilla);
  const tabla = document.getElementById('tablaPlanillaFisica');

  if (tabla) {
    calc.filaStats.forEach((st, idx) => {
      const tdSaldo = tabla.querySelector(`[data-saldo-row="${idx}"]`);
      const tdMonto = tabla.querySelector(`[data-monto-row="${idx}"]`);
      if (tdSaldo) tdSaldo.textContent = st.saldoFinal === 0 ? '-' : String(st.saldoFinal);
      if (tdMonto) tdMonto.textContent = st.montoRow > 0 ? String(st.montoRow) : '-';
    });

    calc.colTotals.forEach((tot, cIdx) => {
      const tdCol = tabla.querySelector(`[data-col-total="${cIdx}"]`);
      if (tdCol) tdCol.textContent = tot !== 0 ? String(tot) : '-';
    });

    const tdGeneral = tabla.querySelector('#planillaTotalGeneral');
    if (tdGeneral) tdGeneral.textContent = String(calc.A);
    const tdDescFoot = tabla.querySelector('#planillaDescFoot');
    if (tdDescFoot) tdDescFoot.textContent = calc.B > 0 ? String(calc.B) : '-';
  }

  const setTexto = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };
  setTexto('liqA_TotalVentas', `${calc.A} Bs`);
  setTexto('liqC_TotalIngresos', `${calc.C} Bs`);
  setTexto('liqD_Tarjeta', `${calc.D} Bs`);
  setTexto('liqE_QR', `${calc.E} Bs`);
  setTexto('liqH_TotalEfectivo', `${calc.H} Bs`);
  setTexto('liqJ_EfectivoMasCaja', `${calc.J} Bs`);
}

function renderizarPlanillaFisica() {
  const tabla = document.getElementById('tablaPlanillaFisica');
  const planilla = obtenerPlanilla();
  const calc = calcularTotalesPlanilla(planilla);

  const elDia = document.getElementById('planillaDia');
  const elHorario = document.getElementById('planillaHorario');
  const elFecha = document.getElementById('planillaFecha');
  if (elDia && document.activeElement !== elDia) elDia.value = planilla.dia || '';
  if (elHorario && document.activeElement !== elHorario) elHorario.value = planilla.horario || '';
  if (elFecha && document.activeElement !== elFecha) elFecha.value = planilla.fecha || '';

  const setVal = (id, v) => {
    const el = document.getElementById(id);
    if (el && document.activeElement !== el) el.value = String(v);
  };
  setVal('liqB_Descuento', planilla.descuentoB);
  setVal('liqF_Compras', planilla.comprasF);
  setVal('liqG_Pagos', planilla.pagosG);
  setVal('liqI_CajaInicio', planilla.cajaInicioI);

  if (!tabla) {
    refrescarTotalesPlanillaEnVivo(planilla);
    return;
  }

  // Construir cabecera de 2 filas (Método pago arriba + ITEM, P.U., INI, Boletas, TOTAL #, TOTAL $, ITEM)
  const thead = document.createElement('thead');

  const trTop = document.createElement('tr');
  const thItemTop = document.createElement('th');
  thItemTop.className = 'col-fija-item';
  thItemTop.rowSpan = 2;
  thItemTop.textContent = 'ITEM (36 Productos)';

  const thPuTop = document.createElement('th');
  thPuTop.className = 'col-fija-pu';
  thPuTop.rowSpan = 2;
  thPuTop.textContent = 'P.U.';

  const thIniTop = document.createElement('th');
  thIniTop.className = 'col-fija-ini';
  thIniTop.rowSpan = 2;
  thIniTop.textContent = 'INI';

  trTop.append(thItemTop, thPuTop, thIniTop);

  planilla.boletas.forEach((col, cIdx) => {
    const thMetodo = document.createElement('th');
    if (col.metodo === 'QR') thMetodo.className = 'planilla-col-qr';

    const sel = document.createElement('select');
    sel.className = 'planilla-select-metodo';
    sel.setAttribute('data-planilla-metodo', String(cIdx));
    sel.setAttribute('aria-label', `Método boleta ${cIdx + 1}`);
    ['EF', 'QR', 'TARJ'].forEach((optVal) => {
      const o = document.createElement('option');
      o.value = optVal;
      o.textContent = optVal;
      o.selected = col.metodo === optVal;
      sel.appendChild(o);
    });
    thMetodo.appendChild(sel);
    trTop.appendChild(thMetodo);
  });

  const thTotNumTop = document.createElement('th');
  thTotNumTop.rowSpan = 2;
  thTotNumTop.textContent = 'TOTAL #';
  const thTotBsTop = document.createElement('th');
  thTotBsTop.rowSpan = 2;
  thTotBsTop.textContent = 'TOTAL $';
  const thItemDerTop = document.createElement('th');
  thItemDerTop.rowSpan = 2;
  thItemDerTop.textContent = 'ITEM';
  trTop.append(thTotNumTop, thTotBsTop, thItemDerTop);

  const trBoletas = document.createElement('tr');
  planilla.boletas.forEach((col, cIdx) => {
    const thBol = document.createElement('th');
    if (col.metodo === 'QR') thBol.className = 'planilla-col-qr';
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'planilla-input-cell text-white';
    inp.style.width = '36px';
    inp.value = col.boleta;
    inp.setAttribute('data-planilla-boleta', String(cIdx));
    inp.setAttribute('aria-label', `Boleta columna ${cIdx + 1}`);
    thBol.appendChild(inp);
    trBoletas.appendChild(thBol);
  });

  thead.append(trTop, trBoletas);

  // Construir cuerpo con los 36 ítems + fila de Envase/Ajuste
  const tbody = document.createElement('tbody');
  ITEMS_PLANILLA_OFICIAL.forEach((itemDef, rIdx) => {
    const tr = document.createElement('tr');
    const st = calc.filaStats[rIdx];

    const tdItem = document.createElement('td');
    tdItem.className = 'col-fija-item';
    tdItem.textContent = itemDef.item;

    const tdPu = document.createElement('td');
    tdPu.className = 'col-fija-pu';
    tdPu.textContent = String(itemDef.pu);

    const tdIni = document.createElement('td');
    tdIni.className = 'col-fija-ini';
    const inpIni = document.createElement('input');
    inpIni.type = 'number';
    inpIni.min = '0';
    inpIni.className = 'planilla-input-cell';
    inpIni.value = st.ini > 0 ? String(st.ini) : '';
    inpIni.placeholder = '-';
    inpIni.setAttribute('data-planilla-ini', String(rIdx));
    inpIni.setAttribute('aria-label', `Stock inicial ${itemDef.item}`);
    tdIni.appendChild(inpIni);

    tr.append(tdItem, tdPu, tdIni);

    planilla.boletas.forEach((col, cIdx) => {
      const td = document.createElement('td');
      if (col.metodo === 'QR') td.className = 'planilla-col-qr';
      const inpQty = document.createElement('input');
      inpQty.type = 'number';
      inpQty.min = '0';
      inpQty.className = 'planilla-input-cell';
      const val = Number(col.items[rIdx]) || 0;
      inpQty.value = val > 0 ? String(val) : '';
      inpQty.setAttribute('data-planilla-row', String(rIdx));
      inpQty.setAttribute('data-planilla-col', String(cIdx));
      inpQty.setAttribute('aria-label', `${itemDef.item} boleta ${col.boleta}`);
      td.appendChild(inpQty);
      tr.appendChild(td);
    });

    const tdSaldo = document.createElement('td');
    tdSaldo.className = 'fw-bold';
    tdSaldo.setAttribute('data-saldo-row', String(rIdx));
    tdSaldo.textContent = st.saldoFinal === 0 ? '-' : String(st.saldoFinal);

    const tdMonto = document.createElement('td');
    tdMonto.className = 'fw-bold text-success';
    tdMonto.setAttribute('data-monto-row', String(rIdx));
    tdMonto.textContent = st.montoRow > 0 ? String(st.montoRow) : '-';

    const tdItemDer = document.createElement('td');
    tdItemDer.className = 'text-start fw-semibold';
    tdItemDer.textContent = itemDef.item;

    tr.append(tdSaldo, tdMonto, tdItemDer);
    tbody.appendChild(tr);
  });

  // Fila 37: Envase / Ajuste por Boleta (+/- Bs)
  const trAjuste = document.createElement('tr');
  const tdAjLbl = document.createElement('td');
  tdAjLbl.className = 'col-fija-item text-muted';
  tdAjLbl.textContent = 'ENVASE / AJUSTE (+/-)';
  const tdAjPu = document.createElement('td');
  tdAjPu.className = 'col-fija-pu';
  tdAjPu.textContent = 'Bs';
  const tdAjIni = document.createElement('td');
  tdAjIni.className = 'col-fija-ini';
  tdAjIni.textContent = '-';
  trAjuste.append(tdAjLbl, tdAjPu, tdAjIni);

  planilla.boletas.forEach((col, cIdx) => {
    const td = document.createElement('td');
    if (col.metodo === 'QR') td.className = 'planilla-col-qr';
    const inpAj = document.createElement('input');
    inpAj.type = 'number';
    inpAj.className = 'planilla-input-cell';
    const aj = Number(col.ajuste) || 0;
    inpAj.value = aj !== 0 ? String(aj) : '';
    inpAj.placeholder = '0';
    inpAj.setAttribute('data-planilla-ajuste', String(cIdx));
    inpAj.setAttribute('aria-label', `Ajuste boleta ${col.boleta}`);
    td.appendChild(inpAj);
    trAjuste.appendChild(td);
  });

  const tdAjSaldo = document.createElement('td');
  tdAjSaldo.textContent = '-';
  const tdAjMonto = document.createElement('td');
  tdAjMonto.textContent = '-';
  const tdAjDer = document.createElement('td');
  tdAjDer.className = 'text-start text-muted';
  tdAjDer.textContent = 'ENVASE / AJUSTE';
  trAjuste.append(tdAjSaldo, tdAjMonto, tdAjDer);
  tbody.appendChild(trAjuste);

  // Pie de tabla: TOTAL VENTAS por columna y DESCUENTO/PROMO
  const tfoot = document.createElement('tfoot');
  const trTotal = document.createElement('tr');
  const tdTotLbl = document.createElement('td');
  tdTotLbl.className = 'col-fija-item';
  tdTotLbl.colSpan = 3;
  tdTotLbl.textContent = 'TOTAL VENTAS';
  trTotal.appendChild(tdTotLbl);

  calc.colTotals.forEach((tot, cIdx) => {
    const td = document.createElement('td');
    if (planilla.boletas[cIdx].metodo === 'QR') td.className = 'planilla-col-qr';
    td.setAttribute('data-col-total', String(cIdx));
    td.textContent = tot !== 0 ? String(tot) : '-';
    trTotal.appendChild(td);
  });

  const tdTotVacio = document.createElement('td');
  tdTotVacio.textContent = '';
  const tdTotGeneral = document.createElement('td');
  tdTotGeneral.id = 'planillaTotalGeneral';
  tdTotGeneral.className = 'text-success';
  tdTotGeneral.textContent = String(calc.A);
  const tdTotName = document.createElement('td');
  tdTotName.className = 'text-start';
  tdTotName.textContent = 'TOTAL VENTAS';
  trTotal.append(tdTotVacio, tdTotGeneral, tdTotName);

  const trDesc = document.createElement('tr');
  const tdDescLbl = document.createElement('td');
  tdDescLbl.className = 'col-fija-item';
  tdDescLbl.colSpan = 3 + planilla.boletas.length;
  tdDescLbl.textContent = 'DESCUENTO / PROMO (B)';
  const tdDescVacio = document.createElement('td');
  tdDescVacio.textContent = '';
  const tdDescVal = document.createElement('td');
  tdDescVal.id = 'planillaDescFoot';
  tdDescVal.textContent = calc.B > 0 ? String(calc.B) : '-';
  const tdDescName = document.createElement('td');
  tdDescName.className = 'text-start';
  tdDescName.textContent = 'DESCUENTO/PROMO';
  trDesc.append(tdDescLbl, tdDescVacio, tdDescVal, tdDescName);

  tfoot.append(trTotal, trDesc);
  tabla.replaceChildren(thead, tbody, tfoot);
  refrescarTotalesPlanillaEnVivo(planilla);
}

function refrescarTodasLasVistas() {
  renderizarCatalogoCliente();
  renderizarCarritoCliente();
  renderizarPlanillaFisica();
  renderizarVistaTrabajador();
  renderizarVistaAdmin();
}

// ============================================================================
// [MÓDULO 6]: OPERACIONES DEL SISTEMA (CARRITO, CHECKOUT, POS, KARDEX, CSV)
// ============================================================================
function agregarProductoAlCarrito(productId, cantidad) {
  const prod = PRODUCTOS_BASE.find((p) => p.id === productId);
  if (!prod) return;
  const stock = obtenerStock();
  const disponible = stock[productId] ?? 0;

  if (disponible <= 0) {
    mostrarToast('Stock agotado', `No queda stock disponible de ${prod.nombre}.`);
    return;
  }

  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.id === productId);
  const nuevaCant = Math.min(disponible, (existente ? existente.cantidad : 0) + cantidad);

  if (existente) existente.cantidad = nuevaCant;
  else carrito.push({ id: prod.id, nombre: prod.nombre, categoria: prod.categoria, precio: prod.precio, cantidad: nuevaCant });

  guardarCarrito(carrito);
  renderizarCarritoCliente();
  mostrarToast('Agregado al carrito', `${cantidad}x ${prod.nombre}`);
}

function agregarItemColaCocinaDOM(texto, guardarEnStorage = true) {
  const lista = document.getElementById('listaCanciones');
  if (lista) {
    const fila = document.createElement('div');
    fila.className = 'fila-cancion';

    const span = document.createElement('span');
    span.className = 'titulo-truncado';
    span.textContent = texto;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-danger btn-sm btn-tactil btn-quitar-cola btn-hidratable';
    btn.setAttribute('data-hidratado', 'false');
    btn.setAttribute('aria-label', 'Despachar comanda');
    btn.textContent = '✓';

    fila.append(span, btn);
    lista.prepend(fila);
    hidratarBotonesDOM(fila);
  }

  if (guardarEnStorage) {
    const cola = JSON.parse(localStorage.getItem(STORAGE_KEYS.COLA_COCINA) || '[]');
    cola.unshift(texto);
    localStorage.setItem(STORAGE_KEYS.COLA_COCINA, JSON.stringify(cola.slice(0, 12)));
  }
}

function agregarHistorialRapidoAntiXSS(titular, detalle) {
  const lista = document.getElementById('listaReservas');
  if (!lista) return;
  const li = document.createElement('li');
  li.className = 'item-reserva';
  const strong = document.createElement('strong');
  strong.textContent = `${titular} — `;
  const span = document.createElement('span');
  span.textContent = detalle;
  li.append(strong, span);
  lista.prepend(li);
}

function exportarEventosCSV() {
  const eventos = obtenerEventos();
  const encabezados = ['ID', 'Fecha', 'Hora', 'Tipo', 'Subtipo', 'Descripcion', 'Metodo', 'Monto_Bs', 'Responsable'];
  const filas = eventos.map((e) =>
    [e.id, e.fecha, e.hora, e.tipo, e.subtipo, `"${String(e.descripcion).replace(/"/g, '""')}"`, e.metodo, e.monto, e.responsable].join(',')
  );
  const csv = [encabezados.join(','), ...filas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `auditoria-sabores-${formatearFechaISO(new Date())}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  mostrarToast('Exportación lista', `Se descargaron ${eventos.length} eventos en formato CSV.`);
}

// ============================================================================
// [MÓDULO 7]: NAVEGACIÓN SPA, LOGIN POR ROLES, PWA Y VALIDACIONES BLUR/INPUT
// ============================================================================
function cambiarVistaSPA(vistaId) {
  const paneles = document.querySelectorAll('.vista-spa-panel');
  const botones = document.querySelectorAll('.btn-vista-spa');
  if (paneles.length === 0) return;

  paneles.forEach((p) => p.classList.toggle('active', p.id === vistaId));
  botones.forEach((b) => b.classList.toggle('active', b.getAttribute('data-vista') === vistaId));
}

function cambiarTabMovil(tabId) {
  const paneles = document.querySelectorAll('.mobile-tab-panel');
  const botones = document.querySelectorAll('.btn-nav-tab');
  if (paneles.length === 0) return;

  paneles.forEach((p) => p.classList.toggle('active', p.id === tabId));
  botones.forEach((b) => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
}

function activarSubpanelMovil(panelPadre, subtabId) {
  if (!panelPadre) return;
  panelPadre.querySelectorAll('.mobile-subpanel').forEach((sp) => sp.classList.toggle('active', sp.id === subtabId));
  panelPadre.querySelectorAll('.btn-subtab').forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-subtab') === subtabId));
}

function actualizarVistaPorRol(rolClave) {
  const badge = document.getElementById('badgeRolVista');
  const btnAbrir = document.getElementById('btnAbrirLogin');
  const btnSalir = document.getElementById('btnCerrarSesion');
  const perfil = CUENTAS_ROLES[rolClave] || CUENTAS_ROLES.cliente;
  const esMovil = document.body.classList.contains('vista-mobile');

  if (badge) {
    badge.classList.remove('rol-cliente', 'rol-trabajador', 'rol-admin');
    badge.classList.add(perfil.clase);
    badge.textContent = perfil.etiqueta;
  }

  if (btnAbrir) {
    btnAbrir.textContent = rolClave && rolClave !== 'cliente'
      ? (esMovil ? '👤 Rol' : '👤 Cambiar Rol')
      : (esMovil ? '🔑 Rol' : '🔑 Iniciar Sesión');
  }

  if (btnSalir) {
    btnSalir.style.display = rolClave && rolClave !== 'cliente' ? 'inline-block' : 'none';
  }

  if (esMovil) cambiarTabMovil(perfil.tabMovil);
  else cambiarVistaSPA(perfil.vistaDesktop);
}

function validarCampo(inputId, errId, reglaFn) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (!input) return true;
  const valido = reglaFn(input.value || '');
  input.classList.toggle('input-valido', valido);
  input.classList.toggle('input-invalido', !valido);
  if (err) err.classList.toggle('visible', !valido);
  return valido;
}

function limpiarValidacion(ids) {
  ids.forEach(([inputId, errId]) => {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (input) {
      input.classList.remove('input-valido', 'input-invalido');
      input.removeAttribute('data-tocado');
    }
    if (err) err.classList.remove('visible');
  });
}

function configurarValidacionTiempoReal(pares) {
  pares.forEach(([inputId, errId, reglaFn]) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('blur', () => {
      input.setAttribute('data-tocado', 'true');
      validarCampo(inputId, errId, reglaFn);
    });
    input.addEventListener('input', () => {
      if (input.getAttribute('data-tocado') === 'true' || input.classList.contains('input-invalido')) {
        validarCampo(inputId, errId, reglaFn);
      }
    });
  });
}

function registrarServiceWorkerPWA() {
  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('sw.js')
        .then((reg) => console.log('[PWA Sabores] Service Worker activo:', reg.scope))
        .catch((err) => console.warn('[PWA Sabores] SW omitido:', err));
    });
  }
}

// ============================================================================
// [PWA ASÍNCRONO]: Consulta Fetch API con validación response.ok + .catch()
// ============================================================================
function consultarManifiestoAsincrono() {
  if (window.location.protocol === 'file:') return;
  fetch('manifest.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} al cargar manifest.json`);
      }
      return response.json();
    })
    .then((manifest) => {
      console.log('[PWA Sabores] Manifiesto verificado vía Fetch:', manifest.short_name);
    })
    .catch((err) => {
      console.warn('[PWA Sabores] Usando configuración local por fallo Fetch:', err.message);
    });
}

function inicializarDetectorRedPWA() {
  const actualizar = () => {
    const badge = document.getElementById('estadoRed');
    if (!badge) return;
    if (navigator.onLine) {
      badge.textContent = '🟢 En Línea';
      badge.style.background = '#dcfce7';
      badge.style.color = '#166534';

      const pendientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.COLA_OFFLINE) || '[]');
      if (pendientes.length > 0) {
        mostrarToast('Sincronización Offline', `Se sincronizaron ${pendientes.length} pedido(s) guardados sin conexión.`);
        localStorage.removeItem(STORAGE_KEYS.COLA_OFFLINE);
      }
    } else {
      badge.textContent = '🟠 Offline (LocalStorage)';
      badge.style.background = '#ffedd5';
      badge.style.color = '#9a3412';
    }
  };

  window.addEventListener('online', actualizar);
  window.addEventListener('offline', actualizar);
  actualizar();
}

function detectarDispositivoMovil() {
  const banner = document.getElementById('bannerDeteccionMovil');
  if (!banner) return;
  const esMovil = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  banner.classList.toggle('visible', esMovil);
}

// ============================================================================
// [MÓDULO 8]: ARRANQUE PRINCIPAL (DOMContentLoaded)
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  registrarServiceWorkerPWA();
  consultarManifiestoAsincrono();
  inicializarDatosLocalStorage();
  poblarSelectsProductos();
  refrescarTodasLasVistas();
  inicializarDetectorRedPWA();
  detectarDispositivoMovil();
  window.addEventListener('resize', detectarDispositivoMovil);

  // Hidratar todos los botones del DOM al iniciar
  setTimeout(() => hidratarBotonesDOM(document), 120);

  // Restaurar tema oscuro/claro desde localStorage
  if (localStorage.getItem(STORAGE_KEYS.TEMA) === 'oscuro') {
    document.body.classList.add('dark-mode');
  }

  document.getElementById('themeBtn')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(STORAGE_KEYS.TEMA, document.body.classList.contains('dark-mode') ? 'oscuro' : 'claro');
  });

  // Menú Hamburguesa
  const navMenu = document.getElementById('navMenu');
  document.getElementById('hamburgerBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navMenu) navMenu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('open') && !e.target.closest('#navMenu, #hamburgerBtn')) {
      navMenu.classList.remove('open');
    }
  });

  // Restaurar Rol Guardado y Pestañas SPA / Móvil
  const rolGuardado = localStorage.getItem(STORAGE_KEYS.ROL) || 'cliente';
  actualizarVistaPorRol(rolGuardado);

  document.querySelectorAll('.btn-vista-spa, .link-vista-menu').forEach((btn) => {
    btn.addEventListener('click', () => {
      cambiarVistaSPA(btn.getAttribute('data-vista'));
      if (navMenu) navMenu.classList.remove('open');
    });
  });

  document.querySelectorAll('.btn-nav-tab, .link-tab-movil').forEach((btn) => {
    btn.addEventListener('click', () => {
      cambiarTabMovil(btn.getAttribute('data-tab'));
      if (navMenu) navMenu.classList.remove('open');
    });
  });

  document.querySelectorAll('.btn-subtab').forEach((btn) => {
    btn.addEventListener('click', () => {
      activarSubpanelMovil(btn.closest('.mobile-tab-panel'), btn.getAttribute('data-subtab'));
    });
  });

  // Cargar Cola de Cocina desde LocalStorage
  const colaInicial = JSON.parse(localStorage.getItem(STORAGE_KEYS.COLA_COCINA) || '[]');
  colaInicial.slice().reverse().forEach((txt) => agregarItemColaCocinaDOM(txt, false));

  // Cargar Historial Rápido con ventas de hoy
  obtenerEventos()
    .filter((e) => e.tipo === 'VENTA')
    .slice(0, 4)
    .reverse()
    .forEach((v) => agregarHistorialRapidoAntiXSS(v.id, `${v.descripcion} (${v.monto} Bs • ${v.metodo})`));

  // Filtros Catálogo Cliente
  document.querySelectorAll('.btn-cat-menu').forEach((btn) => {
    btn.addEventListener('click', () => {
      filtroCatMenuActual = btn.getAttribute('data-cat') || 'todos';
      document.querySelectorAll('.btn-cat-menu').forEach((b) => {
        const activo = b === btn;
        b.classList.toggle('btn-warning', activo);
        b.classList.toggle('fw-bold', activo);
        b.classList.toggle('btn-outline-secondary', !activo && b.getAttribute('data-cat') !== 'bebidas');
        b.classList.toggle('btn-outline-danger', !activo && b.getAttribute('data-cat') === 'bebidas');
      });
      renderizarCatalogoCliente();
    });
  });

  document.getElementById('buscarMenuCliente')?.addEventListener('input', (e) => {
    textoBuscadorMenu = (e.target.value || '').trim().toLowerCase();
    renderizarCatalogoCliente();
  });

  // Delegación de eventos en Catálogo Cliente (Agregar al Carrito)
  document.getElementById('catalogoClienteGrid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add-carrito');
    if (!btn) return;
    const prodId = btn.getAttribute('data-id');
    const card = btn.closest('.producto-card');
    const qtyInput = card ? card.querySelector('.input-qty-catalogo') : null;
    const cantidad = Math.max(1, parseInt(qtyInput ? qtyInput.value : '1', 10) || 1);
    agregarProductoAlCarrito(prodId, cantidad);
  });

  // Delegación en Carrito (+ / - / Quitar) y Vaciar
  document.getElementById('listaCarritoCliente')?.addEventListener('click', (e) => {
    const btnQty = e.target.closest('.btn-carrito-qty');
    const btnDel = e.target.closest('.btn-carrito-del');
    const carrito = obtenerCarrito();
    const stock = obtenerStock();

    if (btnQty) {
      const id = btnQty.getAttribute('data-id');
      const delta = parseInt(btnQty.getAttribute('data-delta'), 10);
      const item = carrito.find((x) => x.id === id);
      if (!item) return;
      item.cantidad += delta;
      if (item.cantidad <= 0) {
        guardarCarrito(carrito.filter((x) => x.id !== id));
      } else {
        item.cantidad = Math.min(item.cantidad, stock[id] ?? item.cantidad);
        guardarCarrito(carrito);
      }
      renderizarCarritoCliente();
    } else if (btnDel) {
      const id = btnDel.getAttribute('data-id');
      guardarCarrito(carrito.filter((x) => x.id !== id));
      renderizarCarritoCliente();
    }
  });

  document.getElementById('btnVaciarCarrito')?.addEventListener('click', () => {
    guardarCarrito([]);
    renderizarCarritoCliente();
    mostrarToast('Carrito vaciado', 'Se limpiaron los ítems del pedido.');
  });

  // Validaciones en Tiempo Real (blur al salir + input al corregir)
  const reglasValidacionPares = [
    ['checkoutNombre', 'errCheckoutNombre', (v) => v.trim().length >= 3],
    ['inputCajaInicial', 'errCajaInicial', (v) => v !== '' && parseFloat(v) >= 0],
    ['embolFactura', 'errEmbolFactura', (v) => v.trim().length >= 4],
    ['embolCostoTotal', 'errEmbolCosto', (v) => parseFloat(v) > 0],
    ['inputCancion', 'errInputCancion', (v) => v.trim().length >= 3],
    ['loginUsuario', 'errLoginUsuario', (v) => v.trim().length >= 3],
    ['loginPassword', 'errLoginPassword', (v) => v.trim().length >= 4]
  ];
  configurarValidacionTiempoReal(reglasValidacionPares);

  // Submit Checkout Simulado -> Modal Confirmatorio + Temporizador 30s (setInterval)
  let checkoutPendiente = null;
  let timerCheckoutInterval = null;
  let segundosCheckout = 30;
  const modalCheckout = document.getElementById('modalConfirmarCheckout');

  const cerrarModalCheckout = () => {
    if (timerCheckoutInterval) {
      clearInterval(timerCheckoutInterval);
      timerCheckoutInterval = null;
    }
    if (modalCheckout) modalCheckout.classList.remove('visible');
    checkoutPendiente = null;
  };

  function procesarPedidoPendiente(datos, formOrigin) {
    const stock = obtenerStock();
    let montoTotal = 0;
    let platosCant = 0;
    let bebidasCant = 0;
    const resumenItems = [];
    const itemsPlanilla = [];

    datos.carrito.forEach((item) => {
      const disp = stock[item.id] ?? 0;
      const cantFinal = Math.min(item.cantidad, disp);
      if (cantFinal > 0) {
        stock[item.id] = disp - cantFinal;
        montoTotal += cantFinal * item.precio;
        if (item.categoria === 'platos') platosCant += cantFinal;
        else bebidasCant += cantFinal;
        resumenItems.push(`${cantFinal}x ${item.nombre}`);
        itemsPlanilla.push({ prodId: item.id, cantidad: cantFinal });
      }
    });

    if (montoTotal <= 0) {
      mostrarToast('Sin stock', 'Los productos seleccionados no tienen inventario disponible.');
      return;
    }

    guardarStock(stock);
    registrarVentaEnPlanilla(itemsPlanilla, datos.pago);
    const notaTxt = datos.notas ? ` [Nota: ${datos.notas}]` : '';
    const evento = registrarNuevoEvento({
      tipo: 'VENTA',
      subtipo: `Checkout ${datos.modalidad}`,
      descripcion: `${datos.nombre} (NIT: ${datos.nit}): ${resumenItems.join(', ')}${notaTxt}`,
      metodo: datos.pago,
      monto: montoTotal,
      platosCant,
      bebidasCant,
      responsable: 'Vista Cliente'
    });

    if (!navigator.onLine) {
      const offline = JSON.parse(localStorage.getItem(STORAGE_KEYS.COLA_OFFLINE) || '[]');
      offline.push(evento);
      localStorage.setItem(STORAGE_KEYS.COLA_OFFLINE, JSON.stringify(offline));
    }

    agregarHistorialRapidoAntiXSS(evento.id, `${datos.nombre} • ${resumenItems.join(', ')} (${montoTotal} Bs)`);
    guardarCarrito([]);
    if (formOrigin) formOrigin.reset();
    limpiarValidacion([['checkoutNombre', 'errCheckoutNombre']]);
    refrescarTodasLasVistas();

    const alertaBox = document.getElementById('alertaCheckout');
    if (alertaBox) {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-success py-2 px-3 small mb-0';
      const strong = document.createElement('strong');
      strong.textContent = `Pedido ${evento.id} confirmado (${montoTotal} Bs • ${datos.pago})`;
      const br = document.createElement('br');
      const txt = document.createTextNode(`Registrado en localStorage para ${datos.nombre}.`);
      alertDiv.append(strong, br, txt);
      alertaBox.replaceChildren(alertDiv);
      setTimeout(() => alertaBox.replaceChildren(), 4500);
    }

    mostrarToast('Pedido Confirmado', `${evento.id}: ${montoTotal} Bs registrados en Auditoría.`);
  }

  document.getElementById('formCheckoutCliente')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const carrito = obtenerCarrito();
    const okNombre = validarCampo('checkoutNombre', 'errCheckoutNombre', (v) => v.trim().length >= 3);

    if (carrito.length === 0) {
      mostrarToast('Carrito vacío', 'Agrega al menos un plato típico o bebida Embol.');
      return;
    }
    if (!okNombre) return;

    const nombre = document.getElementById('checkoutNombre').value.trim();
    const nit = (document.getElementById('checkoutNit')?.value || '').trim() || 'S/N';
    const modalidad = document.getElementById('checkoutModalidad')?.value || 'En Mesa';
    const pago = document.getElementById('checkoutPago')?.value || 'Efectivo';
    const notas = (document.getElementById('checkoutNotas')?.value || '').trim();
    const totalBs = carrito.reduce((sum, x) => sum + x.precio * x.cantidad, 0);
    const resumenTxt = carrito.map((x) => `${x.cantidad}x ${x.nombre}`).join(', ');

    checkoutPendiente = { carrito, nombre, nit, modalidad, pago, notas, form: e.target };

    if (!modalCheckout) {
      procesarPedidoPendiente(checkoutPendiente, e.target);
      checkoutPendiente = null;
      return;
    }

    const elCliente = document.getElementById('modalCheckoutCliente');
    const elResumen = document.getElementById('modalCheckoutResumen');
    const elMonto = document.getElementById('modalCheckoutMonto');
    const elTimer = document.getElementById('timerCheckout30s');
    if (elCliente) elCliente.textContent = `${nombre} (${modalidad} • ${pago})`;
    if (elResumen) elResumen.textContent = resumenTxt;
    if (elMonto) elMonto.textContent = `${totalBs} Bs`;

    segundosCheckout = 30;
    if (elTimer) elTimer.textContent = '00:30';
    modalCheckout.classList.add('visible');

    if (timerCheckoutInterval) clearInterval(timerCheckoutInterval);
    timerCheckoutInterval = setInterval(() => {
      segundosCheckout--;
      if (elTimer) elTimer.textContent = `00:${segundosCheckout < 10 ? '0' : ''}${segundosCheckout}`;
      if (segundosCheckout <= 0) {
        cerrarModalCheckout();
        mostrarToast('Reserva Expirada (30s)', 'Se agotó el tiempo límite. Vuelve a confirmar tu pedido.');
      }
    }, 1000);
  });

  document.getElementById('btnCerrarModalCheckout')?.addEventListener('click', cerrarModalCheckout);
  document.getElementById('btnCancelarModalCheckout')?.addEventListener('click', cerrarModalCheckout);
  modalCheckout?.addEventListener('click', (e) => {
    if (e.target === modalCheckout) cerrarModalCheckout();
  });

  document.getElementById('btnProcesarModalCheckout')?.addEventListener('click', () => {
    if (!checkoutPendiente) return;
    const datos = checkoutPendiente;
    cerrarModalCheckout();
    procesarPedidoPendiente(datos, datos.form);
  });

  // POS Caja Inicial (Vista Trabajador)
  document.getElementById('formCajaInicial')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validarCampo('inputCajaInicial', 'errCajaInicial', (v) => v !== '' && parseFloat(v) >= 0)) return;
    const monto = parseFloat(document.getElementById('inputCajaInicial').value) || 0;
    localStorage.setItem(STORAGE_KEYS.CAJA_INICIAL, String(monto));
    renderizarVistaTrabajador();
    limpiarValidacion([['inputCajaInicial', 'errCajaInicial']]);
    mostrarToast('Caja Inicial Actualizada', `Monto de apertura fijado en ${monto.toFixed(2)} Bs.`);
  });

  // POS Comanda Rápida (Vista Trabajador)
  document.getElementById('formComandaPOS')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const prodId = document.getElementById('posSelectProducto')?.value;
    const cant = Math.max(1, parseInt(document.getElementById('posCantidad')?.value || '1', 10) || 1);
    const mesa = (document.getElementById('posClienteMesa')?.value || '').trim() || 'Mostrador';
    const pago = document.getElementById('posMetodoPago')?.value || 'Efectivo';

    const prod = PRODUCTOS_BASE.find((p) => p.id === prodId);
    const stock = obtenerStock();
    if (!prod) return;
    if ((stock[prodId] ?? 0) < cant) {
      mostrarToast('Stock insuficiente', `Solo quedan ${stock[prodId] ?? 0} unidades de ${prod.nombre}.`);
      return;
    }

    stock[prodId] -= cant;
    guardarStock(stock);
    registrarVentaEnPlanilla([{ prodId, cantidad: cant }], pago);
    const monto = cant * prod.precio;
    const evento = registrarNuevoEvento({
      tipo: 'VENTA',
      subtipo: 'POS Rápido',
      descripcion: `${mesa}: ${cant}x ${prod.nombre}`,
      metodo: pago,
      monto,
      platosCant: prod.categoria === 'platos' ? cant : 0,
      bebidasCant: prod.categoria === 'bebidas' ? cant : 0,
      responsable: 'Trabajador POS'
    });

    agregarItemColaCocinaDOM(`${mesa}: ${cant}x ${prod.nombre}`, true);
    agregarHistorialRapidoAntiXSS(evento.id, `${mesa}: ${cant}x ${prod.nombre} (${monto} Bs)`);
    refrescarTodasLasVistas();
    mostrarToast('Comanda POS Cobrada', `${cant}x ${prod.nombre} • ${monto} Bs (${pago})`);
  });

  // Factura Embol / Compra de Insumos (Vista Trabajador)
  document.getElementById('formCompraEmbol')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const okFac = validarCampo('embolFactura', 'errEmbolFactura', (v) => v.trim().length >= 4);
    const okCosto = validarCampo('embolCostoTotal', 'errEmbolCosto', (v) => parseFloat(v) > 0);
    if (!okFac || !okCosto) return;

    const proveedor = document.getElementById('embolProveedor')?.value || 'Embol S.A.';
    const factura = document.getElementById('embolFactura').value.trim().toUpperCase();
    const prodId = document.getElementById('embolProducto')?.value;
    const cant = Math.max(1, parseInt(document.getElementById('embolCantidad')?.value || '12', 10) || 12);
    const costo = parseFloat(document.getElementById('embolCostoTotal').value) || 0;
    const prod = PRODUCTOS_BASE.find((p) => p.id === prodId);

    const stock = obtenerStock();
    if (prod) {
      stock[prodId] = (stock[prodId] ?? 0) + cant;
      guardarStock(stock);
    }

    registrarNuevoEvento({
      tipo: 'COMPRA',
      subtipo: proveedor.includes('Embol') ? 'Factura Embol' : 'Insumos Cocina',
      descripcion: `Factura ${proveedor} ${factura}: ${cant}x ${prod ? prod.nombre : 'Insumos'}`,
      metodo: 'Factura',
      monto: costo,
      platosCant: 0,
      bebidasCant: 0,
      responsable: 'Trabajador Caja'
    });

    e.target.reset();
    document.getElementById('embolCantidad').value = '12';
    document.getElementById('embolCostoTotal').value = '110';
    limpiarValidacion([['embolFactura', 'errEmbolFactura'], ['embolCostoTotal', 'errEmbolCosto']]);
    refrescarTodasLasVistas();
    mostrarToast('Factura Registrada en Kardex', `+${cant} unidades añadidas al inventario.`);
  });

  // Cierre de Caja Diario (Vista Trabajador)
  document.getElementById('btnCierreCajaDiario')?.addEventListener('click', () => {
    const m = calcularMetricasGlobales();
    const evento = registrarNuevoEvento({
      tipo: 'CIERRE_CAJA',
      subtipo: 'Arqueo Diario',
      descripcion: `Cierre de Caja Diario • Inicial: ${m.cajaInicial} Bs | EF: ${m.hoyEfectivo} Bs | QR: ${m.hoyQR} Bs | Saldo Físico: ${m.saldoFisicoCaja} Bs`,
      metodo: 'Arqueo',
      monto: m.hoyEfectivo + m.hoyQR,
      platosCant: 0,
      bebidasCant: 0,
      responsable: 'Trabajador Caja'
    });
    refrescarTodasLasVistas();
    mostrarToast('Cierre de Caja Registrado', `${evento.id}: Saldo físico ${m.saldoFisicoCaja.toFixed(2)} Bs.`);
  });

  // Eventos interactivos de la Planilla Digital de Control Físico (A - J)
  document.getElementById('tablaPlanillaFisica')?.addEventListener('input', (e) => {
    const target = e.target;
    const planilla = obtenerPlanilla();

    if (target.hasAttribute('data-planilla-ini')) {
      const rIdx = parseInt(target.getAttribute('data-planilla-ini'), 10);
      planilla.stockInicial[rIdx] = Math.max(0, parseInt(target.value || '0', 10) || 0);
    } else if (target.hasAttribute('data-planilla-row')) {
      const rIdx = parseInt(target.getAttribute('data-planilla-row'), 10);
      const cIdx = parseInt(target.getAttribute('data-planilla-col'), 10);
      const val = Math.max(0, parseInt(target.value || '0', 10) || 0);
      if (val > 0) planilla.boletas[cIdx].items[rIdx] = val;
      else delete planilla.boletas[cIdx].items[rIdx];
    } else if (target.hasAttribute('data-planilla-boleta')) {
      const cIdx = parseInt(target.getAttribute('data-planilla-boleta'), 10);
      planilla.boletas[cIdx].boleta = target.value;
    } else if (target.hasAttribute('data-planilla-ajuste')) {
      const cIdx = parseInt(target.getAttribute('data-planilla-ajuste'), 10);
      planilla.boletas[cIdx].ajuste = parseFloat(target.value || '0') || 0;
    } else {
      return;
    }

    guardarPlanilla(planilla);
    refrescarTotalesPlanillaEnVivo(planilla);
  });

  document.getElementById('tablaPlanillaFisica')?.addEventListener('change', (e) => {
    const target = e.target;
    if (!target.hasAttribute('data-planilla-metodo')) return;
    const cIdx = parseInt(target.getAttribute('data-planilla-metodo'), 10);
    const planilla = obtenerPlanilla();
    planilla.boletas[cIdx].metodo = target.value;
    guardarPlanilla(planilla);
    renderizarPlanillaFisica();
  });

  ['planillaDia', 'planillaHorario', 'planillaFecha'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', (e) => {
      const planilla = obtenerPlanilla();
      if (id === 'planillaDia') planilla.dia = e.target.value;
      else if (id === 'planillaHorario') planilla.horario = e.target.value;
      else planilla.fecha = e.target.value;
      guardarPlanilla(planilla);
    });
  });

  [
    ['liqB_Descuento', 'descuentoB'],
    ['liqF_Compras', 'comprasF'],
    ['liqG_Pagos', 'pagosG'],
    ['liqI_CajaInicio', 'cajaInicioI']
  ].forEach(([inputId, campo]) => {
    document.getElementById(inputId)?.addEventListener('input', (e) => {
      const planilla = obtenerPlanilla();
      planilla[campo] = Math.max(0, parseFloat(e.target.value || '0') || 0);
      guardarPlanilla(planilla);
      refrescarTotalesPlanillaEnVivo(planilla);
    });
  });

  document.getElementById('btnAgregarColumnaPlanilla')?.addEventListener('click', () => {
    const planilla = obtenerPlanilla();
    const ultima = parseInt(planilla.boletas[planilla.boletas.length - 1]?.boleta || '82', 10) || 82;
    planilla.boletas.push({ boleta: String(ultima + 1), metodo: 'EF', items: {}, ajuste: 0 });
    guardarPlanilla(planilla);
    renderizarPlanillaFisica();
    mostrarToast('Columna Añadida', `Se agregó la Boleta N° ${ultima + 1} a la planilla.`);
  });

  document.getElementById('btnCargarPlanillaFoto')?.addEventListener('click', () => {
    const ejemplo = crearPlanillaEjemploFoto();
    guardarPlanilla(ejemplo);
    renderizarPlanillaFisica();
    mostrarToast('Planilla Cargada', 'Datos de la hoja física restaurados (Total Ventas 584 Bs / Efectivo+Caja 452 Bs).');
  });

  document.getElementById('btnLimpiarPlanilla')?.addEventListener('click', () => {
    const planilla = obtenerPlanilla();
    const calc = calcularTotalesPlanilla(planilla);
    const nueva = {
      dia: 'Hoy',
      horario: '12:00 - 20:00',
      fecha: formatearFechaISO(new Date()),
      stockInicial: calc.filaStats.map((st) => Math.max(0, st.saldoFinal)),
      boletas: Array.from({ length: 8 }, (_, idx) => ({
        boleta: String(100 + idx),
        metodo: 'EF',
        items: {},
        ajuste: 0
      })),
      descuentoB: 0,
      comprasF: 0,
      pagosG: 0,
      cajaInicioI: calc.J
    };
    guardarPlanilla(nueva);
    renderizarPlanillaFisica();
    mostrarToast('Nuevo Turno Listo', `Stock inicial y Caja (${calc.J} Bs) trasladados al nuevo turno.`);
  });

  document.getElementById('btnGuardarPlanillaEvento')?.addEventListener('click', () => {
    const planilla = obtenerPlanilla();
    const c = calcularTotalesPlanilla(planilla);
    const evento = registrarNuevoEvento({
      tipo: 'CIERRE_CAJA',
      subtipo: 'Planilla Física A-J',
      descripcion: `Arqueo Planilla (${planilla.dia} ${planilla.fecha}) • A:${c.A} Bs | E(QR):${c.E} Bs | H(EF):${c.H} Bs | I(Caja):${c.I} Bs | J:${c.J} Bs`,
      metodo: 'Arqueo',
      monto: c.C,
      platosCant: 0,
      bebidasCant: 0,
      responsable: 'Trabajador Planilla'
    });
    refrescarTodasLasVistas();
    mostrarToast('Arqueo Guardado en Auditoría', `${evento.id}: Liquidación J = ${c.J} Bs registrada.`);
  });

  // Cola de Comandas en Cocina (Delegación + Validación)
  document.getElementById('btnPedir')?.addEventListener('click', () => {
    if (!validarCampo('inputCancion', 'errInputCancion', (v) => v.trim().length >= 3)) return;
    const input = document.getElementById('inputCancion');
    agregarItemColaCocinaDOM(input.value.trim(), true);
    input.value = '';
    limpiarValidacion([['inputCancion', 'errInputCancion']]);
  });

  document.getElementById('listaCanciones')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-quitar-cola');
    if (!btn) return;
    const fila = btn.closest('.fila-cancion');
    if (fila) fila.remove();
  });

  // Delegación Stock Admin (Reposición rápida +12 unidades)
  document.getElementById('tablaStockAdmin')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-reponer-stock');
    if (!btn) return;
    const prodId = btn.getAttribute('data-id');
    const prod = PRODUCTOS_BASE.find((p) => p.id === prodId);
    if (!prod) return;

    const stock = obtenerStock();
    stock[prodId] = (stock[prodId] ?? 0) + 12;
    guardarStock(stock);

    registrarNuevoEvento({
      tipo: 'COMPRA',
      subtipo: 'Reposición Kardex',
      descripcion: `Reposición rápida Admin: +12x ${prod.nombre}`,
      metodo: 'Factura',
      monto: Math.round(12 * prod.costoRepo),
      platosCant: 0,
      bebidasCant: 0,
      responsable: 'Administrador'
    });

    refrescarTodasLasVistas();
    mostrarToast('Stock Reabastecido', `+12 unidades de ${prod.nombre}.`);
  });

  // Filtros, Exportación y Reset de 205 Eventos en Vista Administrador
  ['filtroTipoEvento', 'filtroMetodoEvento'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', renderizarVistaAdmin);
  });
  document.getElementById('buscarEventoAdmin')?.addEventListener('input', renderizarVistaAdmin);
  document.getElementById('btnExportarEventos')?.addEventListener('click', exportarEventosCSV);
  document.getElementById('btnReset200Eventos')?.addEventListener('click', () => {
    const semilla = generarEventosIniciales();
    guardarEventos(semilla);
    const stock = {};
    PRODUCTOS_BASE.forEach((p) => { stock[p.id] = p.stockInicial; });
    guardarStock(stock);
    refrescarTodasLasVistas();
    mostrarToast('Base Restaurada', `Se regeneraron ${semilla.length} eventos históricos en localStorage.`);
  });

  // Modal de Login por Roles (Cliente / Trabajador / Administrador)
  const modalLogin = document.getElementById('modalLogin');
  const cerrarModalLogin = () => {
    if (modalLogin) modalLogin.classList.remove('visible');
  };

  document.getElementById('btnAbrirLogin')?.addEventListener('click', () => {
    document.getElementById('errCredencialesLogin')?.classList.remove('visible');
    limpiarValidacion([['loginUsuario', 'errLoginUsuario'], ['loginPassword', 'errLoginPassword']]);
    if (modalLogin) modalLogin.classList.add('visible');
  });

  document.getElementById('btnCerrarLogin')?.addEventListener('click', cerrarModalLogin);
  modalLogin?.addEventListener('click', (e) => {
    if (e.target === modalLogin) cerrarModalLogin();
  });

  document.getElementById('formLogin')?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('errCredencialesLogin')?.classList.remove('visible');
    const okU = validarCampo('loginUsuario', 'errLoginUsuario', (v) => v.trim().length >= 3);
    const okP = validarCampo('loginPassword', 'errLoginPassword', (v) => v.trim().length >= 4);
    if (!okU || !okP) return;

    const u = document.getElementById('loginUsuario').value.trim().toLowerCase();
    const p = document.getElementById('loginPassword').value.trim();
    const cuenta = CUENTAS_ROLES[u];

    if (!cuenta || cuenta.pass !== p) {
      document.getElementById('errCredencialesLogin')?.classList.add('visible');
      return;
    }

    localStorage.setItem(STORAGE_KEYS.ROL, cuenta.rol);
    actualizarVistaPorRol(cuenta.rol);
    e.target.reset();
    limpiarValidacion([['loginUsuario', 'errLoginUsuario'], ['loginPassword', 'errLoginPassword']]);
    cerrarModalLogin();
    mostrarToast('Sesión Iniciada', `Cambiado a ${cuenta.etiqueta}`);
  });

  document.getElementById('btnCerrarSesion')?.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEYS.ROL, 'cliente');
    actualizarVistaPorRol('cliente');
    cerrarModalLogin();
    mostrarToast('Sesión Cerrada', 'Regresaste a 👤 Vista: Cliente');
  });
});
