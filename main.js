let scene, camera, renderer;
let slide, monster, mixer;
let clock = new THREE.Clock();

let isGameStarted = false;
let camSpeed = 0.12;
let monsterDistance = 15;  // 怪物初始距离玩家正后方

const loader = new THREE.GLTFLoader();

// DOM 元素
const menu = document.getElementById("menu");
const bgm = document.getElementById("bgm");
const scream = document.getElementById("scream");
const jumpscare = document.getElementById("jumpscare");

init();

// 点击开始游戏
document.getElementById("startBtn").onclick = () => {
    menu.style.display = "none";
    bgm.play();
    isGameStarted = true;
};

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1, 1000
    );
    camera.position.set(0, 3, 6);

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("game"),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 红色恐怖灯光
    const lamp = new THREE.PointLight(0xff0000, 8, 50);
    lamp.position.set(0, 5, 0);
    scene.add(lamp);

    // 加载滑梯
    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load("game/slide.glb", (gltf) => {
        slide = gltf.scene;
        slide.scale.set(1.5, 1.5, 1.5);
        scene.add(slide);
    });

    // 加载怪物
    gltfLoader.load("game/monster.glb", (gltf) => {
        monster = gltf.scene;
        monster.position.set(0, 2, monsterDistance);
        monster.scale.set(2, 2, 2);
        scene.add(monster);
    });

    window.addEventListener("resize", resize);
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (isGameStarted) {
        // 摄像机前进（滑梯运动）
        camera.position.z -= camSpeed;

        // 怪物 AI：怪物朝玩家靠近
        if (monster) {
            monster.position.z -= camSpeed * 0.75;
        }

        // 怪物逼近触发 jumpscare
        if (monster && monster.position.z < camera.position.z + 1.5) {
            triggerJumpScare();
        }
    }

    renderer.render(scene, camera);
}

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function triggerJumpScare() {
    scream.play();
    jumpscare.style.opacity = 1;

    setTimeout(() => {
        jumpscare.style.opacity = 0;
        location.reload();  // 死亡后重新开始
    }, 1200);
}
