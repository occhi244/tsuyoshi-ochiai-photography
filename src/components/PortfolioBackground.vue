<template>
  <div ref="canvasRef" class="portfolio-back"></div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount
} from "vue";
import { useStore } from "@/store";
import gsap from "gsap";
import * as three from "three";
import portfolioProjects from "@/scripts/portfolio";

//
// texture loader
//
const loadTextures = (images: string[]) => {
  const loader = new three.TextureLoader();
  loader.crossOrigin = "*";

  return images.map(i => {
    const texture = loader.load(i, undefined, undefined, () => {
      console.log("Error on loading background images.");
    });

    texture.minFilter = three.LinearFilter;
    texture.generateMipmaps = false;

    return texture;
  });
};

//
// displacement loader
//
const loadDisplacement = (image: string) => {
  const loader = new three.TextureLoader();
  const displacement = loader.load(image, undefined, undefined, () => {
    console.log("Displacement file loading error");
  });
  displacement.magFilter = displacement.minFilter = three.LinearFilter;
  displacement.wrapS = displacement.wrapT = three.RepeatWrapping;

  return displacement;
};

// Modified THREE.js shader codes in this component from
// https://codepen.io/ReGGae/pen/bmyYEj
//
// shader.vert
const vert = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
    `;

// shader.frag
const frag = `
    varying vec2 vUv;

    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform sampler2D disp;

    uniform float dispPower;
    uniform float intensity;

    uniform vec2 size;
    uniform vec2 res;
    uniform vec2 ires;

    vec2 backgroundCoverUv( vec2 screenSize, vec2 imageSize, vec2 uv ) {
      float screenRatio = screenSize.x / screenSize.y;
      float imageRatio = imageSize.x / imageSize.y;
      vec2 newSize = screenRatio < imageRatio
          ? vec2(imageSize.x * (screenSize.y / imageSize.y), screenSize.y)
          : vec2(screenSize.x, imageSize.y * (screenSize.x / imageSize.x));
      vec2 newOffset = (screenRatio < imageRatio
          ? vec2((newSize.x - screenSize.x) / 2.0, 0.0)
          : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;
      return uv * screenSize / newSize + newOffset;
    }

    void main() {
      vec2 ratio = vec2(
        min((res.x / res.y) / (ires.x / ires.y), 1.0),
        min((res.y / res.x) / (ires.y / ires.x), 1.0)
      );

      vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );

      vec4 disp = texture2D(disp, uv);
      vec2 dispVec = vec2(disp.x, disp.y);

      vec2 distPos1 = uv + (dispVec * intensity * dispPower);
      vec2 distPos2 = uv + (dispVec * -(intensity * (1.0 - dispPower)));

      vec4 _texture1 = texture2D(texture1, distPos1);
      vec4 _texture2 = texture2D(texture2, distPos2);

      gl_FragColor = mix(_texture1, _texture2, dispPower);
    }
    `;

//
// definition of component
//
export default defineComponent({
  name: "PortfolioBackground",
  setup: function() {
    // definition of Vuex
    const store = useStore();

    // definition of refs
    const canvasRef = ref<HTMLElement>();

    // setup three.js items
    const scene = new three.Scene();

    // setup renderer
    const renderer = new three.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // setup camera
    const camera = new three.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      1,
      1000
    );
    camera.lookAt(scene.position);
    camera.position.z = 1;

    // load textures
    const textures = loadTextures(
      portfolioProjects.map(i => i.backgroundUrl())
    );
    // load displacement texture
    const displacement = loadDisplacement(
      `${process.env.BASE_URL}image/displacement.jpg`
    );

    // setup material
    const mat = new three.ShaderMaterial({
      uniforms: {
        dispPower: { value: 0.0 },
        intensity: { value: 0.5 },
        res: {
          value: new three.Vector2(window.innerWidth, window.innerHeight)
        },
        ires: {
          value: new three.Vector2(1800, 1200)
        },
        size: { value: new three.Vector2(1, 1) },
        texture1: { value: textures[0] },
        texture2: { value: textures[1] },
        disp: { value: displacement }
      },
      transparent: true,
      vertexShader: vert,
      fragmentShader: frag
    });

    // setup geometry
    const geometry = new three.PlaneBufferGeometry(2.0, 2.0, 1);

    // setup mesh
    const mesh = new three.Mesh(geometry, mat);
    scene.add(mesh);

    // define render method
    const render = () => renderer.render(scene, camera);

    // define resize handler
    const resizeHandler = () => {
      if (canvasRef.value) {
        const canvas = canvasRef.value.querySelector("canvas");
        if (canvas) {
          const width = canvasRef.value.offsetWidth;
          const height = canvasRef.value.offsetHeight;
          canvas.width = width * window.devicePixelRatio; // for the rendering issue on Safari
          canvas.height = height * window.devicePixelRatio;
          camera.left = width / -2;
          camera.right = width / 2;
          camera.top = height / 2;
          camera.bottom = height / -2;
          camera.updateProjectionMatrix();
          mesh.material.uniforms.res.value.set(width, height);
          renderer.setSize(width, height);
          render();
        }
      }
    };

    //
    // handler for selection change
    //
    const selectionChangeHandler = store.watch<number>(
      vuexState => {
        return vuexState.portfolioProjectIndex;
      },
      (newIndex: number, oldIndex: number) => {
        // just return when no index change
        if (newIndex === oldIndex) return;

        // draw the background
        if (canvasRef.value) {
          // set texture and waving direction
          mat.uniforms.intensity.value = newIndex > oldIndex ? 0.5 : -0.5;
          mat.uniforms.texture1.value = textures[oldIndex];
          mat.uniforms.texture2.value = textures[newIndex];
          // waving
          gsap.fromTo(
            mat.uniforms.dispPower,
            { value: 0 },
            {
              value: 1,
              ease: "expo.inOut",
              duration: 1.4,
              onUpdate: () => {
                render();
              }
            }
          );
        }
      }
    );

    //
    // lifecycle events
    //
    onMounted(() => {
      if (canvasRef.value) {
        canvasRef.value.appendChild(renderer.domElement);
        window.setTimeout(() => {
          resizeHandler();
        }, 700);
      }
      window.addEventListener("resize", resizeHandler);
    });
    onBeforeUnmount(() => selectionChangeHandler());
    onUnmounted(() => {
      window.removeEventListener("resize", resizeHandler);
    });

    return {
      canvasRef
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.portfolio-back {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: $full_height;
  margin: 0;
  padding: 0;
  opacity: 0;
  animation: {
    name: fadeIn;
    timing-function: ease;
    duration: 0.3s;
    delay: 0.8s;
    fill-mode: forwards;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
