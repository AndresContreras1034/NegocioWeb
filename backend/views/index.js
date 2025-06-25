<%- include('partials/header', { titulo }) %>

<div class="text-center py-5">
  <h1 class="display-4">Bienvenido a NegocioWeb</h1>
  <p class="lead">Tu plataforma confiable para administrar productos, usuarios y mucho más.</p>

  <% if (!usuario) { %>
    <a href="/register" class="btn btn-primary btn-lg mt-3">Regístrate gratis</a>
    <a href="/login" class="btn btn-outline-light btn-lg mt-3 ms-2">Inicia sesión</a>
  <% } else { %>
    <a href="/productos" class="btn btn-success btn-lg mt-3">Ver productos</a>
    <% if (usuario.rol === 'admin') { %>
      <a href="/panel" class="btn btn-warning btn-lg mt-3 ms-2">Ir al panel</a>
    <% } %>
  <% } %>
</div>

<section class="mt-5">
  <div class="row text-center">
    <div class="col-md-4">
      <h3>Fácil de Usar</h3>
      <p>Interfaz amigable para gestionar productos y usuarios rápidamente.</p>
    </div>
    <div class="col-md-4">
      <h3>Seguridad</h3>
      <p>Protección con tokens JWT y gestión de roles de acceso.</p>
    </div>
    <div class="col-md-4">
      <h3>Escalable</h3>
      <p>Desarrollado sobre Node.js, Express y MongoDB para escalar fácilmente.</p>
    </div>
  </div>
</section>

<%- include('partials/footer') %>

