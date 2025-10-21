<script setup>
import { computed } from 'vue'
import styles from './Breadcrumb.module.scss'

const props = defineProps({
  items: {
    // Accept array of strings or { label, to } objects
    type: Array,
    default: () => ['Home']
  }
})

const normalized = computed(() => {
  const arr = Array.isArray(props.items) ? props.items : []
  return arr.map((it, idx) => {
    const isObj = it && typeof it === 'object'
    const label = isObj ? it.label : String(it)
    const to = isObj ? it.to : undefined
    return {
      label,
      to,
      active: idx === arr.length - 1
    }
  })
})
</script>

<template>
  <nav :class="styles.breadcrumb" aria-label="Breadcrumb">
    <ol>
      <template v-for="(item, idx) in normalized" :key="idx">
        <li :class="styles.item">
          <template v-if="item.to && !item.active">
            <a :href="item.to">{{ item.label }}</a>
          </template>
          <template v-else>
            <span :class="styles.active">{{ item.label }}</span>
          </template>
        </li>
        <li v-if="idx < normalized.length - 1" :class="styles.separator">/</li>
      </template>
    </ol>
  </nav>
  
</template>
