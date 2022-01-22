<template>
  <div class="side-menu">
    <ul class="menu-bar" ref="menuBarRef">
      <li
        class="group-item"
        v-for="(projects, groupTitle) in projectDictionary"
        :key="groupTitle"
      >
        <h3 class="group-title" :class="groupClassName(groupTitle)">
          {{ groupTitle }}
        </h3>
        <ul class="group-project-list">
          <li v-for="project in projects" :key="project.name">
            <div
              class="cover-list-item"
              @click="jumpProject"
              :ref="addProjectItemRef"
            >
              {{ project.title }}
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  onBeforeUpdate,
  watch
} from "vue";
import { useStore } from "@/store";
import portfolioProjects, { PortfolioProject } from "@/scripts/portfolio";
import { TouchEventListener, WheelEventListener } from "@/scripts/utils";

// selected class name
const selectedClass = "selected";

//
// move menu bar
//
const moveMenuBar = (menuBar: HTMLElement, projectItem: HTMLElement) => {
  const pageOffset = window.pageYOffset;
  const viewHeight = window.innerHeight;
  const itemHeight = projectItem.offsetHeight;
  const itemTop = projectItem.getBoundingClientRect().top;
  const menuTop = menuBar.getBoundingClientRect().top;
  const newTop = (viewHeight - itemHeight) / 2 - (itemTop - menuTop);
  const fontSize = getComputedStyle(document.documentElement).fontSize;
  const titleHeight = 0.8 * parseFloat(fontSize);
  const adjustTop =
    window.innerHeight <= window.innerWidth
      ? 0
      : (window.innerWidth * 1.1 * 0.8) / 3 - titleHeight;

  menuBar.style.top = `${pageOffset + newTop - adjustTop}px`;
};

// Project dictionary
interface ProjectDictionary {
  [title: string]: PortfolioProject[];
}

