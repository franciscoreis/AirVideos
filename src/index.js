

import {
  AssetType,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SessionMode,
  SRGBColorSpace,
  AssetManager,
  World,
  createSystem,
  XRPlane,
  XRMesh,
    SceneUnderstandingSystem
} from '@iwsdk/core';

import {
  AudioSource,
  DistanceGrabbable,
  MovementMode,
  Interactable,
  PanelUI,
  PlaybackMode,
  ScreenSpace
} from '@iwsdk/core';

import {
  PhysicsSystem,
} from '@iwsdk/core'

// Import locomotion specific tools
import {
 LocomotionSystem,
  SlideSystem,
  TurnSystem,
} from '@iwsdk/core';


import { EnvironmentType, LocomotionEnvironment } from '@iwsdk/core';

import { LoadingManager
      ,TextureLoader
      ,Matrix4
      ,BoxGeometry
      ,MeshStandardMaterial
      ,LineBasicMaterial
      ,BufferGeometry
      ,Vector3
      ,Group
      ,Line
      ,TorusGeometry
      ,Scene
      ,HemisphereLight
      ,RingGeometry
      ,CanvasTexture
      //declared above ,MeshBasicMaterial
      //declared above , Mesh
} from '@iwsdk/core';




import { PanelSystem } from './panel.js';

import { Robot } from './robot.js';

import { RobotSystem } from './robot.js';


const THREE = {
  LoadingManager: LoadingManager
  ,TextureLoader: TextureLoader
  ,Matrix4: Matrix4
  ,BoxGeometry: BoxGeometry
  ,MeshStandardMaterial: MeshStandardMaterial
  ,LineBasicMaterial: LineBasicMaterial
  ,BufferGeometry: BufferGeometry
  ,Vector3: Vector3
  ,Group: Group
  ,Line: Line
  ,TorusGeometry: TorusGeometry
  ,Scene: Scene
  ,HemisphereLight: HemisphereLight
  ,RingGeometry: RingGeometry
  ,MeshBasicMaterial: MeshBasicMaterial
  ,Mesh: Mesh
  ,CanvasTexture: CanvasTexture
}
window.THREE = THREE

var mapEntityIDtoEntity = new Map()
window.mapEntityIDtoEntity = mapEntityIDtoEntity

const mapCodeToObjectin3D = new Map()

//----------------------------------------
window.myAddObjectToScene = function(scene, obj)
{
  scene.add(obj)
}
//---------------------------------------------
window.addVideosNotYetAdded = async function()
{
  const container = document.getElementById('scene-container');

  let x = -3
  let y = 0
  let z = 0.0

  for(let [code, video] of VideosCut.videosSelected)
  if(!mapCodeToObjectin3D.get(code))
  {
    const headerHeight = 20

    const img = $(".img_airvideos_code_" + code)[0]

  const width = img.naturalWidth
  const height = img.naturalHeight

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height + headerHeight

  const ctx = canvas.getContext('2d')

  ctx.drawImage(img, 0, headerHeight, width, height)

  // background
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, headerHeight);

  // some text
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(video.title, 10, headerHeight / 2);

  // 2. Turn the canvas into a Three.js texture
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true

  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: 2,
  });

    // 1. Create a Three.js texture from the loaded image
   /*
    const texture = new THREE.Texture(img);
    texture.needsUpdate = true;
    texture.colorSpace = SRGBColorSpace;
    */

    // 3. Make a plane with the same aspect ratio as the image
    const aspect = canvas.width / canvas.height;
    const planeHeight = 1.0;              // 1 meter tall
    const planeWidth = planeHeight * aspect;   // keep aspect ratio

    const geometry = new PlaneGeometry(planeWidth, planeHeight);
    const mesh = new Mesh(geometry, material);

    // 4. Position it in front of the user
    mesh.position.set(x + 0, y + 1.5, z + -1.5) // x, y, z in meters
    mesh.scale.setScalar(1)

    x += 1.5
    y += 0.0
    z += 0

    // 5. Turn it into a world entity so it appears in WebXR
    const entity = world.createTransformEntity(mesh)
      .addComponent(Interactable)
      .addComponent(DistanceGrabbable, {
    translate: true,
    rotate: true,
    scale: true,
      movementMode: MovementMode.MoveFromTarget,
    snapToHand: true, // If false, it stays at a distance (like a levitating object)
    distanceLimits: { min: 0, max: 30 } // Can grab from 10 meters away
    })
    .addComponent(LocomotionEnvironment, {
      type: EnvironmentType.STATIC, // walkable static geometry
    })

    mapCodeToObjectin3D.set(code, mesh)
    video.objectIn3D = undefined

  }

}
//---------------------------------------
window.initialize_planeDetection = async function()
{
/*
const { XRControllerModelFactory } = await import ('https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/webxr/XRControllerModelFactory.min.js')
const {hitTest, filterHitTestResults} = await import ('https://storage.googleapis.com/umniverse_static2/hit-test.js')

const {FileProxyCache} = await import ('https://cdn.jsdelivr.net/gh/jasonmayes/web-ai-model-proxy-cache@main/FileProxyCache.min.js')

const {GLTFLoader} = await import ("https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/loaders/GLTFLoader.js")
const {FBXLoader} = await import ('https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/loaders/FBXLoader.js')
const {SVGLoader} = await import ('https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/loaders/SVGLoader.js')

window.XRControllerModelFactory = XRControllerModelFactory;
window.hitTest = hitTest;
window.filterHitTestResults = filterHitTestResults;
window.GLTFLoader = GLTFLoader;
window.FBXLoader = FBXLoader;
window.SVGLoader = SVGLoader;
window.FileProxyCache = FileProxyCache;

this.world.renderer.domElement = $("#scene-container")[0]

      window.webXRgameAndCameraAndSceneThreeJS = {
       camera: xrSession.camera
       ,gameRenderer: this.world.renderer
       }

      myPlaneDetection.onSessionStarted(xrSession)
    }

 */

}
//-------------------------------------------------
class PlaneDebugSystem extends createSystem({ planes: {required: [XRPlane] }}, {})
{

