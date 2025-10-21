<script setup>
import { computed } from 'vue'
import styles from './RatingStars.module.scss'
import RatingIcon from '../../assets/icons/RatingIcon.vue'
import HalfRatingIcon from '../../assets/icons/HalfRatingIcon.vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 5
  }
})

function getStarStatus(star, value) {
  if (star <= Math.floor(value)) return 'full'
  if (star - value <= 0.5) return 'half'
  return 'empty'
}

const stars = computed(() => {
  const result = []
  for (let i = 1; i <= props.max; i++) {
    result.push(i)
  }
  return result
})
</script>

<template>
  <div :class="styles.rating" :aria-label="`Avaliação ${value} de ${max}`">
    <span
      v-for="star in stars"
      :key="star"
      :class="[
        styles.star,
        { [styles.full]: getStarStatus(star, value) === 'full' },
        { [styles.half]: getStarStatus(star, value) === 'half' }
      ]"
    >
      <HalfRatingIcon
        v-if="getStarStatus(star, value) === 'half'"
        role="img"
        aria-label="star half"
        :class="[styles.star, styles.half]"
      />
      <RatingIcon
        v-else-if="getStarStatus(star, value) === 'full'"
        role="img"
        aria-label="star full"
        :class="styles.star"
      />
      <RatingIcon
        v-else
        role="img"
        aria-label="empty star"
        :class="styles.star"
      />
    </span>
    <span :class="styles.value">{{ value.toFixed(1) }}</span>
  </div>
</template>
