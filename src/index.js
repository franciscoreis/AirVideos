

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
}
window.THREE = THREE


var mapEntityIDtoEntity = new Map()
window.mapEntityIDtoEntity = mapEntityIDtoEntity

//----------------------------------------
window.myAddObjectToScene = function(scene, obj)
{
  scene.add(obj)
}

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

      if (false && !myPlaneDetection)
      {
        myPlaneDetection = new PlaneDetection()
        initialize_planeDetection()
      }


      // 👉 your “on XR start” logic here
      // e.g. show XR-only UI, play intro sound, etc.
    }

    // XR session just ended
    if (this.lastState === 'visible' && state === 'non-immersive') {
      console.log('[IWSDK] XR session ended');
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
  features: { locomotion: false, grabbing: true, physics: false, sceneUnderstanding: true },

}).then((world) => {
  const { camera } = world;


  camera.position.set(0, 1, 0.5);


  const { scene: plantMesh } = AssetManager.getGLTF('plantSansevieria');
  
  plantMesh.position.set(1.2, 0.2, -1.8);
  plantMesh.scale.setScalar(2);
  
  
  world
    .createTransformEntity(plantMesh)
    .addComponent(Interactable)
    .addComponent(DistanceGrabbable, {
      movementMode: MovementMode.MoveFromTarget
    });

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
    });

  const panelEntity = world
    .createTransformEntity()
    /*.addComponent(PanelUI, {
      config: '/ui/welcome.json',
      maxHeight: 0.8,
      maxWidth: 1.6
    }) */
    .addComponent(Interactable)
    .addComponent(ScreenSpace, {
      top: '20px',
      left: '50px',
      height: '40%'
    });
  panelEntity.object3D.position.set(0, 1.29, -1.9);
  

  const webxrLogoTexture = AssetManager.getTexture('webxr');
  webxrLogoTexture.colorSpace = SRGBColorSpace;
  const logoBanner = new Mesh(
    new PlaneGeometry(3.39, 0.96),
    new MeshBasicMaterial({
      map: webxrLogoTexture,
      transparent: true
    }),
  );
  /*
  world.createTransformEntity(logoBanner);
  logoBanner.position.set(0, 1, 1.8);
  logoBanner.rotateY(Math.PI);
 */

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
});

