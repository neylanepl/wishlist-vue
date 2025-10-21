<script setup>
import { computed } from 'vue'
import styles from './ProductCard.module.scss'
import RatingStars from '../RatingStars/RatingStars.vue'
import HeartIcon from '../../assets/icons/HeartIcon.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  isWishlistPage: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['toggle'])
function handleToggle() {
  emit('toggle', props.product)
}

const priceInCents = computed(() => Number(props.product?.priceInCents) || 0)
const salePriceInCents = computed(() => Number(props.product?.salePriceInCents) || 0)
const hasDiscount = computed(() => salePriceInCents.value > 0 && salePriceInCents.value < priceInCents.value)

function formatPrice(cents) {
  const n = Number(cents)
  if (!Number.isFinite(n)) return ''
  return (n / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const ariaLabel = computed(() => {
  if (props.isWishlistPage) return 'Remover da wishlist'
  return props.isSaved ? 'Remover da wishlist' : 'Salvar na wishlist'
})
</script>

<template>
  <article :class="styles.card" :aria-label="product.name">
    <button
      type="button"
      @click="handleToggle"
      :aria-pressed="isSaved"
      :aria-label="ariaLabel"
      :class="[
        styles.wishlistBtn,
        { [styles.active]: isSaved, [styles.removeMode]: isWishlistPage }
      ]"
    >
      <template v-if="isWishlistPage">
        <span :class="styles.removeIcon">×</span>
      </template>
      <template v-else>
        <HeartIcon :class="styles.heartIcon" />
      </template>
    </button>

    <img :src="product.image" :alt="product.name" :class="styles.image" loading="lazy" />

    <h3 :class="styles.name">{{ product.name }}</h3>

    <RatingStars :value="product.rating" />

    <div :class="styles.prices">
      <span v-if="hasDiscount" :class="styles.old">
        {{ formatPrice(priceInCents) }}
      </span>
      <span :class="styles.current">
        {{ formatPrice(hasDiscount ? salePriceInCents : priceInCents) }}
      </span>
    </div>
  </article>
</template>
