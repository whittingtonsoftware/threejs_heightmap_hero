// Initialization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x121212, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEnmcoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.HemisphereLight(0x888888, 0x080820, 1);
scene.add(light);

const ambient_light = new THREE.AmbientLight(0x888888, 1);
scene.add(ambient_light);

// Camera
camera.position.z = 5;

const WIDTH_PLANE = 100;
const HEIGHT_PLANE = 100;
const DISPLACEMENT = 300;
const T_DISPLACEMENT = "../resources/HeightMap.png";
const T_DIFFUSE = "../resources/DiffuseMap.png";
const T_BUMP = "../resources/BumpMap.png";

let _anim_start = false;

let ground_plane_mesh;
let ground_plane_material;

setTimeout(function() { _anim_start = true; }, 1500);

function initialize_texture(texture_path) {
    let texture = new THREE.TextureLoader().load(texture_path);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    return texture;
}

function createAndRenderTerrain() {
    const ground_plane = new THREE.PlaneGeometry(1000, 1000, WIDTH_PLANE, HEIGHT_PLANE);
    let displanement_map = initialize_texture(T_DISPLACEMENT);
    let diffuse_map = initialize_texture(T_DIFFUSE);
    let bump_map = initialize_texture(T_BUMP);

    ground_plane_material = new THREE.MeshStandardMaterial({
        // color: 0xFFFFFF,
        map: diffuse_map,
        displacementMap: displanement_map,
        displacementScale: 0,
        bummpMap: bump_map,
        bumpScale: 1
    });

    ground_plane_mesh = new THREE.Mesh(ground_plane, ground_plane_material);
    scene.add(ground_plane_mesh);
    ground_plane_mesh.rotation.x = -Math.PI / 3;

    ground_plane_mesh.position.z = -300;
}

createAndRenderTerrain();

function render() {
    requestAnimationFrame(render);
    ground_plane_mesh.rotation.z += 0.001;

    if (_anim_start) {
        ground_plane_material.displacementScale = ground_plane_material.displacementScale >= DISPLACEMENT ? DISPLACEMENT : ground_plane_material.displacementScale + 0.75;
    }

    renderer.render(scene, camera);
}

render();