<template>
  <!-- turn to previous page -->
  <div class="button-area" :class="state.barSide">
    <div
      v-if="state.barSide === 'left'"
      class="button prev"
      @click="movePage(-1)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        width="18px"
        height="18px"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M15.61 7.41L14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z" />
      </svg>
    </div>
    <div
      v-if="state.barSide === 'right'"
      class="button next"
      @click="movePage(1)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        width="18px"
        height="18px"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, reactive } from "vue";

interface State {
  barSide: string;
}

// Component definition
export default defineComponent({
  name: "TurnPageButton",
  props: {
    isShowAlways: Boolean,
    direction: {
      type: String,
      required: true
    }
  },
  setup(props, context: SetupContext) {
    const state = reactive<State>({
      barSide: props.direction === "prev" ? "left" : "right"
    });

    const movePage = (direction: number) => {
      // if no change, return
      if (!direction) return;
      // move page
      context.emit("move-page", direction);
    };

    return {
      movePage,
      props,
      state
    };
  }
});
</script>

<!--
 Stylesheet.
 -->
<style scoped lang="scss">
.button-area {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 7rem;
  font-size: 0;
  &.left {
    left: 0;
    text-align: left;
  }
  &.right {
    right: 0;
    text-align: right;
  }

  opacity: 0;
  transition: {
    property: opacity;
    duration: 0.3s;
    timing-function: $ease_out_sine;
  }
  &.show {
    opacity: 0.8;
  }

  &::before {
    display: inline-block;
    height: 100%;
    content: "";
    vertical-align: middle;
  }
  .button {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    margin: 0;
    padding: 0;
    width: 5rem;
    height: 5rem;
    background: rgba(#333, 0.5);
    background-blend-mode: difference;
    transition: {
      property: opacity;
      duration: 0.3s;
      timing-function: $ease_out_sine;
    }
    svg {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      fill-opacity: 0.4;
    }
    svg:hover {
      fill-opacity: 1;
    }
  }

  &.hide {
    display: none;
  }
}
</style>
