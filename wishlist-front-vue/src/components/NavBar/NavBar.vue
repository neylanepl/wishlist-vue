<script setup>
import styles from './NavBar.module.scss'
import ProfileMenu from '../ProfileMenu/ProfileMenu.vue'
import HeartIcon from '../../assets/icons/HeartIcon.vue'
import logoNetshoes from '../../assets/logo-netshoes.svg'
</script>

<template>
  <header :class="styles.navbar" role="banner" aria-label="Navegação principal">
    <div :class="styles.logo">
      <a href="/" aria-label="Página inicial">
        <img :src="logoNetshoes" alt="Netshoes" />
      </a>
    </div>
    <div :class="styles.actions">
      <a href="/wishlist" :class="styles.wishlist" aria-label="wishlist">
        <HeartIcon :class="styles.iconHeart" />
        Wishlist
      </a>
      <ProfileMenu />
    </div>
  </header>
</template>
