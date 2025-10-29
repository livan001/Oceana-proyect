// custom.js — versión con index, shop, carrito y checkout funcionales + imágenes + productos de services.html
(function(){
  'use strict';
  var tinyslider = function() {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
				items: 1,
				axis: "horizontal",
				controlsContainer: "#testimonial-nav",
				swipeAngle: false,
				speed: 700,
				nav: true,
				controls: true,
				autoplay: true,
				autoplayHoverPause: true,
				autoplayTimeout: 3500,
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();

  document.addEventListener('DOMContentLoaded', function(){

    console.log('[Oceana] JS cargado');

    // Productos por defecto (index, shop y services)
    let productos = JSON.parse(localStorage.getItem('productos')) || [
      { id: 1, nombre: 'Merliah Orange', precio: 49990, descripcion: 'Colección verano', img: 'images/productos/vestido1.jpg' },
      { id: 2, nombre: 'Merliah Blue', precio: 59990, descripcion: 'Azul clásico', img: 'images/productos/vestido2.jpg' },
      { id: 3, nombre: 'Merliah Yellow', precio: 59990, descripcion: 'Amarillo vibrante', img: 'images/productos/vestido3.jpg' },
      { id: 4, nombre: 'Merliah Rose', precio: 59990, descripcion: 'Rosa elegante', img: 'images/productos/vestido4.jpg' },
      { id: 5, nombre: 'Bronceador Binotinto', precio: 39990, descripcion: 'Protección + bronceado', img: 'images/productos/vestido5.jpg' },
      { id: 6, nombre: 'Bronceador Black', precio: 39990, descripcion: 'Tono intenso', img: 'images/productos/vestido6.jpg' },
      { id: 7, nombre: 'Broncedor Red', precio: 39990, descripcion: 'Rojo pasional', img: 'images/productos/vestido7.jpg' },
      { id: 8, nombre: 'Bronceador Blue', precio: 39990, descripcion: 'Azul mar', img: 'images/productos/vestido8.jpg' },
      { id: 9, nombre: 'Sombrero', precio: 69990, descripcion: 'Accesorio de verano', img: 'images/sombrero1.png' },
      { id: 10, nombre: 'Sombrero Azul', precio: 69990, descripcion: 'Estilo playero', img: 'images/sombrero2.png' },
      { id: 11, nombre: 'Bolso Ergonomic', precio: 43000, descripcion: 'Bolso versátil y cómodo', img: 'images/bolso.png' },
      { id: 12, nombre: 'Salida de baño', precio: 99990, descripcion: 'Liviano, fresco y perfecto para cualquier día bajo el sol.', img: 'images/modelo1.jpg' },
      { id: 13, nombre: 'Set Playero', precio: 78990, descripcion: 'Arena, sol y nuestro set playero. La combinación perfecta.', img: 'images/modelo2.jpg' },
      { id: 14, nombre: 'Salida Comodidad', precio: 69990, descripcion: 'Comodidad y estilo en cada paso.', img: 'images/modelo3.jpg' }
    ];

    if (!localStorage.getItem('productos')) {
      localStorage.setItem('productos', JSON.stringify(productos));
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function guardarCarrito(){
      localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function formatPrecio(num){
      try {
        return new Intl.NumberFormat('es-CO').format(num);
      } catch(e) {
        return num;
      }
    }

    /* --------------------
       Alerta personalizada
       -------------------- */
    function mostrarAviso(mensaje) {
      const aviso = document.createElement('div');
      aviso.textContent = mensaje;
      aviso.style.position = 'fixed';
      aviso.style.bottom = '30px';
      aviso.style.right = '30px';
      aviso.style.background = '#11398dff';
      aviso.style.color = '#fff';
      aviso.style.padding = '12px 20px';
      aviso.style.borderRadius = '8px';
      aviso.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      aviso.style.zIndex = '9999';
      aviso.style.transition = 'opacity 0.5s ease';
      document.body.appendChild(aviso);
      setTimeout(() => aviso.style.opacity = '0', 2000);
      setTimeout(() => aviso.remove(), 2500);
    }

    /* --------------------
       Agregar al carrito
       -------------------- */
    function agregarAlCarrito(id){
      const producto = productos.find(p => p.id === id);
      if (!producto) {
        alert('Producto no encontrado');
        return;
      }
      const item = carrito.find(i => i.id === id);
      if (item) item.cantidad++;
      else carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1, img: producto.img });

      guardarCarrito();
      mostrarAviso(`${producto.nombre} agregado al carrito 🛒`);
    }

    /* --------------------
       Mostrar catálogo en shop.html
       -------------------- */
    function mostrarCatalogo(){
      const cont = document.getElementById('catalogo');
      if (!cont) return;
      cont.innerHTML = '';

      productos.slice(0, 8).forEach(p => {
        cont.insertAdjacentHTML('beforeend', `
          <div class="col-12 col-md-4 col-lg-3 mb-5">
            <div class="product-item text-center">
              <img src="${p.img}" class="img-fluid product-thumbnail" alt="${p.nombre}">
              <h3 class="product-title mt-2">${p.nombre}</h3>
              <p class="product-desc">${p.descripcion}</p>
              <strong class="product-price d-block mb-2">$${formatPrecio(p.precio)} COP</strong>
              <button class="add-to-cart" data-id="${p.id}" style="background:none;border:none;padding:0;">
                <span class="icon-cross">
                  <img src="images/cross.svg" class="img-fluid" alt="Agregar al carrito">
                </span>
              </button>
            </div>
          </div>
        `);
      });

      cont.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(){
          agregarAlCarrito(Number(this.dataset.id));
        });
      });
    }

    /* --------------------
       Activar botones de index.html y services.html
       -------------------- */
    function activarBotonesIndex(){
      const productosIndex = document.querySelectorAll('.product-section .product-item');
      if (!productosIndex.length) return;

      productosIndex.forEach((item, i) => {
        const nombre = item.querySelector('.product-title').textContent.trim();
        const precioTxt = item.querySelector('.product-price').textContent.replace(/[^\d]/g, '');
        const precio = parseInt(precioTxt) || 0;
        const img = item.querySelector('img').src;

        const btn = item.querySelector('.icon-cross');
        if (btn) {
          btn.style.cursor = 'pointer';
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            let id = 200 + i; // ID único para productos de index/services
            const producto = { id, nombre, precio, descripcion: 'Producto destacado', img };
            productos.push(producto);
            localStorage.setItem('productos', JSON.stringify(productos));
            agregarAlCarrito(id);
          });
        }
      });
    }

    /* --------------------
       Mostrar carrito
       -------------------- */
    function mostrarCarrito(){
      const tablaBody = document.getElementById('cart-items') || document.querySelector('tbody');
      const subtotalEl = document.getElementById('subtotal') || document.querySelector('.subtotal');
      const totalEl = document.getElementById('total') || document.querySelector('.total');

      if (!tablaBody) return;

      carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      tablaBody.innerHTML = '';
      let subtotal = 0;

      carrito.forEach((item, index) => {
        const totalItem = item.precio * item.cantidad;
        subtotal += totalItem;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="product-thumbnail"><img src="${item.img}" alt="${item.nombre}" class="img-fluid" style="max-width:80px"></td>
          <td class="product-name"><h2 class="h5 text-black">${item.nombre}</h2></td>
          <td>$${formatPrecio(item.precio)} COP</td>
          <td>
            <div class="input-group mb-3 d-flex align-items-center quantity-container" style="max-width:120px;">
              <div class="input-group-prepend">
                <button class="btn btn-outline-black decrease" data-index="${index}" type="button">−</button>
              </div>
              <input type="text" class="form-control text-center quantity-amount" value="${item.cantidad}" readonly>
              <div class="input-group-append">
                <button class="btn btn-outline-black increase" data-index="${index}" type="button">+</button>
              </div>
            </div>
          </td>
          <td>$${formatPrecio(totalItem)} COP</td>
          <td><button class="btn btn-black btn-sm remove-item" data-index="${index}">X</button></td>
        `;
        tablaBody.appendChild(tr);
      });

      if (subtotalEl) subtotalEl.textContent = `$${formatPrecio(subtotal)} COP`;
      if (totalEl) totalEl.textContent = `$${formatPrecio(subtotal)} COP`;

      localStorage.setItem('totalCompra', subtotal);

      tablaBody.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function(){
          const i = Number(this.dataset.index);
          carrito[i].cantidad++;
          guardarCarrito();
          mostrarCarrito();
        });
      });

      tablaBody.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function(){
          const i = Number(this.dataset.index);
          if (carrito[i].cantidad > 1) carrito[i].cantidad--;
          guardarCarrito();
          mostrarCarrito();
        });
      });

      tablaBody.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function(){
          const i = Number(this.dataset.index);
          carrito.splice(i,1);
          guardarCarrito();
          mostrarCarrito();
        });
      });
    }

    /* --------------------
       Checkout resumen con imágenes y total
       -------------------- */
    function mostrarResumenCheckout(){
      const resumenBody = document.getElementById('checkout-items') || document.querySelector('tbody');
      const totalEl = document.getElementById('checkout-total') || document.querySelector('.checkout-total');
      const resumenTotalBox = document.getElementById('checkout-total-box');
      if (!resumenBody) return;

      carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      resumenBody.innerHTML = '';
      let subtotal = 0;

      carrito.forEach(item => {
        const totalItem = item.precio * item.cantidad;
        subtotal += totalItem;

        resumenBody.insertAdjacentHTML('beforeend', `
          <tr>
            <td style="display:flex; align-items:center; gap:10px;">
              <img src="${item.img}" alt="${item.nombre}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;">
              ${item.nombre} (x${item.cantidad})
            </td>
            <td>$${formatPrecio(totalItem)} COP</td>
          </tr>
        `);
      });

      resumenBody.insertAdjacentHTML('beforeend', `
        <tr style="font-weight:700; border-top:2px solid #000;">
          <td>Total General = </td>
          <td>$${formatPrecio(subtotal)} COP</td>
        </tr>
      `);

      if (totalEl) totalEl.textContent = `$${formatPrecio(subtotal)} COP`;
      if (resumenTotalBox) resumenTotalBox.textContent = `$${formatPrecio(subtotal)} COP`;

      localStorage.setItem('totalCompra', subtotal);
    }

    /* --------------------
       Inicialización por página
       -------------------- */
    if (document.getElementById('catalogo')) mostrarCatalogo();
    if (window.location.pathname.includes('index.html') || window.location.pathname.includes('services.html')) activarBotonesIndex();
    if (window.location.pathname.includes('cart.html')) mostrarCarrito();
    if (window.location.pathname.includes('checkout.html')) mostrarResumenCheckout();

  });
})();
