<template>
  <div id="app">
    <!-- 
      Esta es la etiqueta más importante.
      Vue Router la reemplazará dinámicamente con el componente 
      que coincida con la URL actual (ej. HomeScreen, AdminDashboard, etc.).
      Sin ella, la página se verá en blanco.
    -->
    <router-view />
  </div>
</template>

<script setup>
// No se necesita lógica de script para esta configuración básica.
</script>

<style>
/* Puedes añadir estilos globales para tu aplicación aquí si lo deseas. */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>