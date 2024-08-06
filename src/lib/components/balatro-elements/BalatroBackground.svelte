<script lang="ts">
  import {
    WebGLRenderer,
    ShaderMaterial,
    Color,
    Scene,
    Camera,
    PlaneGeometry,
    Vector4,
    Vector2,
    Mesh,
  } from "three";
  import { onMount } from "svelte";

  const fragmentShader = `
precision mediump float;
uniform float time;
uniform float spin_time;
uniform float contrast;
uniform float spin_amount;
uniform vec2 resolution;
uniform vec4 colour_1;
uniform vec4 colour_2;
uniform vec4 colour_3;
uniform bool pixelate;

#define PIXEL_SIZE_FAC 700.0
#define SPIN_EASE 0.8

void main() {
    float pixel_size = float(pixelate) * (length(resolution.xy) / PIXEL_SIZE_FAC) + (1.0 - float(pixelate)) * 1.0;
    vec2 uv = (floor(gl_FragCoord.xy * (1.0 / pixel_size)) * pixel_size) / resolution.xy - vec2(0.5, 0.5);
    float uv_len = length(uv);

    float speed = (spin_time * SPIN_EASE * 0.2) + 302.2;
    float new_pixel_angle = (atan(uv.y, uv.x)) + speed - SPIN_EASE * 20.0 * (1.0 * spin_amount * uv_len + (1.0 - 1.0 * spin_amount));
    uv = vec2(uv_len * cos(new_pixel_angle), uv_len * sin(new_pixel_angle));

    uv *= 30.0;
    speed = time * 2.0;
    vec2 uv2 = vec2(uv.x + uv.y);

    for (int i = 0; i < 5; i++) {
        uv2 += sin(max(uv.x, uv.y)) + uv;
        uv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
        uv -= 1.0 * cos(uv.x + uv.y) - 1.0 * sin(uv.x * 0.711 - uv.y);
    }

    float contrast_mod = (0.25 * contrast + 0.5 * spin_amount + 1.2);
    float paint_res = min(2.0, max(0.0, length(uv) * (0.035) * contrast_mod));
    float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
    float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
    float c3p = 1.0 - min(1.0, c1p + c2p);

    vec4 ret_col = (0.3 / contrast) * colour_1 + (1.0 - 0.3 / contrast) * (colour_1 * c1p + colour_2 * c2p + vec4(c3p * colour_3.rgb, c3p * colour_1.a));

    gl_FragColor = ret_col;
}
`;

  let canvas: HTMLCanvasElement;
  let material: ShaderMaterial;

  function colourToVec4(colour: Vector4 | string) {
    if (typeof colour === "string") {
      const c = new Color(colour);
      return new Vector4(c.r, c.g, c.b, 1.0);
    }

    return colour;
  }

  export let colour1: Vector4 | string = new Vector4(1.0, 0.3725490196, 0.3333333333, 1.0);
  export let colour2: Vector4 | string = new Vector4(0.0, 0.6156862745, 1.0, 1.0);
  export let colour3: Vector4 | string = new Vector4(0.2156862745, 0.2588235294, 0.2666666667, 1.0);
  export let contrast = 3.0;
  export let spinAmount = 0.3;
  export let pixelate = true;

  onMount(() => {
    const scene = new Scene();
    const camera = new Camera();

    const geometry = new PlaneGeometry(2, 2);

    material = new ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        spin_time: { value: 0.0 },
        colour_1: { value: colourToVec4(colour1) }, // C
        colour_2: { value: colourToVec4(colour2) }, // L
        colour_3: {
          value: colourToVec4(colour3),
        }, // D
        contrast: { value: contrast },
        spin_amount: { value: spinAmount },
        resolution: {
          value: new Vector2(window.innerWidth, window.innerHeight),
        },
        pixelate: { value: pixelate },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: fragmentShader,
    });

    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new WebGLRenderer({ canvas });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.resolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    };

    const animate = () => {
      material.uniforms.time.value += 1 / 120;
      material.uniforms.spin_time.value += 1 / 120;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    resize();
    animate();


    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  $: {
    if (material) {
      material.uniforms.pixelate.value = pixelate;
      material.uniforms.colour_1.value = colourToVec4(colour1);
      material.uniforms.colour_2.value = colourToVec4(colour2);
      material.uniforms.colour_3.value = colourToVec4(colour3);
      material.uniforms.contrast.value = contrast;
      material.uniforms.spin_amount.value = spinAmount;
    }
  }
</script>

<canvas bind:this={canvas} class="fixed top-0 left-0 w-full h-full -z-10" />
