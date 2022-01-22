<template>
  <div class="photo-desc" :class="{ show: state.isShow }">
    <div class="site-title-name">{{ state.title }}</div>
    <div class="numbering">
      {{ state.currentIndex }} / {{ state.numberOfPhoto }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

// State object.
interface State {
  title: string;
  numberOfPhoto: number;
  currentIndex: number;
  isShow: boolean;
}

// Component definition
export default defineComponent({
  name: "PhotoDescription",
  setup() {
    // state object.
    const state = reactive<State>({
      title: "",
      numberOfPhoto: 0,
      currentIndex: 0,
      isShow: false
    });

    // setup project.
    const show = (title: string, numberOfPhoto: number) => {
      if (state.title !== title) {
        state.title = title;
        state.numberOfPhoto = numberOfPhoto;
        state.currentIndex = 1;
      }
      state.isShow = true;
    };

    // update the current index.
    const update = (currentIndex: number) => {
      state.currentIndex = currentIndex;
      state.isShow = true;
    };

    return {
      show,
      update,
      state
    };
  }
});
</script>

<!--
 Stylesheet.
 -->
<style scoped lang="scss">
// description
.photo-desc {
  position: absolute;
  bottom: 1%;
  left: 1%;
  padding: 0.4em 1em;
  background-color: rgba(#999, 0.8);
  //mix-blend-mode: difference;
  opacity: 0;
  transition: {
    property: opacity;
    duration: 0.8s;
    timing-function: ease-out;
  }
  &.show {
    opacity: 1;
  }
  .site-title-name {
    // font-size: 1em;
  }
  .numbering {
    font-size: 0.8em;
  }
}
</style>
