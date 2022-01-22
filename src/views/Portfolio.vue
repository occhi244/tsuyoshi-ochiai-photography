<template>
  <div class="portfolio">
    <portfolio-background />
    <portfolio-navigation :is-navigation-enabled="isNavigationEnabled" />
    <div class="project-cover-list">
      <site-title />
      <portfolio-project-covers @show-project="showProject" />
      <div class="copyright-notice">
        <h3>&copy; Tsuyoshi OCHIAI - All rights reserved.</h3>
      </div>
    </div>
    <about-link :is-mouse-enabled="isNavigationEnabled" />
    <div class="project-gallery" :class="{ show: isShowGallery }">
      <project-gallery
        :target-project="galleryProject"
        :is-show="isShowGallery"
        @close-project-gallery="closeProject"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "@/store";
import { emptyProject, PortfolioProject } from "@/scripts/portfolio";
import PortfolioNavigation from "@/components/PortfolioNavigation.vue";
import PortfolioProjectCovers from "@/components/PortfolioProjectCovers.vue";
import PortfolioBackground from "@/components/PortfolioBackground.vue";
import ProjectGallery from "@/components/ProjectGallery.vue";
import AboutLink from "@/components/AboutLink.vue";
import SiteTitle from "@/components/SiteTitle.vue";

//
// Page component
//
export default defineComponent({
  name: "Portfolio",
  components: {
    SiteTitle,
    AboutLink,
    ProjectGallery,
    PortfolioBackground,
    PortfolioProjectCovers,
    PortfolioNavigation
  },
  setup() {
    // Get store
    const store = useStore();

    // is wheel enabled on side menu
    const galleryProject = ref<PortfolioProject>(emptyProject);
    const isShowGallery = ref<boolean>(false);
    const isNavigationEnabled = ref<boolean>(true);
    //const siteTitleRef = ref<HTMLElement>();

    // Project viewer
    const showProject = (selectedProject: PortfolioProject) => {
      galleryProject.value = selectedProject;
      isShowGallery.value = true;
      isNavigationEnabled.value = false;
    };

    const closeProject = () => {
      isShowGallery.value = false;
      isNavigationEnabled.value = true;
    };

    return {
      get mediaType() {
        return store.state.mediaType;
      },
      isNavigationEnabled,
      galleryProject,
      isShowGallery,
      showProject,
      closeProject
    };
  }
});
</script>

<style scoped lang="scss">
$title_color: rgba(#333, 0.9);
.portfolio {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: $full_height;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;

  // cover list
  .project-cover-list {
    position: relative;
    display: inline-block;
    text-align: center;
    color: $title_color;
    top: 0;
    left: 0;
    height: 100%;
    width: calc(100% - #{$portfolio_sidebar_width} - 5.1vw);
    @media (orientation: portrait) {
      width: 100%;
    }

    .copyright-notice {
      position: absolute;
      display: block;
      bottom: 0;
      width: 100%;
      margin: 0;
      padding: 0.1rem;

      h3 {
        position: relative;
        display: block;
        text-align: center;
        @media screen and (orientation: portrait) {
          margin-left: 0.1rem;
          text-align: left;
        }
        font-size: 0.8rem;
        font-weight: 100;
      }
    }
  }

  // Gallery page
  .project-gallery {
    position: fixed;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    z-index: -1;
    background-color: rgba(#333, 0.9);

    opacity: 0;
    transition: {
      property: opacity, z-index;
      duration: 400ms;
      timing-function: ease-in;
    }
    &.show {
      z-index: 300;
      opacity: 1;
    }
  }
}
</style>
