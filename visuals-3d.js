/**
 * 3D Visualizations with Three.js
 * Geometric Cubing (a+b)^3, Extruded Squaring (a+b)^2, 3D Coordinate Space,
 * Place-Value Column Grids, and Carpentry Planks
 * Concept & Design by K.S.Chandra 2026
 */

const Visuals3D = {
  activeRenderer: null,
  activeScene: null,
  activeCamera: null,
  activeControls: null,
  animationFrameId: null,
  activeMeshes: [],
  currentData: null,
  currentType: null,
  currentStepIndex: 0,
  currentExplodeFactor: 0.25,

  // Ensure Three.js renderer and scene are initialized
  initThree(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    // If renderer already exists and is attached to this container, return existing context
    if (this.activeRenderer && this.activeRenderer.domElement && this.activeRenderer.domElement.parentElement === container) {
      this.onResize(containerId);
      return { scene: this.activeScene, camera: this.activeCamera, renderer: this.activeRenderer };
    }

    // Clean up any old instance
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    container.innerHTML = "";

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 300;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c18);
    this.activeScene = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(14, 12, 16);
    this.activeCamera = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    this.activeRenderer = renderer;

    // OrbitControls
    if (typeof THREE.OrbitControls !== "undefined") {
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;
      this.activeControls = controls;
    }

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.0);
    dirLight1.position.set(15, 25, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf43f5e, 0.6);
    dirLight2.position.set(-15, -10, -15);
    scene.add(dirLight2);

    // Cosmic Grid Floor
    const gridHelper = new THREE.GridHelper(26, 26, 0x0284c7, 0x1e293b);
    gridHelper.position.y = -3.5;
    scene.add(gridHelper);

    // Continuous Animation Loop
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      if (this.activeControls) this.activeControls.update();
      renderer.render(scene, camera);
    };
    animate();

    return { scene, camera, renderer };
  },

  // Clear existing geometric calculation meshes from scene
  clearMeshes() {
    if (!this.activeScene) return;
    this.activeMeshes.forEach(mesh => {
      this.activeScene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.activeMeshes = [];
  },

  // Master Polymorphic 3D Visualizer Dispatcher
  render3DVisual(containerId, calculationData, activeStepIndex = 0, explodeFactor = 0.25) {
    const container = document.getElementById(containerId);
    if (!container || !calculationData) return;

    this.currentData = calculationData;
    this.currentStepIndex = activeStepIndex;
    this.currentExplodeFactor = explodeFactor;

    this.initThree(containerId);
    if (!this.activeScene) return;

    this.clearMeshes();

    const type = calculationData.type;
    this.currentType = type;

    if (type === "anurupyena_cube" || type === "sunyam_samya_samuccaye") {
      this.buildCubeScene(calculationData, activeStepIndex, explodeFactor);
    } else if (type === "square_ending_5" || type === "yavadunam_square" || type === "antyayor_dasakepi" || type === "dwandwa_square") {
      this.buildSquareExtrusionScene(calculationData, activeStepIndex, explodeFactor);
    } else if (type === "straight_line_2points" || type === "sankalana_vyavakalan" || type === "paravartya_linear" || type === "anurupye_sunyamanyat") {
      this.buildCoordinateLineScene(calculationData, activeStepIndex, explodeFactor);
    } else if (type === "urdhva_tiryagbhyam" || type === "nikhilam_multiplication" || type === "anurupyena_multiplication" || type === "ekanyunena_purvena") {
      this.buildPlaceValueGridScene(calculationData, activeStepIndex, explodeFactor);
    } else if (type === "area_feet_inches") {
      this.buildCarpentryPlankScene(calculationData, activeStepIndex, explodeFactor);
    } else if (type === "nikhilam_division" || type === "paravartya_division") {
      this.buildDivisionPartitionScene(calculationData, activeStepIndex, explodeFactor);
    } else {
      this.buildCubeScene(calculationData, activeStepIndex, explodeFactor);
    }
  },

  // Helper to add edges outline to a mesh
  addEdges(mesh, color = 0xffffff) {
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, linewidth: 2 }));
    mesh.add(line);
  },

  // 1. 3D Exploded Cube for (a + b)^3
  buildCubeScene(data, activeStep = 0, explodeFactor = 0.25) {
    let aVal = 3, bVal = 2;
    if (data.a !== undefined && data.b !== undefined) {
      aVal = data.a;
      bVal = data.b;
    } else if (data.num) {
      aVal = Math.floor(data.num / 10);
      bVal = data.num % 10;
    }

    // Scale gracefully between 1.5 and 4.0
    const a = Math.max(1.5, Math.min(4.0, aVal * 0.8));
    const b = Math.max(1.0, Math.min(3.5, bVal * 0.8));
    const totalDim = a + b;
    const centerOffset = totalDim / 2;

    const blockDefs = [
      // 1 block for a^3
      { w: a, h: a, d: a, ox: 0, oy: 0, oz: 0, col: 0x0284c7, stepGroup: 0, name: "a³" },
      // 3 blocks for a^2 b
      { w: b, h: a, d: a, ox: 1, oy: 0, oz: 0, col: 0x10b981, stepGroup: 1, name: "a²b" },
      { w: a, h: b, d: a, ox: 0, oy: 1, oz: 0, col: 0x10b981, stepGroup: 1, name: "a²b" },
      { w: a, h: a, d: b, ox: 0, oy: 0, oz: 1, col: 0x10b981, stepGroup: 1, name: "a²b" },
      // 3 blocks for a b^2
      { w: b, h: b, d: a, ox: 1, oy: 1, oz: 0, col: 0xf59e0b, stepGroup: 1, name: "ab²" },
      { w: b, h: a, d: b, ox: 1, oy: 0, oz: 1, col: 0xf59e0b, stepGroup: 1, name: "ab²" },
      { w: a, h: b, d: b, ox: 0, oy: 1, oz: 1, col: 0xf59e0b, stepGroup: 1, name: "ab²" },
      // 1 block for b^3
      { w: b, h: b, d: b, ox: 1, oy: 1, oz: 1, col: 0xf43f5e, stepGroup: 2, name: "b³" }
    ];

    blockDefs.forEach(def => {
      const geo = new THREE.BoxGeometry(def.w, def.h, def.d);
      const isHighlighted = activeStep >= 3 || def.stepGroup === activeStep;

      const mat = new THREE.MeshStandardMaterial({
        color: def.col,
        roughness: 0.25,
        metalness: 0.3,
        transparent: true,
        opacity: isHighlighted ? 0.95 : 0.45,
        emissive: isHighlighted ? def.col : 0x000000,
        emissiveIntensity: isHighlighted ? 0.3 : 0.0
      });
      const mesh = new THREE.Mesh(geo, mat);
      this.addEdges(mesh, isHighlighted ? 0xffffff : 0x475569);

      // Base unexploded position
      const posX = (def.ox === 0 ? def.w / 2 : a + def.w / 2) - centerOffset;
      const posY = (def.oy === 0 ? def.h / 2 : a + def.h / 2) - centerOffset;
      const posZ = (def.oz === 0 ? def.d / 2 : a + def.d / 2) - centerOffset;

      const dirX = def.ox === 0 ? -1 : 1;
      const dirY = def.oy === 0 ? -1 : 1;
      const dirZ = def.oz === 0 ? -1 : 1;

      mesh.userData = {
        basePos: { x: posX, y: posY, z: posZ },
        dirVector: { x: dirX, y: dirY, z: dirZ },
        explodeScale: 3.5,
        stepGroup: def.stepGroup
      };

      mesh.position.set(
        posX + dirX * explodeFactor * 3.5,
        posY + dirY * explodeFactor * 3.5,
        posZ + dirZ * explodeFactor * 3.5
      );

      this.activeScene.add(mesh);
      this.activeMeshes.push(mesh);
    });
  },

  // 2. 3D Extruded Square Dissection for (a + b)^2
  buildSquareExtrusionScene(data, activeStep = 0, explodeFactor = 0.25) {
    let aVal = 4, bVal = 2;
    if (data.previous !== undefined) {
      aVal = Math.min(5, Math.max(2, data.previous * 0.6));
      bVal = 1.8;
    } else if (data.n) {
      aVal = 3.5;
      bVal = Math.max(1, Math.min(3, Math.abs(data.deficit || 2) * 0.5));
    }

    const a = aVal;
    const b = bVal;
    const depth = 1.6;
    const totalW = a + b;
    const offset = totalW / 2;

    const sections = [
      // a^2
      { w: a, h: depth, d: a, ox: 0, oz: 0, col: 0x0284c7, step: 1, name: "a²" },
      // a x b
      { w: b, h: depth, d: a, ox: 1, oz: 0, col: 0x10b981, step: 1, name: "ab" },
      // b x a
      { w: a, h: depth, d: b, ox: 0, oz: 1, col: 0xf59e0b, step: 2, name: "ab" },
      // b^2
      { w: b, h: depth, d: b, ox: 1, oz: 1, col: 0xf43f5e, step: 2, name: "b²" }
    ];

    sections.forEach(sec => {
      const geo = new THREE.BoxGeometry(sec.w, sec.h, sec.d);
      const isHigh = activeStep >= 3 || (activeStep === sec.step) || (activeStep === 0);

      const mat = new THREE.MeshStandardMaterial({
        color: sec.col,
        roughness: 0.3,
        metalness: 0.25,
        transparent: true,
        opacity: isHigh ? 0.92 : 0.4,
        emissive: isHigh ? sec.col : 0x000000,
        emissiveIntensity: isHigh ? 0.25 : 0.0
      });
      const mesh = new THREE.Mesh(geo, mat);
      this.addEdges(mesh, isHigh ? 0xffffff : 0x64748b);

      const posX = (sec.ox === 0 ? sec.w / 2 : a + sec.w / 2) - offset;
      const posY = 0;
      const posZ = (sec.oz === 0 ? sec.d / 2 : a + sec.d / 2) - offset;

      const dirX = sec.ox === 0 ? -1 : 1;
      const dirZ = sec.oz === 0 ? -1 : 1;

      mesh.userData = {
        basePos: { x: posX, y: posY, z: posZ },
        dirVector: { x: dirX, y: 0, z: dirZ },
        explodeScale: 4.0
      };

      mesh.position.set(
        posX + dirX * explodeFactor * 4.0,
        posY,
        posZ + dirZ * explodeFactor * 4.0
      );

      this.activeScene.add(mesh);
      this.activeMeshes.push(mesh);
    });
  },

  // 3. 3D Coordinate Space & Straight Line
  buildCoordinateLineScene(data, activeStep = 0, explodeFactor = 0.25) {
    let x1 = -3, y1 = 2, x2 = 4, y2 = 5;
    if (data.x1 !== undefined) {
      x1 = Number(data.x1);
      y1 = Number(data.y1);
      x2 = Number(data.x2);
      y2 = Number(data.y2);
    } else if (data.finalX !== undefined) {
      x1 = -4; y1 = -2;
      x2 = Number(data.finalX);
      y2 = Number(data.finalY);
    }

    // Sphere P1
    const geoSphere1 = new THREE.SphereGeometry(0.5, 32, 32);
    const matSphere1 = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xf43f5e, emissiveIntensity: 0.6 });
    const sphere1 = new THREE.Mesh(geoSphere1, matSphere1);
    sphere1.position.set(x1, y1, 0);
    this.activeScene.add(sphere1);
    this.activeMeshes.push(sphere1);

    // Sphere P2 (Step >= 1)
    if (activeStep >= 1) {
      const geoSphere2 = new THREE.SphereGeometry(0.5, 32, 32);
      const matSphere2 = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.6 });
      const sphere2 = new THREE.Mesh(geoSphere2, matSphere2);
      sphere2.position.set(x2, y2, 0);
      this.activeScene.add(sphere2);
      this.activeMeshes.push(sphere2);
    }

    // Cylinder Line through P1 and P2 (Step >= 2)
    if (activeStep >= 2) {
      const p1 = new THREE.Vector3(x1, y1, 0);
      const p2 = new THREE.Vector3(x2, y2, 0);
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const extendedLen = len * 1.8;

      const geoCyl = new THREE.CylinderGeometry(0.18, 0.18, extendedLen, 16);
      const matCyl = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.5,
        roughness: 0.2
      });
      const cyl = new THREE.Mesh(geoCyl, matCyl);

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      cyl.position.copy(mid);

      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      this.activeScene.add(cyl);
      this.activeMeshes.push(cyl);
    }
  },

  // 4. 3D Place-Value Matrix / Column Grid for Multiplication
  buildPlaceValueGridScene(data, activeStep = 0, explodeFactor = 0.25) {
    const p1 = data.p1 || [2, 3];
    const p2 = data.p2 || [4, 5];
    const maxLen = Math.max(p1.length, p2.length);

    const stepPairs = (data.stepCrossProducts && data.stepCrossProducts[activeStep - 1]) 
      ? data.stepCrossProducts[activeStep - 1] 
      : [];

    const spacing = 2.4;
    const startX = -((p1.length - 1) * spacing) / 2;
    const startZ = -((p2.length - 1) * spacing) / 2;

    for (let i = 0; i < p1.length; i++) {
      for (let j = 0; j < p2.length; j++) {
        const prod = p1[i] * p2[j];
        const h = Math.max(0.6, (prod / 81) * 5 + 0.6);
        const geo = new THREE.BoxGeometry(1.4, h, 1.4);

        const isPairActive = stepPairs.some(p => p.i === i && p.j === j);

        const col = isPairActive ? 0xf43f5e : (prod > 20 ? 0x0284c7 : 0x10b981);
        const mat = new THREE.MeshStandardMaterial({
          color: col,
          roughness: 0.3,
          metalness: 0.2,
          emissive: isPairActive ? col : 0x000000,
          emissiveIntensity: isPairActive ? 0.6 : 0.0
        });

        const mesh = new THREE.Mesh(geo, mat);
        this.addEdges(mesh, isPairActive ? 0xffffff : 0x475569);

        const posX = startX + i * spacing;
        const posY = h / 2 - 2;
        const posZ = startZ + j * spacing;

        const dirX = i - (p1.length - 1) / 2;
        const dirZ = j - (p2.length - 1) / 2;

        mesh.userData = {
          basePos: { x: posX, y: posY, z: posZ },
          dirVector: { x: dirX, y: 0, z: dirZ },
          explodeScale: 3.0
        };

        mesh.position.set(
          posX + dirX * explodeFactor * 3.0,
          posY + (isPairActive ? 0.8 : 0),
          posZ + dirZ * explodeFactor * 3.0
        );

        this.activeScene.add(mesh);
        this.activeMeshes.push(mesh);
      }
    }
  },

  // 5. 3D Carpentry Timber Planks for Area Decomposition
  buildCarpentryPlankScene(data, activeStep = 0, explodeFactor = 0.25) {
    const lFt = data.lFt || 12;
    const lIn = data.lIn || 6;
    const bFt = data.bFt || 8;
    const bIn = data.bIn || 4;

    const scale = 0.35;
    const w1 = lFt * scale, w2 = (lIn / 12) * scale * 4;
    const d1 = bFt * scale, d2 = (bIn / 12) * scale * 4;
    const thickness = 0.8;

    const slabs = [
      { w: w1, d: d1, ox: -1, oz: -1, col: 0x0284c7, step: 0, name: "Ft x Ft" },
      { w: w2, d: d1, ox: 1, oz: -1, col: 0xa855f7, step: 1, name: "In x Ft" },
      { w: w1, d: d2, ox: -1, oz: 1, col: 0xec4899, step: 2, name: "Ft x In" },
      { w: w2, d: d2, ox: 1, oz: 1, col: 0x10b981, step: 3, name: "In x In" }
    ];

    slabs.forEach(s => {
      const geo = new THREE.BoxGeometry(s.w, thickness, s.d);
      const isHigh = activeStep >= 4 || s.step === activeStep;

      const mat = new THREE.MeshStandardMaterial({
        color: s.col,
        roughness: 0.4,
        metalness: 0.2,
        emissive: isHigh ? s.col : 0x000000,
        emissiveIntensity: isHigh ? 0.35 : 0.0
      });
      const mesh = new THREE.Mesh(geo, mat);
      this.addEdges(mesh, isHigh ? 0xffffff : 0x475569);

      const posX = s.ox * (s.w / 2 + 0.2);
      const posY = 0;
      const posZ = s.oz * (s.d / 2 + 0.2);

      mesh.userData = {
        basePos: { x: posX, y: posY, z: posZ },
        dirVector: { x: s.ox, y: 0, z: s.oz },
        explodeScale: 4.0
      };

      mesh.position.set(
        posX + s.ox * explodeFactor * 4.0,
        posY,
        posZ + s.oz * explodeFactor * 4.0
      );

      this.activeScene.add(mesh);
      this.activeMeshes.push(mesh);
    });
  },

  // 6. 3D Division Quotient-Remainder Partition
  buildDivisionPartitionScene(data, activeStep = 0, explodeFactor = 0.25) {
    const q = Math.max(1, Math.min(8, Number(data.quotient) || 4));
    const r = Math.max(0.5, Math.min(5, Number(data.remainder) || 2));

    // Quotient Block (Sapphire Blue)
    const geoQ = new THREE.BoxGeometry(q * 1.2, 2.5, 3.5);
    const matQ = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: activeStep >= 1 ? 0.3 : 0.0
    });
    const meshQ = new THREE.Mesh(geoQ, matQ);
    this.addEdges(meshQ, 0xffffff);

    meshQ.userData = {
      basePos: { x: -(q * 1.2) / 2, y: 0, z: 0 },
      dirVector: { x: -1, y: 0, z: 0 },
      explodeScale: 3.5
    };
    meshQ.position.set(
      meshQ.userData.basePos.x - explodeFactor * 3.5,
      0,
      0
    );
    this.activeScene.add(meshQ);
    this.activeMeshes.push(meshQ);

    // Remainder Block (Ruby Rose)
    const geoR = new THREE.BoxGeometry(r * 1.2, 2.5, 3.5);
    const matR = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0xf43f5e,
      emissiveIntensity: activeStep >= 2 ? 0.4 : 0.0
    });
    const meshR = new THREE.Mesh(geoR, matR);
    this.addEdges(meshR, 0xffffff);

    meshR.userData = {
      basePos: { x: (r * 1.2) / 2, y: 0, z: 0 },
      dirVector: { x: 1, y: 0, z: 0 },
      explodeScale: 3.5
    };
    meshR.position.set(
      meshR.userData.basePos.x + explodeFactor * 3.5,
      0,
      0
    );
    this.activeScene.add(meshR);
    this.activeMeshes.push(meshR);
  },

  // Update explosion factor dynamically in real-time
  setExplosion(factor) {
    this.currentExplodeFactor = Number(factor);
    if (!this.activeMeshes || this.activeMeshes.length === 0) return;

    this.activeMeshes.forEach(mesh => {
      if (mesh.userData && mesh.userData.basePos && mesh.userData.dirVector) {
        const scale = mesh.userData.explodeScale || 3.0;
        mesh.position.x = mesh.userData.basePos.x + mesh.userData.dirVector.x * this.currentExplodeFactor * scale;
        mesh.position.y = mesh.userData.basePos.y + mesh.userData.dirVector.y * this.currentExplodeFactor * scale;
        mesh.position.z = mesh.userData.basePos.z + mesh.userData.dirVector.z * this.currentExplodeFactor * scale;
      }
    });
  },

  // Handle Resize smoothly
  onResize(containerId = "cube-3d-stage") {
    const container = document.getElementById(containerId);
    if (!container || !this.activeRenderer || !this.activeCamera) return;
    const w = container.clientWidth || 560;
    const h = container.clientHeight || 300;
    if (w > 0 && h > 0) {
      this.activeCamera.aspect = w / h;
      this.activeCamera.updateProjectionMatrix();
      this.activeRenderer.setSize(w, h);
    }
  },

  // Backward compatibility alias
  initCubeVisualizer(containerId, aVal, bVal, explodeFactor) {
    const fakeData = { type: "anurupyena_cube", a: aVal, b: bVal };
    this.render3DVisual(containerId, fakeData, 0, explodeFactor);
  }
};

if (typeof window !== "undefined") window.Visuals3D = Visuals3D;
if (typeof global !== "undefined") global.Visuals3D = Visuals3D;
if (typeof module !== "undefined" && module.exports) module.exports = Visuals3D;