// definition of component
export default defineComponent({
  name: "PortfolioNavigation",
  props: {
    isNavigationEnabled: Boolean
  },
  setup: function(props) {
    // definition of Vuex
    const store = useStore();

    // ref to menu bar element
    const menuBarRef = ref<HTMLElement>();
    let projectItemRef: HTMLElement[] = [];
    const addProjectItemRef = (el: HTMLElement) => {
      projectItemRef.push(el);
    };

    // get group title class
    const groupClassName = (groupName: string) => {
      return groupName.startsWith("japanese") ? "jcrane" : "";
    };

    // map to dictionary
    const projectDictionary = portfolioProjects.reduce(
      (result: ProjectDictionary, current) => {
        if (!result[current.group.title]) {
          result[current.group.title] = [];
        }
        result[current.group.title].push(current);
        return result;
      },
      {}
    );

    // current selected project index
    let currentIndex = 0;

    // handle selected project change
    const changeSelectedProject = (newIndex: number, oldIndex: number) => {
      if (menuBarRef.value) {
        // remove selected class from the old selection
        projectItemRef[oldIndex].classList.remove(selectedClass);

        // move menu bar and add selected class to the new one
        const projectItem = projectItemRef[newIndex];
        moveMenuBar(menuBarRef.value, projectItem);
        projectItem.classList.add(selectedClass);

        // store the new index
        store.commit("setPortfolioProjectIndex", newIndex);

        // update the currentIndex
        currentIndex = newIndex;
      }
    };

    // for menu item selection change directly
    const jumpProject = (ev: MouseEvent) => {
      // find the index.
      const selectedIndex = projectItemRef.findIndex(i => i == ev.target);
      if (selectedIndex < 0) return;

      // immediately return when the same project is selected.
      if (currentIndex == selectedIndex) return;

      // change the selected project
      changeSelectedProject(selectedIndex, currentIndex);
    };

    // shift the selected project
    const shiftProject = (direction: number) => {
      // gets the old/new index
      const oldIndex = currentIndex;
      const newIndex = (() => {
        if (direction > 0 && currentIndex < projectItemRef.length - 1) {
          return oldIndex + 1;
        } else if (direction < 0 && currentIndex > 0) {
          return oldIndex - 1;
        }
        return oldIndex;
      })();

      // if no change (no direction), just return
      if (newIndex === oldIndex) return;

      // change selected project
      changeSelectedProject(newIndex, oldIndex);
    };

    // wheel event listener
    const wheelEventListener = new WheelEventListener(shiftProject);

    // touch event listener
    const touchEventListener = new TouchEventListener(
      TouchEventListener.Vertical,
      shiftProject
    );

    // on resized
    const resizeListener = () => {
      changeSelectedProject(currentIndex, currentIndex);
    };

    // handle wheel enabled event
    watch(
      () => props.isNavigationEnabled,
      newVal => {
        wheelEventListener.enable(newVal);
        touchEventListener.enable(newVal);
      }
    );

    // reset ref objects
    onBeforeUpdate(() => {
      projectItemRef = [];
    });

    // handler on mounted
    onMounted(() => {
      window.addEventListener("resize", resizeListener);
      wheelEventListener.enable(true);
      touchEventListener.enable(true);

      if (menuBarRef.value) {
        menuBarRef.value.style.visibility = "visible";
        changeSelectedProject(0, 0);
      }
    });

    // handler on unmounted
    onUnmounted(() => {
      //portfolioProjectIndex is updated by projectBelt
      window.removeEventListener("resize", resizeListener);
      wheelEventListener.enable(false);
      touchEventListener.enable(false);
    });

    return {
      menuBarRef,
      projectDictionary,
      addProjectItemRef,
      groupClassName,
      jumpProject
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$font_color: rgba(#333, 0.9);
$move_duration: 0.7s;
$sidebar_aspect_ratio: "2/1";
$sidebar_max_width: 780px;

.side-menu {
  position: fixed;
  top: calc(#{$nav_height}/ 2);
  right: 0;
  //width: $portfolio_sidebar_width;
  height: 100%;
  //overflow: hidden;
  z-index: 60;
  text-align: right;
  &::before,
  &::after {
    position: absolute;
    content: "";
    display: block;
    width: 4.6vw; // 50px / 2.6rem
    height: 2px;
    right: 0;
    top: 50%;
    background-color: $font_color;
    visibility: visible;
  }
  &::after {
    width: 100%;
    transform: translateX(-100%);
  }
  .menu-bar {
    list-style-type: none;
    color: $font_color;
    position: absolute;
    visibility: hidden;
    top: 10%;
    right: 5.1vw; // 70px / 3rem
    width: calc(
      #{$portfolio_sidebar_width}* 1.2
    ); // For initial rendering issue on Chrome
    margin: 0;
    padding: 0;
    transition: {
      property: top;
      duration: $move_duration;
      timing-function: ease-in-out;
    }
    .group-item {
      display: flex;
      flex-flow: column;
      &:nth-child(n + 2) {
        margin-top: 1em;
      }
      .group-title {
        display: inline-block;
        font-weight: 400;
        font-size: 1.2rem;
        margin: 0.2rem 0;
        padding: 0;
        &.jcrane:first-letter {
          color: red;
        }
      }
      .group-project-list {
        list-style-type: none;
        margin: 0;
        padding: 0;
        li {
          margin: 0;
        }
        .cover-list-item {
          position: relative;
          display: inline-block;
          margin: 0;
          padding: 0.2rem 0.1rem;
          cursor: pointer;
          transition: {
            property: color, font-weight;
            duration: 0.3s;
            timing-function: $ease_out_sine;
          }
          transition: {
            property: opacity;
            duration: $move_duration;
            timing-function: $ease_out_sine;
          }
          &.selected,
          &:hover {
            color: rgba(black, 0.95);
            font-weight: 400;
          }
          @media screen and (orientation: portrait) {
            &.selected {
              height: calc(110vw * 0.8 * 2 / 3);
              opacity: 0;
              visibility: hidden;
            }
          }
        }
      }
    }
  }
}
</style>
