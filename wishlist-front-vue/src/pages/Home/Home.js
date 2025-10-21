import { defineComponent, ref, computed, onMounted } from 'vue'

export default defineComponent({
	name: 'Home',
	setup() {
		const products = ref([])
		const isLoading = ref(true)
		const error = ref('')

		// Wishlist stored as codes (strings) in localStorage
		const STORAGE_KEY = 'wishlist-codes'
		const wishlistCodes = ref(new Set())

		const loadWishlist = () => {
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

		const persistWishlist = () => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(wishlistCodes.value)))
			} catch (e) {
				console.warn('Falha ao salvar wishlist no localStorage:', e)
			}
		}

		const toggleProduct = (code) => {
			const set = new Set(wishlistCodes.value)
			if (set.has(code)) set.delete(code)
			else set.add(code)
			wishlistCodes.value = set // replace to trigger reactivity
			persistWishlist()
		}

		const isSaved = (code) => wishlistCodes.value.has(code)

		const formatPrice = (centsStr) => {
			if (!centsStr) return ''
			const cents = parseInt(centsStr, 10)
			if (Number.isNaN(cents)) return ''
			return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
		}

		const fetchProducts = async () => {
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

		return {
			products,
			isLoading,
			error,
			wishlistCodes,
			toggleProduct,
			isSaved,
			hasProducts,
			formatPrice,
		}
	},
	template: `
	<div class="home-page">
		<nav style="margin-bottom:16px; font-size:14px;">
			<span>Home</span>
		</nav>

		<div v-if="isLoading" class="state">Carregando produtos...</div>
		<div v-else-if="error" class="state error">{{ error }}</div>
		<div v-else-if="!hasProducts" class="state">Nenhum produto disponível no momento.</div>

		<div v-else class="grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; text-align:left;">
			<div v-for="p in products" :key="p.code" class="card" style="border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; background:#fff; color:#213547;">
				<div style="position:relative;">
					<img :src="p.image" :alt="p.name" style="width:100%; height:200px; object-fit:cover;" />
					<button @click="toggleProduct(p.code)" :aria-pressed="isSaved(p.code)" title="Salvar na wishlist" style="position:absolute; top:8px; right:8px; background:white; border:1px solid #e5e7eb; border-radius:999px; padding:6px 10px;">
						<span v-if="isSaved(p.code)">★</span>
						<span v-else>☆</span>
					</button>
				</div>
				<div style="padding:12px;">
					<h3 style="margin:0 0 8px; font-size:16px; line-height:1.3;">{{ p.name }}</h3>
					<div style="display:flex; align-items:baseline; gap:8px;">
						<span v-if="p.salePriceInCents" style="color:#16a34a; font-weight:600;">{{ formatPrice(p.salePriceInCents) }}</span>
						<span :style="{ textDecoration: p.salePriceInCents ? 'line-through' : 'none', color: p.salePriceInCents ? '#6b7280' : '#111827' }">
							{{ formatPrice(p.priceInCents) }}
						</span>
					</div>
					<div v-if="p.rating" style="margin-top:6px; color:#f59e0b;">
						{{ '★'.repeat(Math.round(p.rating)) }}<span style="color:#9ca3af;">{{ '★'.repeat(5 - Math.round(p.rating)) }}</span>
					</div>
					<div v-if="!p.stockAvailable" style="margin-top:8px; color:#b91c1c; font-weight:500;">Sem estoque</div>
				</div>
			</div>
		</div>
	</div>
	`,
})

