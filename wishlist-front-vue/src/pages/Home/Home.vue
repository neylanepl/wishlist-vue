<script setup>
import { ref, computed, onMounted } from 'vue'
import styles from './Home.module.scss'
import MainLayout from '../../components/MainLayout/MainLayout.vue'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.vue'
import ProductCard from '../../components/ProductCard/ProductCard.vue'

const products = ref([])
const isLoading = ref(true)
const error = ref('')

const STORAGE_KEY = 'wishlist-codes'
const wishlistCodes = ref(new Set())

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) {
        wishlistCodes.value = new Set(arr)
      }
    }
  } catch (e) {
    console.warn('Falha ao carregar wishlist do localStorage:', e)
  }
}

function persistWishlist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(wishlistCodes.value)))
  } catch (e) {
    console.warn('Falha ao salvar wishlist no localStorage:', e)
  }
}

function toggleProduct(code) {
  const set = new Set(wishlistCodes.value)
  if (set.has(code)) set.delete(code)
  else set.add(code)
  wishlistCodes.value = set
  persistWishlist()
}

function isSaved(code) {
  return wishlistCodes.value.has(code)
}

function formatPrice(centsStr) {
  if (!centsStr) return ''
  const cents = parseInt(centsStr, 10)
  if (Number.isNaN(cents)) return ''
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function fetchProducts() {
  isLoading.value = true
  error.value = ''
  try {
    const res = await fetch('http://localhost:3000/products')
    if (!res.ok) throw new Error('Falha ao carregar produtos')
    const data = await res.json()
    if (!data || !Array.isArray(data.products)) throw new Error('Dados inválidos de produtos')
    products.value = data.products
  } catch (e) {
    error.value = e?.message || 'Erro desconhecido ao carregar produtos'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadWishlist()
  fetchProducts()
})

const hasProducts = computed(() => products.value.length > 0)
</script>

<template>
  <MainLayout :breadcrumb-items="[{ label: 'Home', to: '/' }]">
    <div class="home-page">

      <div v-if="isLoading" :class="styles.state">Carregando produtos...</div>
      <div v-else-if="error" :class="[styles.state, styles.error]">{{ error }}</div>
      <div v-else-if="!hasProducts" :class="styles.state">Nenhum produto disponível no momento.</div>

      <div v-else :class="styles.grid">
        <ProductCard
          v-for="p in products"
          :key="p.code"
          :product="p"
          :isSaved="isSaved(p.code)"
          @toggle="(prod) => toggleProduct(prod.code)"
        />
      </div>
    </div>
  </MainLayout>
  
</template>

<style scoped>
.breadcrumb {
  margin-bottom: 16px;
  font-size: 14px;
}
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  color: #213547;
}
.image-wrap {
  position: relative;
}
.image-wrap img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}
.wish-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 6px 10px;
}
.info {
  padding: 12px;
}
.title {
  margin: 0 0 8px;
  font-size: 16px;
  line-height: 1.3;
}
.prices {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.price.sale {
  color: #16a34a;
  font-weight: 600;
}
.price.strike {
  text-decoration: line-through;
  color: #6b7280;
}
.rating {
  margin-top: 6px;
  color: #f59e0b;
}
.rating .muted {
  color: #9ca3af;
}
.stock {
  margin-top: 8px;
  color: #b91c1c;
  font-weight: 500;
}
</style>
