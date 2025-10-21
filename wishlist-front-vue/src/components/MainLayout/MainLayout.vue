<script setup>
import styles from './MainLayout.module.scss'
import NavBar from '../NavBar/NavBar.vue'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'

const props = defineProps({
  breadcrumbItems: {
    type: Array,
    default: undefined
  },
  showNavBar: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div :class="styles.container">
    <NavBar v-if="props.showNavBar" />
    <div :class="styles.page">
      <div v-if="props.breadcrumbItems && props.breadcrumbItems.length" :class="styles.breadcrumbContainer">
        <Breadcrumb :items="props.breadcrumbItems" />
      </div>
      <div :class="styles.separator" />
      <div :class="styles.content">
        <slot />
      </div>
    </div>
  </div>
</template>
