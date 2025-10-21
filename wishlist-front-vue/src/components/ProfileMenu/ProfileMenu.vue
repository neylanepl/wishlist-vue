<script setup>
import { ref } from 'vue'
import styles from './ProfileMenu.module.scss'
import ProfileIcon from '../../assets/icons/ProfileIcon.vue'

const menuOpen = ref(false)
const root = ref(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function openMenu() {
  menuOpen.value = true
}

function closeMenu() {
  menuOpen.value = false
}

function onFocusOut(e) {
  const next = e.relatedTarget
  if (root.value && !(root.value instanceof Node && root.value.contains(next))) {
    closeMenu()
  }
}
</script>

<template>
  <div
    :class="styles.profile"
    ref="root"
    @mouseenter="openMenu"
    @mouseleave="closeMenu"
    @focusout="onFocusOut"
    aria-label="perfil"
    aria-haspopup="true"
    :aria-expanded="menuOpen"
  >
    <button
      :class="styles.profileBtn"
      type="button"
      aria-label="Abrir menu de perfil"
      @click="toggleMenu"
      @focus="openMenu"
    >
      <ProfileIcon :class="styles.iconUser" />
    </button>

    <ul v-if="menuOpen" :class="styles.dropdown" role="menu" aria-label="menu de perfil">
      <li>
        <button role="menuitem" type="button">Entrar</button>
      </li>
      <li>
        <button role="menuitem" type="button">Minha Conta</button>
      </li>
      <li>
        <button role="menuitem" type="button">Endereços</button>
      </li>
      <li>
        <button role="menuitem" type="button">Minha Netshoes</button>
      </li>
    </ul>
  </div>
</template>
