<template>
  <div id="app">
    <template v-if="($route.path !== '/login') && ($route.path !== '/')">
      <top-bar></top-bar>
      <side-bar></side-bar>
    </template>
    <section class="main">
        <transition name="fade-transform" mode=out-in>
            <router-view/>
        </transition>
    </section>
  </div>
</template>

<script>
import TopBar from '@/common/components/TopBar.vue'
import SideBar from '@/common/components/SideBar.vue'

export default {
  components: {TopBar, SideBar},
  name: 'App'
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
