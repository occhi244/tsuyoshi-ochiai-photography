<template>
  <div class="photo-frame" :class="state.aspectClass">
    <div class="frame-matt" :class="state.aspectClass">
      <img
        src="@/assets/loading.gif"
        :alt="alt"
        class="photo"
        :class="state.aspectClass"
        ref="imageRef"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";

interface State {
  hasLoaded: boolean;
  aspectClass: string;
}

// <!-- src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" -->

export default defineComponent({
  name: "PhotoWork",
  props: {
    dataSrc: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    isLoad: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    // state object.
    const state = reactive<State>({
      hasLoaded: false,
      aspectClass: "before-loading"
    });

    // ref for image.
    const imageRef = ref<HTMLImageElement>();

    // puts mat-pattern.png
    document.documentElement.style.setProperty(
      "--url-mat",
      `url("${process.env.BASE_URL}image/mat-pattern.png")`
    );
    document.documentElement.style.setProperty(
      "--url-sig",
      `url("${process.env.BASE_URL}image/signature.png")`
    );

    // upon mounted.
    onMounted(() => {
      if (!imageRef.value) return;
      const image = imageRef.value;
      image.onload = () => {
        state.aspectClass = (() => {
          if (image.naturalWidth == image.naturalHeight) return "square";
          return image.naturalWidth > image.naturalHeight
            ? "landscape"
            : "portrait";
        })();
        state.hasLoaded = true;
      };
      image.onerror = e => {
        console.log(e);
      };
      if (!state.hasLoaded && props.isLoad && props.dataSrc.length > 0) {
        image.src = props.dataSrc;
      }
    });
    watch(
      () => props.dataSrc,
      (newDataSrc, oldDataSrc) => {
        if (newDataSrc !== oldDataSrc) {
          state.hasLoaded = false;
        }
        if (!imageRef.value) return;
        imageRef.value.src = newDataSrc;
      }
    );
    return {
      state,
      imageRef
    };
  }
});
</script>

<style scoped lang="scss">
.photo-frame {
  position: relative;
  display: block;
  top: 50%;
  margin: 0 auto;
  transform: translateY(-50%);
  box-sizing: border-box;

  &.square::before {
    display: block;
    padding-top: 100%;
    content: "";
  }
  &.square {
    max-width: calc(var(--vmin, vmin) * 84);
    max-height: calc(var(--vmin, vmin) * 84);
  }
  &.landscape::before {
    display: block;
    padding-top: 66.7%;
    content: "";
  }
  &.landscape {
    max-height: 100%;
    max-width: calc(var(--vmin, vmin) * 150 * 0.84);
  }
  &.portrait::before {
    display: block;
    padding-top: 150%;
    content: "";
  }
  &.portrait {
    width: calc(var(--vh, vh) * 84 * 2 / 3);
    max-width: 100%;
  }

  .frame-matt {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    box-sizing: border-box;
    background: {
      image: var(--url-mat);
    }
    outline: 0.9vmin solid silver;
    border: {
      style: solid;
      width: 2px;
      color: rgba(gray, 0.7);
    }

    &.square {
      padding: 11%;
    }
    &.landscape {
      padding: 7.2% 10.8%;
    }
    &.portrait {
      padding: 12% 9%;
    }
    &::after {
      display: inline-block;
      position: absolute;
      content: "";
      bottom: 2%;
      right: 2%;
      width: 10%;
      height: 10%;
      background: {
        image: var(--url-sig);
        repeat: no-repeat;
        position: right bottom;
        size: contain;
      }
    }
    &.square::after {
      width: 15%;
    }
    &.portrait::after {
      bottom: 1%;
      right: 1%;
      width: 20%;
    }

    .photo {
      position: relative;
      display: inline-block;
      top: 50%;
      left: 0;
      padding: 0;
      min-width: 50%;
      min-height: 50%;
      &.square {
        width: 100%;
        height: 100%;
      }
      &.landscape {
        width: 100%;
      }
      &.portrait {
        height: 100%;
      }
      transform: translateY(-50%);
      box-sizing: border-box;
      border: {
        style: groove ridge ridge groove;
        width: 4px;
        color: #eee;
      }
    }
  }
}
</style>
