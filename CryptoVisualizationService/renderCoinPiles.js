const THREE = require('three');

const renderCoinPiles = (coinPiles) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  coinPiles.forEach((coin, index) => {
    const geometry = new THREE.BoxGeometry(coin.pileSize, coin.pileSize, coin.pileSize);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.set(index * 2, 0, 0);
  });

  camera.position.z = 5;

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();
};

module.exports = renderCoinPiles;
