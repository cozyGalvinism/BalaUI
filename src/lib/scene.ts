import { WebGLRenderer, ShaderMaterial, Color, Scene, Camera, PlaneGeometry, Vector4, Vector2, Mesh } from 'three';

const fragmentShader = `
precision mediump float;
uniform float time;
uniform float spin_time;
uniform float contrast;
uniform float spin_amount;
uniform vec2 resolution;

#define PIXEL_SIZE_FAC 700.0
#define SPIN_EASE 0.8
#define colour_1 vec4(1.0,0.3725490196,0.3333333333,1.0)
#define colour_2 vec4(0.0,0.6156862745,1.0,1.0)
#define colour_3 vec4(0.2156862745,0.2588235294,0.2666666667,1.0)

void main() {
    float pixel_size = length(resolution.xy) / PIXEL_SIZE_FAC;
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
`
const scene = new Scene();
const camera = new Camera();

const geometry = new PlaneGeometry(2, 2);

const material = new ShaderMaterial({
    uniforms: {
        time: { value: 0.0 },
        spin_time: { value: 5.0 },
        colour_1: { value: new Vector4(1.0, 0.3725490196, 0.3333333333, 1.0) }, // C
        colour_2: { value: new Vector4(0.0, 0.6156862745, 1.0, 1.0) }, // L
        colour_3: { value: new Vector4(0.2156862745,0.2588235294,0.2666666667, 1.0) }, // D
        contrast: { value: 3.0 },
        spin_amount: { value: 0.3 },
        resolution: { value: new Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: fragmentShader
});
const mesh = new Mesh(geometry, material);

scene.add(mesh);

let renderer: WebGLRenderer;
const animate = () => {
    requestAnimationFrame(animate);
    material.uniforms.time.value += 1 / 120;
    material.uniforms.spin_time.value += 1 / 120;

    renderer.render(scene, camera);
};

const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.resolution.value = new Vector2(window.innerWidth, window.innerHeight);
};

export const createScene = (el: HTMLCanvasElement) => {
    renderer = new WebGLRenderer({ canvas: el });
    resize();
    animate();
};

window.addEventListener('resize', resize);