  init() {
    this.queries.planes.subscribe('qualify', (entity) => {
      const id = entity.id || entity.object3D?.uuid
      console.log('Plane detected:', id, entity.object3D?.position);
      entity.detectedNOTremoved = true
      mapEntityIDtoEntity.set(id, entity)
    });

     this.queries.planes.subscribe('disqualify', (entity) => {
      const id = entity.id || entity.object3D?.uuid
      console.log('Plane removed:', id);
      entity.detectedNOTremoved = false
      mapEntityIDtoEntity.delete(id)

    });

  }

}
//----------------------------------------
class HitDebugSystem extends createSystem({ planes: {required: [XRPlane] }}, {})
{

  init() {
    this.queries.planes.subscribe('qualify', (entity) => {
      const planeMesh = entity.object3D;

      planeMesh.onPointerMove = (event) => {
        // event.point = world-space hit position from RayPointer
        reticle.visible = true;
        reticle.position.copy(event.point);
      };

      planeMesh.onPointerLeave = () => {
        reticle.visible = false;
      };
    });

     this.queries.planes.subscribe('disqualify', (entity) => {
      console.log('Plane removed:', entity.id);
    });

  }

}
//----------------------------------------
class XRSessionLifecycleSystem extends createSystem({}, {})
{
  static lastState = 'non-immersive';

  init() {
    this.lastState = this.world.visibilityState.value
  }

  update() {
    const state = this.world.visibilityState.value
    if (state === this.lastState) return;

    const xrSession = this.world.session

    // XR session just started
    if (this.lastState === 'non-immersive' && state === 'visible') {
      console.log('[IWSDK] XR session started');



      if (!myPlaneDetection)
      {
        myPlaneDetection = true // new PlaneDetection()
        addVideosNotYetAdded()
        //initialize_planeDetection()
      }


      // 👉 your “on XR start” logic here
      // e.g. show XR-only UI, play intro sound, etc.
    }

    // XR session just ended
    if (this.lastState === 'visible' && state === 'non-immersive') {
      console.log('[IWSDK] XR session ended');
      myPlaneDetection = false
      // 👉 your “on XR end” logic here
    }

    this.lastState = state;
  }
}


const assets = {
  chimeSound: {
    url: '/audio/chime.mp3',
    type: AssetType.Audio,
    priority: 'background'
  },
  webxr: {
    url: '/textures/webxr.png',
    type: AssetType.Texture,
    priority: 'critical'
  },

  plantSansevieria: {
    url: '/gltf/plantSansevieria/plantSansevieria.gltf',
    type: AssetType.GLTF,
    priority: 'critical'
  },
  robot: {
    url: '/gltf/robot/robot.gltf',
    type: AssetType.GLTF,
    priority: 'critical'
  }
};

