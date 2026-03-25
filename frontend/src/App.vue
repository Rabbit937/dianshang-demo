<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('App Launch');
});

onShow(() => {
  console.log('App Show');
});

onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
@use './styles/variables.scss' as *;

/* ========================================
   RESPONSIVE BREAKPOINTS
   Mobile: < 768px
   Tablet: 768px - 1024px
   Desktop: > 1024px
   ======================================== */

:root {
  --sidebar-width: 240px;
  --header-height: 64px;
  --header-height-desktop: 72px;
}

/* Global Styles */
page {
  background-color: $bg-page;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: $text-primary;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Desktop/Tablet: Show proper content width */
@media (min-width: 768px) {
  page {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  page {
    font-size: 16px;
  }
}

/* ========================================
   LAYOUT CONTAINERS
   ======================================== */

/* Page wrapper for desktop layout */
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .page-wrapper {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* Main content area */
.main-content {
  flex: 1;
  min-width: 0;
}

@media (min-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}

/* Container for centered content */
.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 768px) {
  .container {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 32px;
  }
}

@media (min-width: 1440px) {
  .container {
    padding: 0 48px;
    max-width: 1600px;
  }
}

/* ========================================
   NAVIGATION
   ======================================== */

/* Desktop Header - Hidden on mobile */
.desktop-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height-desktop);
  background: #fff;
  border-bottom: 1px solid $border-color;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
  .desktop-header {
    display: flex;
    align-items: center;
  }
}

.desktop-header .header-inner {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 32px;
}

@media (min-width: 1024px) {
  .desktop-header .header-inner {
    padding: 0 32px;
    gap: 48px;
  }
}

@media (min-width: 1440px) {
  .desktop-header .header-inner {
    padding: 0 48px;
    max-width: 1600px;
  }
}

/* Logo */
.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.header-logo .logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}

.header-logo .logo-text {
  font-size: 20px;
  font-weight: 700;
  color: $text-primary;
  letter-spacing: -0.5px;
}

.header-logo .logo-text span {
  color: $primary-color;
}

/* Desktop Search */
.header-search {
  flex: 1;
  max-width: 600px;
}

.header-search .search-input-wrap {
  display: flex;
  align-items: center;
  background: $bg-page;
  border: 2px solid transparent;
  border-radius: 24px;
  padding: 0 20px;
  height: 44px;
  transition: all 0.2s ease;
}

.header-search .search-input-wrap:focus-within {
  border-color: $primary-color;
  background: #fff;
  box-shadow: 0 0 0 4px rgba($primary-color, 0.1);
}

.header-search .search-icon {
  color: $text-hint;
  font-size: 16px;
  margin-right: 10px;
}

.header-search .search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.header-search .search-input::placeholder {
  color: $text-hint;
}

/* Desktop Nav Links */
.header-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.header-nav .nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: $text-secondary;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.header-nav .nav-link:hover {
  color: $primary-color;
  background: rgba($primary-color, 0.05);
}

.header-nav .nav-link.active {
  color: $primary-color;
}

.header-nav .nav-icon {
  font-size: 18px;
}

/* ========================================
   SIDEBAR (Desktop/Tablet)
   ======================================== */

.desktop-sidebar {
  display: none;
  position: fixed;
  left: 0;
  top: var(--header-height-desktop);
  bottom: 0;
  width: var(--sidebar-width);
  background: #fff;
  border-right: 1px solid $border-color;
  z-index: 900;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .desktop-sidebar {
    display: block;
  }
}

.desktop-sidebar .sidebar-section {
  padding: 16px 0;
  border-bottom: 1px solid $border-light;
}

.desktop-sidebar .sidebar-title {
  padding: 8px 20px;
  font-size: 12px;
  font-weight: 600;
  color: $text-hint;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.desktop-sidebar .sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: $text-secondary;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
  cursor: pointer;
}

.desktop-sidebar .sidebar-link:hover {
  color: $primary-color;
  background: rgba($primary-color, 0.04);
}

.desktop-sidebar .sidebar-link.active {
  color: $primary-color;
  background: rgba($primary-color, 0.08);
  border-right: 3px solid $primary-color;
}

.desktop-sidebar .sidebar-link .link-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* ========================================
   MOBILE BOTTOM TAB BAR
   ======================================== */

.mobile-tabbar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 1000;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

@media (min-width: 768px) {
  .mobile-tabbar {
    display: none;
  }
}

.mobile-tabbar .tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  gap: 4px;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
  color: $text-hint;
}

.mobile-tabbar .tabbar-item.active {
  color: $primary-color;
}

.mobile-tabbar .tabbar-item .tabbar-icon {
  font-size: 22px;
  line-height: 1;
}

.mobile-tabbar .tabbar-item .tabbar-text {
  font-size: 11px;
  font-weight: 500;
}

.mobile-tabbar .tabbar-badge {
  position: absolute;
  top: 4px;
  right: 50%;
  transform: translateX(12px);
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  background: $primary-color;
  color: #fff;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
}

/* ========================================
   CONTENT AREA OFFSETS
   ======================================== */

/* Desktop content needs to account for sidebar */
@media (min-width: 768px) {
  .has-sidebar {
    margin-left: var(--sidebar-width);
  }
}

