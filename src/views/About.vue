<template>
  <div class="about">
    <site-title />
    <div class="content">
      <h2>ABOUT</h2>
      <div class="content-block">
        <p>Thanks for visiting my gallery.</p>
        <p>
          I have been taking photographs since 2003 with EOS 10D, almost 20
          years ago.
        </p>
      </div>
      <div class="content-block">
        <p>
          My first visit to Tsurui village in 2005 knocked me out by the beauty
          of Japanese crane. Since then, it becomes my regular work to visit the
          village a few times a year.
        </p>
        <p>
          I believe the appeal of Japanese crane is somehow human-like behavior.
          I hope you feel this "humanity" even just a little through the photos
          exhibited.
        </p>
        <p>
          I would express my special thanks to
          <a href="https://www.instagram.com/masahiro.wada.90/"
            >Masahiro WADA</a
          >
          for taking photographs of Japanese crane and Hokkaido scenery.
        </p>
      </div>
      <div class="content-block">
        <p>
          In <em>light</em> series, I tried to express the festival of fleeting
          lights <em>in forest</em> lasting for eternal flow of time, and faint
          lights <em>on river</em> sparkling the life and its end on water.
        </p>
        <p>
          I really appreciate the great support from
          <a
            href="https://dot.asahi.com/photogallery/archives/2021052400004.html"
            >Nobuyuki TAKAHASHI</a
          >
          to photograph this series.
        </p>
      </div>

      <h3>CONTACT</h3>
      <div class="icon-block">
        <a href="https://twitter.com/occhi244">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"
            />
          </svg>
        </a>
        <a href="https://www.instagram.com/occhi244/">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"
            /></svg
        ></a>
      </div>
      <div class="content-block">
        <p>Please send DM on twitter to contact me.</p>
        <p>
          Please note no response would be returned for questions about
          photographing locations.
        </p>
      </div>

      <h3>SOURCE CODE</h3>
      <div class="content-block">
        I am also programmer. This website is developed with Vue.js, and source
        code is published on
        <a href="https://github.com/occhi244/tsuyoshi-ochiai-photography">
          GitHub - https://github.com/occhi244/tsuyoshi-ochiai-photography</a
        >.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SiteTitle from "@/components/SiteTitle.vue";

export default defineComponent({
  name: "About",
  components: { SiteTitle },
  setup() {
    //
  }
});
</script>

<style scoped lang="scss">
.about {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-content: center;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: center;

  // Override position
  .site-title-name {
    position: relative !important;
    margin-bottom: 1rem;
  }

  // Contents
  .content {
    margin: 0 10%;
    padding: 0;

    h2 {
      margin: 0.2rem 0 1rem;
      padding: 0;
    }

    h3 {
      margin: 1.2rem 0 0.6rem;
      padding: 0;
    }

    .content-block {
      text-align: left;
      margin: 0.4rem 0;
    }
    .icon-block {
      margin: 0;
      padding: 0;
      svg {
        display: inline;
        vertical-align: text-bottom;
        width: 1.4rem;
        height: 1.4rem;
        margin: 0 0.4rem;
      }
    }
  }

  a {
    position: relative;
    display: inline-block;
    font-weight: 400;
    &::after {
      position: absolute;
      bottom: 0.14em;
      left: 0;
      content: "";
      width: 100%;
      height: 2px;
      background-color: currentColor;
      will-change: opacity;
      opacity: 0;
      transition: {
        property: opacity;
        timing-function: $ease_out_sine;
        duration: 0.24s;
      }
    }
    &:hover::after {
      opacity: 1;
    }
  }
}
</style>
