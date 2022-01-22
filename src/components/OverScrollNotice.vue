<template>
  <!-- first page notice -->
  <div
    v-if="state.mode === 'first'"
    class="notice first"
    :class="{ show: state.isShowNotice }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      width="18px"
      height="18px"
    >
      <path d="M24 0v24H0V0h24z" fill="none" opacity=".87" />
      <path
        d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41zM6 6h2v12H6V6z"
      />
    </svg>
    <span>first photograph</span>
  </div>

  <!-- last page notice -->
  <div
    v-if="state.mode === 'last'"
    class="notice last"
    :class="{ show: state.isShowNotice }"
  >
    <span>last photograph</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0V0z" fill="none" opacity=".87" />
      <path
        d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41zM16 6h2v12h-2V6z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import gsap from "gsap";

// State object.
interface State {
  mode: string;
  isShowNotice: boolean;
}

// Component definition
export default defineComponent({
  name: "OverScrollNotice",
  props: {
    mode: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const state = reactive<State>({
      mode: props.mode,
      isShowNotice: false
    });

    // Show notice for over click to turn pages.
    const showNotice = () => {
      if (!state.isShowNotice) {
        state.isShowNotice = true;
        window.setTimeout(() => {
          state.isShowNotice = false;
        }, 3000);

        // show notice
        const targetClass = `.notice.${state.mode}`;
        gsap.from(targetClass, {
          x: `${state.mode == "first" ? "" : "-"}4rem`,
          ease: "elastic.out(1.2,0.5)",
          duration: 1
        });
      }
    };

    const hideNotice = () => {
      if (state.isShowNotice) {
        state.isShowNotice = false;
      }
    };

    return {
      state,
      showNotice,
      hideNotice
    };
  }
});
</script>

<!--
 Stylesheet.
 -->
<style scoped lang="scss">
.notice {
  display: flex;
  position: absolute;
  justify-content: center;
  top: 60%;
  margin: 0.2rem;
  padding: 0.4rem;
  //font-size: 1rem;

  background-color: rgba(#333, 0.9);
  opacity: 0;
  transition: {
    property: opacity;
    duration: 0.4s;
    timing-function: ease-out;
  }
  &.show {
    opacity: 0.9;
  }

  border: {
    style: solid;
    color: currentColor;
    width: 2px;
    radius: 0.6rem;
  }

  span {
    margin-top: auto;
    margin-bottom: auto;
  }

  svg {
    margin: 0;
    width: 1.4rem;
    height: 1.4rem;
    fill: currentColor;
  }

  &.first {
    left: 0;
  }
  &.last {
    right: 0;
  }
}
</style>