/* Desktop content needs to account for fixed header */
@media (min-width: 768px) {
  .has-fixed-header {
    padding-top: var(--header-height-desktop);
  }
}

/* Mobile content offset for tabbar */
.mobile-content-offset {
  padding-bottom: calc(60px + constant(safe-area-inset-bottom));
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
}

@media (min-width: 768px) {
  .mobile-content-offset {
    padding-bottom: 0;
  }
}

/* ========================================
   TYPOGRAPHY
   ======================================== */

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, $primary-color, $primary-light);
  border-radius: 2px;
}

.section-more {
  font-size: 13px;
  color: $text-hint;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.15s ease;
}

.section-more:hover {
  color: $primary-color;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 20px;
  }
}

/* ========================================
   GRID SYSTEMS
   ======================================== */

/* Product Grid - Responsive */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }
}

/* Category Grid - Responsive */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

@media (min-width: 480px) {
  .category-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (min-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(8, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1440px) {
  .category-grid {
    grid-template-columns: repeat(10, 1fr);
  }
}

/* ========================================
   CARDS
   ======================================== */

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;
}

@media (min-width: 768px) {
  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.product-card:active {
  transform: scale(0.98);
}

.product-card .product-image-wrap {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: $bg-page;
}

.product-card .product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .product-card:hover .product-image {
    transform: scale(1.05);
  }
}

.product-card .product-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  background: $primary-color;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
}

.product-card .product-info {
  padding: 12px;
}

.product-card .product-name {
  font-size: 13px;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 768px) {
  .product-card .product-name {
    font-size: 14px;
  }
}

.product-card .product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-card .product-price {
  color: $primary-color;
  font-size: 16px;
  font-weight: 600;
}

@media (min-width: 768px) {
  .product-card .product-price {
    font-size: 18px;
  }
}

.product-card .product-sales {
  font-size: 12px;
  color: $text-hint;
}

/* ========================================
   BANNERS
   ======================================== */

.hero-banner {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 16/7;
  background: linear-gradient(135deg, $primary-pale 0%, rgba($primary-color, 0.1) 100%);
}

@media (min-width: 768px) {
  .hero-banner {
    aspect-ratio: 16/6;
    border-radius: 20px;
  }
}

.hero-banner .banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-banner .banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 32px;
}

.hero-banner .banner-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.hero-banner .banner-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

@media (min-width: 768px) {
  .hero-banner .banner-title {
    font-size: 28px;
  }

  .hero-banner .banner-subtitle {
    font-size: 15px;
  }
}

/* Banner Swiper Dots - Desktop */
.swiper-pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
}

.swiper-pagination .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.swiper-pagination .dot.active {
  width: 24px;
  border-radius: 4px;
  background: $primary-color;
}

/* ========================================
   CATEGORY ICONS
   ======================================== */

.category-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  background: transparent;
}

@media (min-width: 768px) {
  .category-icon-item:hover {
    background: rgba($primary-color, 0.04);
    transform: translateY(-2px);
  }
}

.category-icon-item:active {
  transform: scale(0.95);
}

.category-icon-item .icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .category-icon-item .icon-circle {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    font-size: 22px;
  }
}

.category-icon-item .icon-label {
  font-size: 12px;
  color: $text-secondary;
  font-weight: 500;
  text-align: center;
}

@media (min-width: 768px) {
  .category-icon-item .icon-label {
    font-size: 13px;
  }
}

/* ========================================
   UTILITIES
   ======================================== */

/* Clear default button styles */
button::after {
  border: none;
}

button {
  background: transparent;
  padding: 0;
  margin: 0;
}

/* Text utilities */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Price styles */
.price-symbol {
  font-size: 0.75em;
  font-weight: 500;
}

.price-integer {
  font-weight: 600;
  font-family: 'DIN Alternate', 'Helvetica Neue', Arial, sans-serif;
}

/* Animation keyframes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-in-up {
  animation: fadeInUp 0.4s ease both;
}

.scale-in {
  animation: scaleIn 0.3s ease both;
}

/* Staggered animations */
.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.1s; }
.stagger-3 { animation-delay: 0.15s; }
.stagger-4 { animation-delay: 0.2s; }
.stagger-5 { animation-delay: 0.25s; }
.stagger-6 { animation-delay: 0.3s; }

/* Skeleton loading */
.skeleton {
  background: linear-gradient(90deg, $bg-light 25%, $bg-skeleton 50%, $bg-light 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Safe area utilities */
.safe-area-top {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Divider */
.divider {
  height: 1px;
  background: $border-color;
  transform: scaleY(0.5);
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: $primary-color;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9px;
}

/* ========================================
   MOBILE HEADER (overrides)
   ======================================== */

/* Hide mobile-style header on desktop */
.mobile-header {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
}

@media (min-width: 768px) {
  .mobile-header {
    display: none;
  }
}

/* ========================================
   H5 SPECIFIC
   ======================================== */

/* Hide native tabbar on H5 */
uni-tabbar {
  display: none !important;
}

/* Hide status bar area on desktop when using mobile headers */
@media (min-width: 768px) {
  .status-bar-offset {
    display: none;
  }
}
</style>
