<template>
  <div class="close-button" @click="closeButtonClick">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from "vue";

// Component definition
export default defineComponent({
  name: "CloseButton",
  setup(props, context: SetupContext) {
    // clicked this button
    const closeButtonClick = () => {
      context.emit("close-button-click");
    };
    return {
      closeButtonClick
    };
  }
});
</script>

<!--
 Stylesheet.
 -->
<style scoped lang="scss">
.close-button {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.4rem;
  opacity: 0.2;
  transition: {
    property: opacity;
    timing-function: $ease_out_sine;
    duration: 0.3s;
  }
  &.show {
    opacity: 0.6;
  }
  &:hover {
    opacity: 1;
  }
  svg {
    width: 3rem;
    height: 3rem;
  }
}
</style>
