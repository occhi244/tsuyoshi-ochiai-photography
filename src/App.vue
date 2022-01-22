<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  name: "App",
  components: {},
  setup() {
    const store = useStore();
    const resize = () => {
      // set custom vh for SP.
      const vh = window.innerHeight / 100;
      document.documentElement.style.setProperty("--vh", `${vh}px`);

      // set vmin
      const vmin =
        window.innerHeight < window.innerWidth ? vh : window.innerWidth / 100;
      document.documentElement.style.setProperty("--vmin", `${vmin}px`);

      // set media type.
      const newMedia = window.matchMedia("(min-width: 769px)").matches
        ? "pc"
        : "sp";
      store.commit("setMediaType", newMedia);
    };
    resize();

    // add resize event listener.
    window.addEventListener("resize", resize);
  }
});
</script>

<style lang="scss">
// Cancel default styles to commonize
@import "~modern-css-reset";

//noinspection CssUnknownTarget
@import "https://use.typekit.net/act7zch.css";

// font size definition
@media (min-width: 48em) {
  :root {
    font-size: calc(1rem + ((1vw - 0.48rem) * 0.6944));
    min-height: 0;
  }
}
@media (min-width: 120em) {
  :root {
    font-size: 1.5rem;
  }
}

body {
  min-height: $full_height;
  margin: 0;
}

// remove anchor decoration
a {
  color: inherit;
  text-decoration: none;
}

// set font weight for header elements
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 300;
  margin: 0;
  padding: 0;
}

// font settings
#app {
  font-family: proxima-nova, sans-serif;
  // font-family: proxima-nova, Avenir, Helvetica, Arial, sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: $full_height;
  padding: 0;
  margin: 0;
}

// page transition settings
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
