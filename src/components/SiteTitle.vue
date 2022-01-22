<template>
  <div class="site-title-name" ref="siteTitleRef">
    <h1>
      <router-link to="/">
        <span class="main-title">TSUYOSHI OCHIAI</span>
        <span class="sub-title">PHOTOGRAPHY</span>
      </router-link>
    </h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";

// Component definition
export default defineComponent({
  name: "SiteTitle",
  setup() {
    // reference to the root element
    const siteTitleRef = ref<HTMLElement>();

    // resize handler
    // Add/Remove title column classes according to the threshold (30rem).
    const resize = () => {
      if (siteTitleRef.value) {
        const px1rem = parseFloat(
          getComputedStyle(document.documentElement).fontSize
        );
        const thresholdWidth = 30 * px1rem;
        const clientWidth = siteTitleRef.value?.clientWidth;
        if (clientWidth <= thresholdWidth) {
          siteTitleRef.value?.classList.add("double-row");
          siteTitleRef.value?.classList.remove("single-row");
        } else {
          siteTitleRef.value?.classList.add("single-row");
          siteTitleRef.value?.classList.remove("double-row");
        }
      }
    };

    onMounted(() => {
      resize();
      window.addEventListener("resize", resize);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", resize);
    });

    return {
      siteTitleRef
    };
  }
});
</script>

<!--
 Stylesheet.
 -->
<style scoped lang="scss">
.site-title-name {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0; // 0 0.1rem
  z-index: 60;

  &.single-row {
    h1 {
      position: relative;
      display: inline-block;
      text-align: center;
      font-size: 1.6rem;
      letter-spacing: 0.1rem;

      // animation
      &::after {
        @include animated_underline(center, 2px, 0.4rem, 0.4s);
      }
      &:hover::after {
        transform: scale(1, 1);
      }

      // add blank
      .sub-title::before {
        content: " ";
      }
    }
  }
  &.double-row {
    h1 {
      position: relative;
      display: inline-flex;
      justify-content: center;
      flex-direction: column;
      margin: 0;
      padding: 0;
      letter-spacing: 0.1rem;
      z-index: 60;

      .main-title {
        position: relative;
        display: inline-block;
        margin: 0;
        padding: 0;
        font-size: 1.6rem;
        letter-spacing: 0.1rem;

        &::after {
          @include animated_underline(center, 2px, 0.4rem, 0.4s);
        }
      }
      &:hover .main-title::after {
        transform: scale(1, 1);
      }

      .sub-title {
        display: block;
        font-size: 1rem;
        letter-spacing: 0.3rem;
        margin: 0;
        padding: 0;
        transform: translateY(-20%);
      }
    }
  }
}
</style>
