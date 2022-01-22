<template>
  <ul class="project-work-list">
    <li
      v-for="index in targetProject.numberOfPhoto"
      :key="index"
      :ref="addWorkItem"
      class="project-work-item"
    >
      <photo-work
        :data-src="targetProject.photoFileUrl(index)"
        :alt="targetProject.altText(index)"
        :is-load="true"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeUpdate, onUpdated } from "vue";
import gsap from "gsap";
import PhotoWork from "@/components/PhotoWork.vue";
import { PortfolioProject } from "@/scripts/portfolio";

// Component definition
export default defineComponent({
  components: { PhotoWork },
  name: "ProjectWorkList",
  props: {
    targetProject: {
      type: Object as PropType<PortfolioProject>,
      required: true
    }
  },
  setup: function(props) {
    // current index
    let currentIndex = 1;

    // Setup array for photo frame
    let workItemRef: HTMLElement[] = [];
    const addWorkItem = (el: HTMLElement) => workItemRef.push(el);

    // get the current work
    const currentWorkItem = (): HTMLElement => workItemRef[currentIndex - 1];

    // Change the current photograph.
    const movePhoto = (direction: number): number => {
      // if no change, return
      if (direction === 0) return currentIndex;
      if (direction < 0) {
        if (currentIndex === 1) {
          return -1;
        }
      } else if (currentIndex === props.targetProject.numberOfPhoto) {
        return 1000;
      }

      // Change the photograph
      const cur = currentWorkItem();
      currentIndex += direction;
      const next = currentWorkItem();

      const shiftCurTo = direction > 0 ? "-44%" : "44%";
      const shiftNextFrom = direction > 0 ? "18%" : "-18%";
      gsap
        .timeline()
        .to(cur, {
          opacity: 0.4,
          x: shiftCurTo,
          ease: "power2.in",
          duration: 0.3
        })
        .set(cur, {
          visibility: "hidden"
        })
        .set(next, {
          opacity: 0,
          x: shiftNextFrom
        })
        .set(next, {
          visibility: "visible"
        })
        .to(next, {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          duration: 0.7
        });

      return currentIndex;
    };

    //
    // prepare to show this component
    //
    onBeforeUpdate(() => {
      if (workItemRef[0]) {
        currentWorkItem().style.visibility = "hidden";
      }
      workItemRef = [];
    });

    onUpdated(() => {
      if (workItemRef.length === 0) return;
      currentIndex = 1;
      gsap.set(currentWorkItem(), {
        opacity: 1,
        x: "0",
        visibility: "visible"
      });
    });

    return {
      movePhoto,
      addWorkItem
    };
  }
});
</script>

<!--
 Stylesheet.
 -->
<style scoped lang="scss">
.project-work-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  //height: 100%;
  height: $full_height;
  margin: 0;
  padding: 0;
  background-color: rgba(#333, 0.8);
  list-style-type: none;

  .project-work-item {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: $full_height;
    margin: 0;
    padding: calc(var(--vmin, vmin) * 8);
    box-sizing: border-box;
    visibility: hidden;
  }
}
</style>