World.create(document.getElementById('scene-container'), {
  assets,
  xr: {
    sessionMode: SessionMode.ImmersiveAR,
    offer: 'always',
    // Optional structured features; layers/local-floor are offered by default
    features: { handTracking: true, anchors: { required: true }, hitTest: { required: true }, planeDetection: { required: true }, meshDetection: true, layers: { required: false } }
  },
  features: { locomotion: false, grabbing: true, physics: true, sceneUnderstanding: true, enableGrabbing: true },




}).then((world) => {

  window.world = world
  const { camera } = world;


  camera.position.set(0, 1, 0.5);


  if(true)
  {
  const { scene: plantMesh } = AssetManager.getGLTF('plantSansevieria');
  
  plantMesh.position.set(1.2, 0.2, -1.8);
  plantMesh.scale.setScalar(2);
  
  
  window.plantEntity = world
    .createTransformEntity(plantMesh)
    .addComponent(Interactable)
      //allows to grab and move the plant
    .addComponent(DistanceGrabbable, {
      movementMode: MovementMode.MoveFromTarget
    })
     /* moves the plant

    .addComponent(LocomotionEnvironment, {
      type: EnvironmentType.STATIC, // walkable static geometry
    })
  */
  }



  const { scene: robotMesh } = AssetManager.getGLTF('robot');
  // defaults for AR
  robotMesh.position.set(-1.2, 0.4, -1.8);
  robotMesh.scale.setScalar(1);
  
  world
    .createTransformEntity(robotMesh)
    .addComponent(Interactable)
    .addComponent(Robot)
    .addComponent(AudioSource, {
      src: '/audio/chime.mp3',
      maxInstances: 3,
      playbackMode: PlaybackMode.FadeRestart
    })
      //allows to grab and move the plant
    .addComponent(DistanceGrabbable, {
      movementMode: MovementMode.MoveFromTarget
    })


  /*
  const panelEntity = world
    .createTransformEntity()
    .addComponent(PanelUI, {
      config: '/ui/welcome.json',
      maxHeight: 0.8,
      maxWidth: 1.6
    })
    .addComponent(Interactable)
    .addComponent(ScreenSpace, {
      bottom: '20px',
      left: 'calc(50% - 390px)',
      height: '40%'
    });
  panelEntity.object3D.position.set(0, 1.29, -1.9);
  */

  const webxrLogoTexture = AssetManager.getTexture('webxr');
  webxrLogoTexture.colorSpace = SRGBColorSpace;
  const logoBanner = new Mesh(
    new PlaneGeometry(3.39, 0.96),
    new MeshBasicMaterial({
      map: webxrLogoTexture,
      transparent: true
    }),
  );

  world.createTransformEntity(logoBanner)
    .addComponent(Interactable)
    .addComponent(DistanceGrabbable, {
      movementMode: MovementMode.MoveFromTarget
    })
  logoBanner.position.set(0, 1, 1.8);
  logoBanner.rotateY(Math.PI);


  world.registerSystem(XRSessionLifecycleSystem)



world
    /*.registerSystem(SceneUnderstandingSystem, {
      configData: {
        showWireFrame: false, // <– THIS draws all detected planes/meshes as wireframes
      },
    }) */
    .registerComponent(XRPlane)
    .registerComponent(XRMesh)
    .registerComponent(XRAnchor)
    .registerSystem(PlaneDebugSystem)
    .registerSystem(HitDebugSystem)
    //.registerSystem(PanelSystem)
    //.registerSystem(RobotSystem);

/*
  const locomotionSystem = world.registerSystem(LocomotionSystem, {
  configData: {
    slidingSpeed: 5,   // default slide speed
    turningMethod: 1,  // 1 = snap turn
    turningAngle: 45,  // degrees per snap
    rayGravity: -0.4,
    useWorker: true,   // run physics in a worker
  },
});
   world.registerSystem(SlideSystem, {
  configData: {
    locomotor: locomotionSystem.locomotor, // 🔗 tie into the same locomotor
    maxSpeed: 5,        // m/s, continuous movement speed
    comfortAssist: 0.5, // vignette strength (0 = off, 0.4–0.6 common)
    jumpButton: 'a',    // input id for jump (A button by default)
  },
});
*/

  // 1. Create the visual Mesh (Geometry + Material)
if(isInLocalhost)
{
    const floorMesh = new Mesh(
    new PlaneGeometry(20, 20),
    new MeshBasicMaterial({ color: 0x333333 })
  );
  floorMesh.rotation.x = -Math.PI / 2; // Rotate flat

  // 2. Create the Entity in the world and CAPTURE IT in a variable
  const floorEntity = world.createTransformEntity(floorMesh);

  // 3. Add the Locomotion component to the ENTITY, not the mesh
  floorEntity.addComponent(LocomotionEnvironment, { isStatic: true });
}


});

