<%- include('../partials/header', { titulo }) %>

<h1 class="mb-4">Editar Categoría</h1>

<form action="/categorias/editar/<%= categoria._id %>" method="POST" class="card p-4 shadow-sm">
  <div class="mb-3">
    <label class="form-label">Nombre</label>
    <input type="text" name="nombre" value="<%= categoria.nombre %>" class="form-control" required>
  </div>

  <div class="mb-3">
    <label class="form-label">Descripción</label>
    <textarea name="descripcion" class="form-control" rows="3"><%= categoria.descripcion %></textarea>
  </div>

  <button type="submit" class="btn btn-primary">Actualizar</button>
</form>

<%- include('../partials/footer') %>
