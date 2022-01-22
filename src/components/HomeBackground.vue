<template>
  <ul
    id="backgroundImages"
    v-for="currentBackground in backgroundProperties"
    :key="currentBackground.fileName"
  >
    <li
      :class="{ show: currentBackground.isShown }"
      :style="{
        backgroundImage: 'url(' + currentBackground.fileName + ')',
        backgroundPosition: currentBackground.position
      }"
    ></li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, onBeforeUnmount } from "vue";

// Background images
interface BackgroundProperties {
  readonly fileName: string; // Background image filename
  readonly position: string; // Background position properties
  isShown: boolean; // Toggle to show this background
}
const backgroundProperties = reactive<BackgroundProperties[]>([
  {
    fileName: "./image/top_1.jpg",
    position: "left 40% bottom 30%",
    isShown: false
  },
  {
    fileName: "./image/top_2.jpg",
    position: "center bottom 10%",
    isShown: false
  },
  {
    fileName: "./image/top_3.jpg",
    position: "center bottom 15%",
    isShown: false
  },
  {
    fileName: "./image/top_4.jpg",
    position: "center bottom 10%",
    isShown: false
  },
  {
    fileName: "./image/top_5.jpg",
    position: "center bottom 15%",
    isShown: false
  }
]);

// State parameter
interface StateParameters {
  updateIntervalTimer: number | undefined;
  currentIndex: number;
}

// Component definition
export default defineComponent({
  name: "HomeBackground",
  props: {
    changeInterval: {
      type: Number,
      default: 8000
    }
  },
  setup(props) {
    const state: StateParameters = {
      updateIntervalTimer: 0,
      currentIndex: 0
    };

    const slide = () => {
      const nextIndex =
        state.currentIndex >= backgroundProperties.length - 1
          ? 0
          : state.currentIndex + 1;
      backgroundProperties[state.currentIndex].isShown = false;
      backgroundProperties[nextIndex].isShown = true;
      state.currentIndex = nextIndex;
    };

    onMounted(async () => {
      window.setTimeout(() => {
        backgroundProperties[0].isShown = true;
        window.setTimeout(() => {
          state.updateIntervalTimer = window.setInterval(
            slide,
            props.changeInterval
          );
        }, 2000);
      }, 100);
    });
    onBeforeUnmount(() => {
      clearInterval(state.updateIntervalTimer);
      backgroundProperties[state.currentIndex].isShown = false;
      state.currentIndex = 0;
    });
    return {
      backgroundProperties
    };
  }
});
</script>

<style scoped lang="scss">
ul {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  z-index: -1;

  li {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    background: {
      position: center top 20%;
      size: cover;
      repeat: no-repeat;
    }
    transition: {
      property: opacity;
      duration: 1.5s;
      timing-function: ease-in-out;
    }
    ::before {
      display: block;
      padding-top: 100%;
      content: "";
    }
  }
  .show {
    opacity: 1;
  }
}
</style>
