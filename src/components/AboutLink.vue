<template>
  <!-- about block -->
  <div class="about-block" :class="pointingDevice">
    <router-link to="/about">
      <div class="about-text" :class="{ 'is-show': isMouseMoved }">
        ABOUT
      </div>
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
        />
      </svg>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { getPointingDevice } from "@/scripts/utils";

// Component definition
export default defineComponent({
  name: "AboutLink",
  props: {
    isMouseEnabled: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const pointingDevice = ref<string>(getPointingDevice());
    const isMouseMoved = ref<boolean>(false);

    let mouseTimer = 0;
    const mouseMove = () => {
      if (!props.isMouseEnabled) return;
      clearTimeout(mouseTimer);
      isMouseMoved.value = true;
      mouseTimer = setTimeout(() => {
        isMouseMoved.value = false;
      }, 2000);
    };

    onMounted(() => {
      window.addEventListener("mousemove", mouseMove);
    });
    onUnmounted(() => {
      window.removeEventListener("mousemove", mouseMove);
    });

    return {
      pointingDevice,
      isMouseMoved
    };
  }
});
</script>

<!--
 Stylesheet.
 -->
<style scoped lang="scss">
.about-block {
  position: fixed;
  top: 0.1rem;
  margin: 0;
  padding: 0;
  font-size: 1rem;
  z-index: 80;

  &.mouse {
    .about-text {
      display: block;
      margin: 0;
      padding: 0 0 0 0.3rem;
      transform: translateX(-100%);
      transition: {
        property: transform;
        duration: 0.4s;
        timing-function: $ease_out_sine;
      }
      &.is-show {
        transform: translateX(0);
      }
      &::after {
        @include animated_underline(left, 1px, 0.2rem, 0.4s);
      }
      &:hover::after {
        transform: scale(1, 1);
      }
    }
    svg {
      display: none;
    }
  }
  &.touch {
    .about-text {
      display: none;
    }
    svg {
      display: block;
      margin-left: 0.1rem;
      width: 1.8rem;
      height: 1.8rem;
    }
  }
}
</style>
