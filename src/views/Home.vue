<template>
  <div class="home">
    <home-background />
    <div class="site-title" :class="{ 'is-show-background': isMouseMoved }">
      <div
        class="site-title-name"
        :class="[
          {
            'is-title-blink': isTitleBlink,
            'is-title-splash': isTitleSplash
          },
          pointingDevice
        ]"
        @click="enterToPortfolio"
      >
        <h1>TSUYOSHI OCHIAI</h1>
        <h2>PHOTOGRAPHY</h2>
        <div class="tap-notice">
          tap to enter
        </div>
      </div>
    </div>
    <about-link :is-mouse-enabled="isShowAbout" />
    <div class="portfolio-link">
      <router-link to="/portfolio">PORTFOLIO</router-link>
    </div>
    <div class="copyright-block">
      <div class="copyright-notice" :class="{ 'is-title-blink': isTitleBlink }">
        <h3>&copy; Tsuyoshi OCHIAI - All rights reserved.</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from "vue";
import { getPointingDevice, PointingDeviceMouse } from "@/scripts/utils";
import { useRouter } from "vue-router";
import gsap from "gsap";
import HomeBackground from "@/components/HomeBackground.vue";
import AboutLink from "@/components/AboutLink.vue";

export default defineComponent({
  name: "Home",
  components: {
    HomeBackground,
    AboutLink
  },
  setup() {
    const router = useRouter();

    // set the link to portfolio
    const enterToPortfolio = () => {
      router.push("portfolio");
    };

    // references
    const isTitleBlink = ref<boolean>(false);
    const isTitleSplash = ref<boolean>(false);
    const isMouseMoved = ref<boolean>(false);
    const isShowAbout = ref<boolean>(false);
    const pointingDevice = ref<string>(getPointingDevice());

    // Mouse move handler
    let mouseTimer = 0;
    const mouseMoveListener = () => {
      clearTimeout(mouseTimer);
      isMouseMoved.value = true;
      isTitleSplash.value = true;
      mouseTimer = setTimeout(() => {
        isMouseMoved.value = false;
        isTitleSplash.value = false;
      }, 2000);
    };

    // Roll-up the title.
    const moveTitleEntry = () => {
      if (pointingDevice.value === PointingDeviceMouse) {
        isShowAbout.value = true;
        gsap.to(".site-title", {
          top: 0,
          transform: "translateY(0)",
          duration: "4",
          ease: "linear",
          onComplete: () => {
            window.setTimeout(() => {
              isTitleSplash.value = true;
              window.setTimeout(() => {
                isTitleSplash.value = false;
                window.addEventListener("mousemove", mouseMoveListener);
              }, 1200);
            }, 400);
          }
        });
      } else {
        gsap.to(".site-title", {
          top: "30%",
          duration: "1.2",
          ease: "linear",
          onComplete: () => {
            window.setTimeout(() => {
              isTitleSplash.value = true;
              window.setTimeout(() => {
                isTitleSplash.value = false;
                gsap.set(".tap-notice", { opacity: 1 });
                window.setTimeout(() => {
                  isTitleBlink.value = true;
                  isShowAbout.value = true;
                }, 1200);
              }, 1800);
            }, 400);
          }
        });
      }
    };

    // Block over scroll on Safari
    const scrollWheelListener = (ev: WheelEvent) => {
      ev.preventDefault();
    };

    // Setup title block rollup
    onMounted(() => {
      window.setTimeout(moveTitleEntry, 3000);
      window.addEventListener("wheel", scrollWheelListener, {
        passive: false
      });
      if (getPointingDevice() !== PointingDeviceMouse) {
        gsap.set(".portfolio-link", { display: "none" });
      }
    });
    onBeforeUnmount(() => {
      window.removeEventListener("wheel", scrollWheelListener);
      window.removeEventListener("mousemove", mouseMoveListener);
    });

    // Return reactive items
    return {
      isMouseMoved,
      isShowAbout,
      isTitleBlink,
      isTitleSplash,
      pointingDevice,
      enterToPortfolio
    };
  }
});
</script>

<style scoped lang="scss">
// Top page
$home_font_color: rgba(#fff, 0.8);
$slide_background_color: rgba(#333, 0.4);
.home {
  display: block;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: $full_height;
  color: $home_font_color;
  overflow: hidden;

  // Site title - Entry for Portfolio page
  .site-title {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);

    // fade background upon mouse move
    will-change: background-color;
    background-color: transparent;
    transition: background-color 0.6s $ease_out_sine;
    &.is-show-background {
      background-color: $slide_background_color;
    }

    // site title and entry to portfolio
    .site-title-name {
      position: relative;
      display: block;
      text-align: center;
      will-change: opacity;
      mix-blend-mode: screen;
      cursor: pointer;

      // my name
      h1 {
        display: block;
        position: relative;
        margin: 0;
        padding: 0;
        letter-spacing: 0.2rem;
        font-size: 2rem;
        &::after {
          @include animated_underline(center, 2px, 0.46rem, 0.4s);
        }
      }
      &.is-title-splash h1::after {
        transform: scale(1, 1);
      }

      // Photography
      h2 {
        position: relative;
        display: block;
        margin: -0.2rem 0 0 0.8rem;
        padding: 0;
        letter-spacing: 0.8rem;
        font-size: 1rem;
      }

      // tap notice on touch device
      .tap-notice {
        display: none;
      }
      &.touch .tap-notice {
        display: block;
        margin-top: 2rem;
        font-size: 1.2rem;
        letter-spacing: 0.1rem;
        opacity: 0;
        transition: {
          property: opacity;
          timing-function: $ease_out_sine;
          duration: 0.4s;
          delay: 0.4s;
        }
      }
    }
  }

  // portfolio link
  .portfolio-link {
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0 0.2rem;
    font-size: 1.2rem;

    &::after {
      @include animated_underline(right, 2px, 0.2rem, 0.4s);
    }
    &:hover::after {
      transform: scale(1, 1);
    }
  }

  // copyright block
  .copyright-block {
    position: absolute;
    display: block;
    bottom: 0;
    width: 100%;
    margin: 0;
    padding: 0;

    .copyright-notice {
      position: relative;
      display: inline-block;
      text-align: center;
      bottom: 0;
      width: 100%;
      margin: 0;
      padding: 0;

      h3 {
        position: relative;
        display: block;
        text-align: center;
        padding: 0.1rem;
        font-size: 0.8rem;
        font-weight: 100;
      }
    }
  }
}

// blink title (option)
.is-title-blink {
  animation: {
    name: blink;
    duration: 3s;
    direction: alternate;
    timing-function: cubic-bezier(0.4, 0, 0.4, 1);
    iteration-count: infinite;
  }
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
</style>
