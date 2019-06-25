<template>
  <div id="app">
    <top-bar/>
    <side-bar/>
    <section class="main">
      <transition name="fade-transform" mode="out-in">
        <router-view/>
      </transition>
    </section>
    <Footer/>
  </div>
</template>

<script>
import TopBar from '@/common/components/TopBar.vue'
import SideBar from '@/common/components/SideBar.vue'
import Footer from '@/common/components/Footer.vue'

export default {
  name: 'App',
  components: { TopBar, SideBar, Footer }
}
</script>

<style lang="scss">
    @import '@/assets/scss/main.scss';
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #2c3e50;
      height: 100%;
    }
</style>
