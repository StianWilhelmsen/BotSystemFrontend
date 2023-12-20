<template>
    <Header />
    <slot />
    <Analytics/>
  </template>
  
  <script setup>
    import { Analytics } from '@vercel/analytics/react';
  

  </script>
<style>
body {
margin: 0px;
font-family: sans-serif;
}
</style>