<template>
  <ul class="cover-list">
    <li
      v-for="cover in portfolioProjects"
      :key="cover.coverFileUrl()"
      class="cover-list-item"
      :ref="addCoverItemRef"
    >
      <div class="cover-item-frame">
        <div
          class="project-cover"
          :style="{ backgroundImage: 'url(' + cover.coverFileUrl() + ')' }"
          @click="showProject(cover)"
        >
          <div class="project-title">
            <h3>{{ cover.title }}</h3>
          </div>
          <div class="project-description">
            {{ cover.description }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  onMounted,
  onUnmounted,
  onBeforeUnmount
} from "vue";
import { useStore } from "@/store";
import portfolioProjects, { PortfolioProject } from "@/scripts/portfolio";
import gsap from "gsap";

// selected class name
const selectedClass = "selected";

// definition of component
export default defineComponent({
  name: "PortfolioProjectCovers",
  props: {},
  setup(props, context: SetupContext) {
    // definition of Vuex
    const store = useStore();

    // definition of refs
    const coverItemRef: HTMLElement[] = [];
    const addCoverItemRef = (el: HTMLElement) => {
      coverItemRef.push(el);
    };

    // change the current project.
    const changeProject = (newIndex: number, oldIndex: number) => {
      // nop upon no selection change
      if (newIndex === oldIndex) return;

      const oldItem = coverItemRef[oldIndex];
      const newItem = coverItemRef[newIndex];

      const oldToYPercent = oldIndex < newIndex ? "-100%" : "100%";
      const newFromYPercent = oldIndex < newIndex ? "100%" : "-100%";

      oldItem.classList.remove(selectedClass);
      newItem.classList.remove(selectedClass);
      gsap
        .timeline()
        .to(oldItem, {
          y: oldToYPercent,
          ease: "power2.in",
          duration: 0.6,
          onComplete: () => {
            oldItem.style.visibility = "hidden";
          }
        })
        .fromTo(
          newItem,
          {
            y: newFromYPercent,
            visibility: "visible",
            delay: 0.2
          },
          {
            y: 0,
            ease: "power2.out",
            duration: 0.6,
            onComplete: () => {
              newItem.classList.add(selectedClass);
            }
          }
        );
    };

    // send project selection event
    const showProject = (selectedProject: PortfolioProject) => {
      context.emit("show-project", selectedProject);
    };

    // gets the current selected item index.
    const selectionChangeHandler = store.watch<number>(
      vuexState => {
        return vuexState.portfolioProjectIndex;
      },
      (newIndex: number, oldIndex: number) => {
        changeProject(newIndex, oldIndex);
      }
    );

    // lifecycle event
    onMounted(() => {
      const firstCover = coverItemRef[0];
      if (firstCover) {
        window.setTimeout(() => {
          firstCover.classList.add(selectedClass);
        }, 1500);
        gsap.fromTo(
          firstCover,
          {
            opacity: 0,
            visibility: "visible"
          },
          {
            opacity: 1,
            ease: "power2.out",
            duration: 0.8,
            delay: 1
          }
        );
      }
    });
    onBeforeUnmount(() => selectionChangeHandler());
    onUnmounted(() => {
      store.commit("setPortfolioProjectIndex", 0);
    });

    return {
      portfolioProjects,
      addCoverItemRef,
      showProject
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.cover-list {
  position: relative;
  display: block;
  top: 0;
  max-width: 80%;
  width: calc((var(--vh, vh) * 100 - #{$nav_height}/ 2 - 1.2rem) * 3 / 2 * 0.8);
  height: 100%;
  margin: auto;
  padding: 0;
  color: rgba(white, 0.95);
  list-style-type: none;
  overflow: hidden;

  .cover-list-item {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    text-align: center;
    visibility: hidden;

    .cover-item-frame {
      position: relative;
      display: inline-block;
      top: calc(50% + #{$nav_height}/ 2); // for SP landscape mode
      //top: 50%;
      transform: translateY(-50%);
      width: 100%;
      max-width: calc(var(--vh, vh) * 134 - #{$nav_height});
      margin: 0;
      padding: 0;

      // keep aspect ratio as 2:3
      &::before {
        display: block;
        padding-top: 66.67%;
        content: "";
      }

      .project-cover {
        position: absolute;
        display: inline-flex;
        flex-direction: column;
        text-align: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: {
          position: center;
          size: cover;
          repeat: no-repeat;
        }
        cursor: pointer;
        box-sizing: border-box;

        .project-title {
          position: relative;
          display: inline-block;
          top: 13%;
          max-width: 100%;
          margin: 0;
          @media screen and (orientation: portrait) {
            top: 15%;
          }
          h3 {
            position: relative;
            display: inline-block;
            font-size: 2rem;
            letter-spacing: 0.14rem;
            mix-blend-mode: color-dodge;
            margin: 0;
            padding: 0 0.2rem 0 0.36rem;
            @media screen and (max-device-width: 680px) {
              font-size: 1.8rem;
            }

            &::after {
              position: absolute;
              bottom: 0.36rem;
              left: 0;
              content: "";
              width: 100%;
              height: 2px;
              background-color: currentColor;
              transform: scale(0, 1);
              transform-origin: center top;
              transition: transform 0.4s $ease_out_sine;
            }
          }
        }
        &:hover h3::after {
          transform: scale(1, 1);
        }

        .project-description {
          position: relative;
          display: inline-block;
          top: 40%;
          margin: 0 10%;
          padding: 0.54rem;
          transform: translateY(-50%);
          font-size: 0.9rem;
          line-height: 120%;
          letter-spacing: 0.04rem;
          mix-blend-mode: hard-light;
          background-color: rgba(black, 0.3);
          border-radius: 3px;
          opacity: 0;
          transition: {
            property: opacity;
            timing-function: $ease_out_sine;
            duration: 0.4s;
          }
        }
      }
    }
    &.selected {
      .cover-item-frame {
        .project-cover {
          .project-description {
            opacity: 1;
            animation: {
              name: project_description_up;
              duration: 0.4s;
              timing-function: $ease_out_sine;
            }
          }
          @keyframes project_description_up {
            0% {
              top: 46%;
            }
            100% {
              top: 40%;
            }
          }
        }
      }
    }
  }
}
</style>
