<template>
  <div class="gallery" ref="galleryRef">
    <project-work-list
      :target-project="targetProject"
      ref="projectWorkListRef"
    />
    <photo-description ref="photoDescriptionRef" />
    <turn-page-button
      :class="{ show: isShowNavigation, hide: isHideNavigation }"
      direction="prev"
      @move-page="movePhoto"
    />
    <turn-page-button
      :class="{ show: isShowNavigation, hide: isHideNavigation }"
      direction="next"
      @move-page="movePhoto"
    />
    <over-scroll-notice mode="first" ref="firstPhotoNoticeRef" />
    <over-scroll-notice mode="last" ref="lastPhotoNoticeRef" />
    <wheel-swipe-notice :is-show="isShowWheelSwipeNotice" />
    <close-button
      :class="{ show: isShowNavigation }"
      @close-button-click="closeButtonClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, SetupContext, watch } from "vue";
import { useStore } from "@/store";
import CloseButton from "@/components/CloseButton.vue";
import ProjectWorkList from "@/components/ProjectWorkList.vue";
import TurnPageButton from "@/components/TurnPageButton.vue";
import WheelSwipeNotice from "@/components/WheelSwipeNotice.vue";
import { PortfolioProject } from "@/scripts/portfolio";
import OverScrollNotice from "@/components/OverScrollNotice.vue";
import PhotoDescription from "@/components/PhotoDescription.vue";
import {
  hasMouse,
  TouchEventListener,
  WheelEventListener
} from "@/scripts/utils";

export default defineComponent({
  name: "ProjectGallery",
  props: {
    targetProject: {
      type: Object as PropType<PortfolioProject>,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    }
  },
  components: {
    PhotoDescription,
    OverScrollNotice,
    CloseButton,
    ProjectWorkList,
    TurnPageButton,
    WheelSwipeNotice
  },
  setup: function(props, context: SetupContext) {
    // Setup navigation mode
    const store = useStore();

    // setup project works reference
    const galleryRef = ref<HTMLElement>();
    const projectWorkListRef = ref<InstanceType<typeof ProjectWorkList>>();
    const photoDescriptionRef = ref<InstanceType<typeof PhotoDescription>>();
    const firstPhotoNoticeRef = ref<InstanceType<typeof OverScrollNotice>>();
    const lastPhotoNoticeRef = ref<InstanceType<typeof OverScrollNotice>>();

    // is wheel enabled on side menu
    const isShowNavigation = ref<boolean>(true);
    const isHideNavigation = ref<boolean>(false);

    // callback from photo work list.
    const movePhoto = (direction: number) => {
      if (direction === 0) return;
      const newIndex = projectWorkListRef.value?.movePhoto(direction) ?? 0;
      if (newIndex === 0) {
        return;
      } else if (newIndex < 0) {
        firstPhotoNoticeRef.value?.showNotice();
      } else if (newIndex > 999) {
        lastPhotoNoticeRef.value?.showNotice();
      } else {
        firstPhotoNoticeRef.value?.hideNotice();
        lastPhotoNoticeRef.value?.hideNotice();
        photoDescriptionRef.value?.update(newIndex);
      }
    };

    // create wheel event listener
    const wheelEventListener = new WheelEventListener(movePhoto);

    // create swipe listener
    const touchEventListener = new TouchEventListener(
      TouchEventListener.Horizontal,
      movePhoto
    );

    // Mouse move handler
    let mouseTimer = 0;
    const mouseMoveListener = () => {
      clearTimeout(mouseTimer);
      isShowNavigation.value = true;
      mouseTimer = setTimeout(() => {
        isShowNavigation.value = false;
      }, 1200);
    };
    const enableMouseMoveListener = (isEnabled: boolean) => {
      if (isEnabled) {
        window.addEventListener("mousemove", mouseMoveListener);
      } else {
        window.removeEventListener("mousemove", mouseMoveListener);
      }
    };

    // control wheel/swipe notice
    const isShowWheelSwipeNotice = ref<boolean>(false);
    let hasWheelSwipeNoticeDisplayed = false;
    const showWheelSwipeNotice = () => {
      if (!hasWheelSwipeNoticeDisplayed) {
        hasWheelSwipeNoticeDisplayed = true;
        isShowWheelSwipeNotice.value = true;
        window.setTimeout(() => {
          isShowWheelSwipeNotice.value = false;
        }, 4 * 1000);
      }
    };

    // setup photo description
    const showPhotoDescription = () => {
      photoDescriptionRef.value?.show(
        props.targetProject.title,
        props.targetProject.numberOfPhoto
      );
    };

    // clicked close button
    const closeButtonClick = () => {
      context.emit("close-project-gallery");
    };

    // handle show/hide this gallery.
    watch(
      () => props.isShow,
      isShow => {
        if (isShow) {
          showPhotoDescription();
          showWheelSwipeNotice();
          window.setTimeout(() => {
            isShowNavigation.value = false;
            if (!hasMouse()) {
              window.setTimeout(() => {
                isHideNavigation.value = true;
              }, 400);
            }
          }, 4000);
        }
        enableMouseMoveListener(isShow);
        wheelEventListener.enable(isShow);
        touchEventListener.enableFor(isShow, galleryRef.value);
      }
    );

    return {
      get mediaType() {
        return store.state.mediaType;
      },
      movePhoto,
      closeButtonClick,
      galleryRef,
      projectWorkListRef,
      photoDescriptionRef,
      firstPhotoNoticeRef,
      lastPhotoNoticeRef,
      isShowNavigation,
      isHideNavigation,
      isShowWheelSwipeNotice
    };
  }
});
</script>

<style scoped lang="scss">
.gallery {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: $full_height;
  margin: 0;
  padding: 0;
  color: rgba(#fff, 0.9);
  text-align: center;
  box-sizing: border-box;
  z-index: 300;
}
</style>
