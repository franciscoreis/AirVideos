

import {
  AssetType,
  Mesh,
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
    OneHandGrabbable,
  Pressed,
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
      , MeshBasicMaterial

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

      ,EdgesGeometry
      ,LineSegments
      ,Shape
      ,ShapeGeometry
    ,DoubleSide
    ,Box3
    ,Float32BufferAttribute
    ,BoxHelper
    ,Box3Helper
    ,Color
    ,Euler
    ,MathUtils
} from '@iwsdk/core';




import { PanelSystem } from './panel.js';

import { Robot } from './robot.js';
import { RobotSystem } from './robot.js';

import { MyVideo } from './myVideo.js';
import { MyVideoSystem } from './myVideo.js';

const USE_ANCHORS = false


const THREE = {
  LoadingManager: LoadingManager
  ,TextureLoader: TextureLoader
  ,Matrix4: Matrix4
  ,BoxGeometry: BoxGeometry
  ,PlaneGeometry: PlaneGeometry
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
  ,EdgesGeometry: EdgesGeometry
  ,LineSegments: LineSegments
  ,Shape: Shape
  ,ShapeGeometry: ShapeGeometry
  ,Float32BufferAttribute: Float32BufferAttribute
  ,BoxHelper: BoxHelper
  ,Box3Helper: BoxHelper
  ,Color: Color
  ,Box3: Box3
  ,Euler: Euler
  ,MathUtils: MathUtils
}
window.THREE = THREE

var mapEntityIDtoMyPlane = new Map()
window.mapEntityIDtoMyPlane = mapEntityIDtoMyPlane
var mapEntityIDtoMyObject = new Map()
window.mapEntityIDtoMyObject = mapEntityIDtoMyObject

var mapWallTableIDtoPersistentInfo = new Map()
window.mapWallTableIDtoPersistentInfo = mapWallTableIDtoPersistentInfo
var loaded_mapWallTableIDtoPersistentInfo = {}

const mapCodeToEntity = new Map()

//-------------------------------
window.matchEntityHeight = function (targetEntity, referenceEntity)
{
  const refObj = referenceEntity.object3D;
  const tgtObj = targetEntity.object3D;

  // Ensure transforms are up to date
  refObj.updateWorldMatrix(true, true);
  tgtObj.updateWorldMatrix(true, true);

  // Compute world-space bounding boxes
  const refBox = new Box3().setFromObject(refObj);
  const tgtBox = new Box3().setFromObject(tgtObj);

  const refSize = new Vector3();
  const tgtSize = new Vector3();
  refBox.getSize(refSize); // width = x, height = y, depth = z
  tgtBox.getSize(tgtSize);

  // Avoid division by zero
  if (tgtSize.y === 0) return;

  // Scale factor so target’s height matches reference height
  const factor = refSize.y / tgtSize.y;

  // Apply uniform scale
  tgtObj.scale.multiplyScalar(factor);
}
//----------------------------------------
window.myAddObjectToScene = function(scene, obj)
{
  scene.add(obj)
}
//---------------------------------------------
window.addVideosNotYetAdded = async function()
{
  const container = document.getElementById('scene-container');

  const xIni = -1.5

  let x = xIni
  let y = 0.5
  let z = 0.0

  for(let [code, video] of VideosCut.videosSelected)
  if(!mapCodeToEntity.get(code))
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

  const material = new MeshStandardMaterial({
    map: texture,
    transparent: true,
    side: 2,
  });

    // 3. Make a plane with the same aspect ratio as the image
    const aspect = canvas.width / canvas.height;
    const planeHeight = 1.0;              // 1 meter tall
    const planeWidth = planeHeight * aspect;   // keep aspect ratio

    //const geometry = new PlaneGeometry(planeWidth, planeHeight);
    const geometry = new PlaneGeometry(1, -1)
    //geometry.rotateX(-Math.PI / 2) // so as to avoid difference between planes and objects

    geometry.scale(1, 1, 1);              // mirror on X in local space
    geometry.computeVertexNormals();

    const mesh = new Mesh(geometry, material);


    const entity = world.createTransformEntity(mesh)
      .addComponent(Interactable)
      .addComponent(MyVideo)
      /* changes pointer down detection to every other click
      .addComponent(DistanceGrabbable, {
        movementMode: MovementMode.MoveFromTarget,
        snapToHand: false,
        translate: false,
        })
      */

    entity.object3D.position.set(x + 0, y + 1.5, z + -1.5)
    //entity.object3D.rotation.copy(mesh.rotation);
    entity.object3D.rotateX( -Math.PI / 2 )
    entity.object3D.scale.setScalar(0.5)

    entity.myObject = new MyObjectToPlace(entity, video)

    mapCodeToEntity.set(code, entity)
    video.objectIn3D = undefined

    entity.meshWithBorder = mesh
    addBorderToMesh(mesh, undefined, entity.myObject)


    makeInteractionPriority(entity) //interact before the planes


    x += 0.55
    y += 0.0
    z += 0
    if(x > 2.5)
    {
      x = xIni
      y += -0.55
    }

  }


  if(false) //FLOOR
  {
  const geometry = new BoxGeometry(0.2, 0.2, 0.2);
  const material = new MeshStandardMaterial({ color: 0xff0000 });
  const mesh = new Mesh(geometry, material);

  // Position it somewhere reachable
  mesh.position.set(0, 1.5, -1);

  // 2. Create an IWSDK Entity from the mesh
  // This wraps the mesh in the ECS system so you can add components
  const entity = world.createTransformEntity(mesh);

  // 3. Add Interaction Components

  // 'Interactable' makes the system aware this object can be hovered/pointed at
  entity.addComponent(Interactable);

  // 'OneHandGrabbable' enables direct hand/controller grabbing
  entity.addComponent(OneHandGrabbable, {
    // Optional configuration
    snapToHand: false, // If true, object snaps to hand position on grab
  });

  // (Optional) 'DistanceGrabbable' enables ray-based remote pulling
  entity.addComponent(DistanceGrabbable, {
    translate: true, // Allow moving
    rotate: true,    // Allow rotating
    scale: true      // Allow scaling (often requires two hands)
  });
}

  MyPlane.importVideosFromLoadedPlanesToCurrentPlanes()

  MyPlane.loadPlanesPersistentInfo()

}
//------------------------------------------------
window.create3DPlaneMesh = function(vertices) {
  // 1. Setup Data Arrays
  const positions = [];
  const indices = [];

  // 2. Extract 3D Coordinates (X, Y, Z)
  // We assume the polygon is a loop.
  vertices.forEach((v) => {
    positions.push(v.x, v.y, v.z);
  });

  // 3. Triangulate the Polygon
  // WebXR planes are usually simple/convex. We can use a "Fan" method.
  // We connect point 0 to all other adjacent pairs (1-2, 2-3, 3-4...)
  for (let i = 1; i < vertices.length - 1; i++) {
    indices.push(0, i, i + 1);
  }

  // 4. Create the Geometry
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);

  // 5. Compute Normals (Required for lighting/shadows)
  geometry.computeVertexNormals();

  return new Mesh(geometry, new MeshStandardMaterial({
    color: 0x00ff00,
    side: DoubleSide,
    transparent: true,
    opacity: 0.3
  }));
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
class MyObject
{
  constructor(entity, mesh)
  {
    this.id = entity.id || entity.object3D?.uuid

    entity.needsUpdate = true

    this.entity = entity
    entity.myObject = this
    this.mesh = mesh
    this.object3D = entity.object3D

    entity.selected = false

    this.persistEntity()

    this.addPointableEvents({
          onSelect: () => {
            console.log("Selected! (Unity WhenSelect equivalent)");
            mesh.material.color.setHex(0x00ff00);
          },
          onRelease: () => {
            console.log("Released! (Unity WhenUnselect equivalent)");
            mesh.material.color.setHex(0xff0000);
          },
          onHover: () => console.log("Hovering...")
        })

  }
//-----------------------------------------------------------
clicked()
{
const entity = this.entity
entity.selected = !entity.selected
addBorderToMesh(entity.meshWithBorder, entity.selected ? 0xff0000 : 0xffff00, entity.myObject)
}
//-----------------------------------------------------------
select(selectedNOTselected)
{
const entity = this.entity
entity.selected = selectedNOTselected
addBorderToMesh(entity.meshWithBorder, entity.selected ? 0xff0000 : 0xffff00, entity.myObject)
}
//-----------------------------------------------------------
  async persistEntity() {

    if(!USE_ANCHORS)
      return //not based on anchors but on Planes sizes

    const entity = this.entity
  // 1. Get the raw WebXR Anchor from the ECS component
  if (!entity.hasComponent(XRAnchor)) {
    console.error("Entity is not an anchor!");
    return;
  }

  const xrAnchor = entity.getComponent(XRAnchor).anchor;

  // 2. Check if the browser supports persistence
  if (!xrAnchor.requestPersistentHandle) {
    console.warn("Persistence not supported by this browser/device.");
    return;
  }

  try {
    // 3. Request the UUID (This might trigger a permission prompt on Quest)
    const uuid = await xrAnchor.requestPersistentHandle()

    // 4. Save this UUID to LocalStorage (or your database)
    // In a real app, you might save: { uuid: uuid, type: 'chair', color: 'red' }
    const savedAnchors = JSON.parse(localStorage.getItem('my-anchors') || '[]')
    savedAnchors.push(uuid)
    localStorage.setItem('my-anchors', JSON.stringify(savedAnchors))

    console.log(`Anchor saved! UUID: ${uuid}`)

  } catch (err) {
    console.error("Failed to persist anchor:", err);
  }
}
//-----------------------------------------------------------
addBorderToMesh(color = 0xffff00)
{
  const targetMesh = this.mesh
  // Create geometry based ONLY on the edges (ignore the faces)
  const edgesGeometry = new THREE.EdgesGeometry(targetMesh.geometry);

  // Create the material for the line (Yellow, for example)
  const lineMaterial = new LineBasicMaterial({ color: color });

  // Create the line object
  const border = new THREE.LineSegments(edgesGeometry, lineMaterial);

  // OPTIONAL: Scale it up slightly (1.01) to prevent "z-fighting" (flickering)
  // against the object itself
  border.scale.setScalar(1.01);

  // 3. Add the border as a CHILD of the mesh
  // This ensures the border moves, rotates, and scales with the mesh
  if(this.border)
    targetMesh.remove(this.border)
  this.border = border;
  targetMesh.add(border);

  return border; // Return it so you can remove it later
}
  //----------------------------------------
addPointableEvents(events = {}) {
  // Ensure the entity has the base component

  const entity = this.entity
  if (!entity.hasComponent(Interactable)) {
    entity.addComponent(Interactable);
  }

  // Get the component to update configuration
  // Note: In some SDK versions you might need to re-add or update via specific methods
  // This assumes we are setting it up fresh or the SDK supports dynamic listener updates
  entity.addComponent(Interactable, {
    listeners: {
      // Maps to "WhenSelect"
      'select-start': () => {
        console.log('select-start');
        if (events.onSelect) events.onSelect();
      },
      // Maps to "WhenUnselect"
      'select-end': () => {
        console.log('select-end');
        if (events.onRelease) events.onRelease();
      },
      // Maps to "WhenHover"
      'hover-start': () => {
                console.log('hover-start');

        if (events.onHover) events.onHover();
      },
      // Maps to "WhenUnhover"
      'hover-end': () => {
        console.log('hover-end');
        if (events.onUnhover) events.onUnhover();
      }
    }
  });
}


} //class MyObject
//-------------------------------------------------
class MyObjectToPlace extends MyObject
{
  static firstEntityToBeSelected

  constructor(entity, video)
  {
    super(entity)
    this.video = video
    entity.placed = false
    window.mapEntityIDtoMyObject.set(this.id, entity)
  }
//-----------------------------------------------------------
clicked()
{
const entity = this.entity

let entitiesSelected= getObjectsSelected(this.video.groupName, this.video.subGroupName, undefined, true)
let entitiesNotSelected = getObjectsSelected(this.video.groupName, this.video.subGroupName, undefined, false)

if(entitiesSelected.size === 0)
   MyObjectToPlace.firstEntityToBeSelected = undefined

if(!entity.selected)
{
  this.select(true)
  if(!MyObjectToPlace.firstEntityToBeSelected)
    MyObjectToPlace.firstEntityToBeSelected = entity
}
else if(MyObjectToPlace.firstEntityToBeSelected && MyObjectToPlace.firstEntityToBeSelected !== entity)
  this.select(false)
else if(entitiesNotSelected.size < 1)
      entitiesCommand(entitiesSelected, "SELECT", false)
else if (entitiesSelected.size == 1)
   entitiesCommand(entitiesNotSelected, "SELECT", true)
else
   this.select(false)

addBorderToMesh(entity.meshWithBorder, entity.selected ? 0xff0000 : 0xffff00, entity.myObject)
}

}//class MyObjectToPlace
//-------------------------------------------------
export class MyPlane extends MyObject
{

  constructor(entity)
  {
    super(entity)

    if(mapEntityIDtoMyPlane.get(this.id))
      return

    this.entity = entity
    this.plane = entity.getValue(XRPlane, '_plane')
    this.mapIDtoObjects = new Map()


    mapEntityIDtoMyPlane.set(this.id, entity)


  }
//-----------------------------------------------------------
clicked()
{
const entity = this.entity

let entitiesSelected = getPlanesSelected(undefined, true)

if(!entity.selected)
{
  entitiesCommand(entitiesSelected, "SELECT", false)
  this.select(true)

  let objects = getObjectsSelected(undefined, undefined, undefined, true, undefined) //selected
  if (objects.size === 0)
    objects = objects = getObjectsSelected(undefined, undefined, undefined, undefined, false) //not placed
  if (objects.size > 0) //import
  {
    joinEntitiesToPlane(this, objects)
    entitiesCommand(objects, "SELECT", true) //if not select become selected
  }
}
else if(entitiesSelected.size) //deselect if any is selected
   entitiesCommand(this.entitiesInPlane(true), "SELECT", false)
else //rearrange
{

}
}
//-------------------------------------------------------------
entitiesInPlane(selected)
{
const entities = new Set()
let lastPos = 0
while(lastPos < this.persistentInfo.videoCodes.length)
    {
      let pos = this.persistentInfo.videoCodes.indexOf(' ', lastPos + 1)
      const code = this.persistentInfo.videoCodes.slice(lastPos + 1, pos)
      lastPos = pos + 1
      let obj = mapCodeToEntity.get(code)
      if(obj)
        if(selected === undefined || selected === obj.selected)
          entities.add(obj)
    }

return entities
}
//-------------------------------------------------------------
static storePlanesPersistentInfo()
{
    localStorage.setItem('my-planes', JSON.stringify(Array.from(mapWallTableIDtoPersistentInfo.entries())))
}
//-------------------------------------------------------------
static loadPlanesPersistentInfo(mapWallTableIDtoPersistentInfo)
{
    if(mapWallTableIDtoPersistentInfo)
       loaded_mapWallTableIDtoPersistentInfo = mapWallTableIDtoPersistentInfo
    else
    {
      loaded_mapWallTableIDtoPersistentInfo = mapWallTableIDtoPersistentInfo || localStorage.getItem('my-planes')
      loaded_mapWallTableIDtoPersistentInfo = new Map(JSON.parse(loaded_mapWallTableIDtoPersistentInfo))
    }
    window.loaded_mapWallTableIDtoPersistentInfo = loaded_mapWallTableIDtoPersistentInfo

    MyPlane.importVideosFromLoadedPlanesToCurrentPlanes()
}
// -----------------------------------------------------------
static importVideosFromLoadedPlanesToCurrentPlanes()
{
  if(!window.loaded_mapWallTableIDtoPersistentInfo)
    return

  for(let [planeID, persistentInfo] of window.loaded_mapWallTableIDtoPersistentInfo)
    {
      let entities = new Set()
      for(let [id, entity] of mapEntityIDtoMyObject)
         if(!entity.placed && persistentInfo.videoCodes.indexOf(" " + entity.myObject.video.code + " ") !== -1)
           entities.add(entity)

      if(entities.size)
      {

      let bestPlaneEntity
      let areaDifference = Infinity
      for(let [id, entity] of mapEntityIDtoMyPlane)
         if( !entity.myObject.mapIDtoObjects.size  //empty
             && entity.myObject.label === persistentInfo.label) //wall to wall, table to table
         {
           const aDif = Math.abs(persistentInfo.area - entity.myObject.WHminMax.myArea)
           if(aDif < areaDifference)
           {
             bestPlaneEntity = entity
             areaDifference = aDif
           }
         }
      if(bestPlaneEntity)
        joinEntitiesToPlane(bestPlaneEntity.myObject, entities)

      }
    }



if(mapEntityIDtoMyObject.size && !getObjectsSelected(undefined, undefined, undefined, undefined, false).size)
  showOrHideWallsTables(false) //all objects placed

}
// -----------------------------------------------------------
rearrangeObjects()
{

  const numObjects = this.mapIDtoObjects.size



  const corners = getPlaneWorldCorners(this.entity.object3D);
// .distanceTo returns the Euclidean distance in World Units
  const topEdgeLength = corners.tl.distanceTo(corners.tr);
  const bottomEdgeLength = corners.bl.distanceTo(corners.br);

  // Optional: Side lengths for completeness
  const leftEdgeLength = corners.tl.distanceTo(corners.bl);
  const rightEdgeLength = corners.tr.distanceTo(corners.br);

 let areaMinMin_max = 0
  let nMax_max
  let nMin_max
  let sideMinMin_max

  const maxSide = topEdgeLength
  const minSide = leftEdgeLength

  let freeSpaceX = 0
  let freeSpaceY = 0

  for(let nMax = 1; nMax <= numObjects; nMax++)
  {
    const nMin = Math.ceil(numObjects / nMax)
    const sideMax = maxSide /  nMax
    const sideMin = minSide /  nMin
    const sideMinMin = Math.min(sideMax, sideMin)
    const areaMinMin = sideMinMin * sideMinMin
    if(areaMinMin > areaMinMin_max)
    {
      areaMinMin_max = areaMinMin
      nMax_max = nMax
      nMin_max = nMin
      sideMinMin_max = sideMinMin
      freeSpaceX = topEdgeLength - nMax * sideMinMin
      freeSpaceY = leftEdgeLength - nMin * sideMinMin
    }
  }

    const scale = sideMinMin_max * 0.9




   let nMax = 0
   let nMin = 0

   let num = 0

   for(let [id, entity] of this.mapIDtoObjects)
   {

     entity.object3D.scale.setScalar(scale)

     const pointXYZ = getPointFromPercentage(this.entity.object3D
          ,  (nMax + 0.5) / nMax_max * (topEdgeLength - freeSpaceX) /topEdgeLength  + freeSpaceX / topEdgeLength / 2
          , 1 - ((nMin + 0.5) / nMin_max * (leftEdgeLength - freeSpaceY) /leftEdgeLength  + freeSpaceY / leftEdgeLength / 2)
          )
     entity.object3D.position.copy(pointXYZ);

     //entity.object3D.position.copy(corners.bl);


     entity.object3D.quaternion.copy(this.entity.object3D.quaternion)
     entity.object3D.updateMatrixWorld();


       nMax++
       if(nMax == nMax_max)
       {
         nMax = 0
         nMin++
       }

     num++
   }


}
//-----------------------------------------------------------


}// class MyPlane()

//----------------------------------------------------------
class PlaneLoggerSystem extends createSystem({
  planes: { required: [XRPlane] },
}) {
  init() {
    // Called when a new plane entity appears
    this.queries.planes.subscribe('qualify', (entity) => {
      const planeObject = entity.object3D;     // THREE.Object3D of the plane


       this.plane = entity.getValue(XRPlane, '_plane')

      const WHminMax = calculateWidthHeightAreaFromPolygon(this.plane.polygon)




 //this.calculateWidthHeightAreaFromPolygon()

    console.log('Plane detected:' + this.plane.semanticLabel + " " + WHminMax.myArea.toFixed(2) + " = " + WHminMax.myWidth.toFixed(2) + " x " + WHminMax.myHeight.toFixed(2), this.id) //, entity.object3D?.position);


    if(this.plane.semanticLabel === "wall" || this.plane.semanticLabel === "table")
    {
         const planeEntity = entity
         const planeObj = entity.object3D

         const mesh = createDraggableMesh(WHminMax.myWidth, WHminMax.myHeight, undefined, true, 0);



          // 2. Turn it into an IWSDK entity that is interactable & draggable
          const draggableEntity = world
            .createTransformEntity(mesh)
            .addComponent(Interactable, {})
            .addComponent(MyVideo)
            /*
            .addComponent(DistanceGrabbable, {
              movementMode: MovementMode.MoveFromTarget,
              snapToHand: true,
              translate: true, // Allow moving
              rotate: false,
              distanceLimits: { min: 0.1, max: 10.0 },
            });
             */
               draggableEntity.meshWithBorder = mesh
               addBorderToMesh(mesh, undefined, planeObj)

          draggableEntity.object3D.visible = showingWallsAndTable

          // 3. Align it with the plane pose (center-ish)
          draggableEntity.object3D.position.copy(planeObj.position);
          draggableEntity.object3D.quaternion.copy(planeObj.quaternion);
          draggableEntity.object3D.rotateX(-Math.PI / 2)


          draggableEntity.object3D.updateMatrixWorld();

          // 4. Keep a reference so we can clean it later
          planeEntity._draggableEntity = draggableEntity;

          const myPlane = new MyPlane(draggableEntity)
          myPlane.label = this.plane.semanticLabel
          draggableEntity.myObject.WHminMax = WHminMax

          myPlane.persistentInfo = {
                                  id: myPlane.id,
                                  label: myPlane.label,
                                  area: WHminMax.myArea,
                                  centerX: WHminMax.myCenterX,
                                  centerY: WHminMax.myCenterY,
                                  centerZ: WHminMax.myCenterZ,
                                  videoCodes: "",
                               }

         mapWallTableIDtoPersistentInfo.set(myPlane.persistentInfo.id, myPlane.persistentInfo)


      }



    });

    // Called when a plane is removed/lost
    this.queries.planes.subscribe('disqualify', (entity) => {
      console.log('Plane lost:', entity.object3D?.position);

      const id = entity.id || entity.object3D?.uuid
      console.log('Plane removed:', id);
      entity.detectedNOTremoved = false
      mapEntityIDtoMyPlane.delete(id)


      // Clean up any content attached to this plane if needed
    });
  }

  update() {
    // Each frame you can iterate existing planes if you want
    this.queries.planes.entities.forEach((entity) => {
      // e.g., keep something aligned with a moving plane
    });
  }
}
//---------------------------------------------------
function createDraggableMesh(width, height, deep = 0.01, transparent = true, opacity = 0.3) {

  const geometry = new PlaneGeometry(width, height) //THREE.BoxGeometry(width, deep, height)

  const material = new THREE.MeshStandardMaterial({
    metalness: 0.2,
    roughness: 0.6,
    transparent: transparent,
    opacity: opacity,
    side: DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
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


     window.addVideosNotYetAdded()

  }

  update() {
    const state = this.world.visibilityState.value
    if (state === this.lastState) return;

    const xrSession = this.world.session

     window.addVideosNotYetAdded()


    // XR session just started
    if (this.lastState === 'non-immersive' && state === 'visible')
    {
      console.log('[IWSDK] XR session started');
      closePopover()


      // Check strictly what is enabled
      if(USE_ANCHORS)
      {
        console.log("Enabled Features:", xrSession.enabledFeatures);

        if (!xrSession.enabledFeatures.includes('anchors')) {
          console.error("CRITICAL: Browser refused to enable 'anchors'!");
          // This confirms it's a Browser/Emulator setting issue, not a code issue.
        }
      }



      if (!myPlaneDetection)
      {
        myPlaneDetection = true // new PlaneDetection()
        //addVideosNotYetAdded()
        world.update()
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
    features: { handTracking: true
              //, anchors: { required: false }
              //, persistentAnchors: { required: true }
              , hitTest: { required: true }, planeDetection: { required: true }, meshDetection: false, layers: { required: false } }
  },
  features: { locomotion: false, grabbing: true, physics: true, sceneUnderstanding: true, enableGrabbing: true
                        , interaction: {
                far: 10.0, // Sets max ray length to 10 meters
                near: 0.1
              }
           },
    // IMPORTANT: Add persistent-anchors to optionalFeatures
    // (It is rarely 'required' because the app should fallback if not supported)
    //optionalFeatures: ['persistent-anchors']

}).then((world) => {

  window.world = world
  const { camera } = world;


  camera.position.set(0, 1, 0.5);



  if(false)
  {
  const { scene: plantMesh } = AssetManager.getGLTF('plantSansevieria');
  
  plantMesh.position.set(1.2, 0.2, -1.8);
  plantMesh.scale.setScalar(2);
  
  /*
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
      right: '20px',
      height: '20%'
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
       .addComponent(MyVideo)
    .addComponent(DistanceGrabbable, {
      movementMode: MovementMode.MoveFromTarget
    })
  logoBanner.position.set(0, 1, 1.8);
  logoBanner.rotateY(Math.PI);



world
    .registerComponent(XRPlane)
    .registerComponent(XRMesh)
    .registerComponent(XRAnchor)
    .registerComponent(Interactable)
    .registerSystem(PlaneLoggerSystem)
    .registerSystem(HitDebugSystem)

    .registerSystem(PanelSystem)
    .registerSystem(RobotSystem)
    .registerSystem(MyVideoSystem)
    .registerSystem(XRSessionLifecycleSystem)





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
if(false && isInLocalhost)
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

//------------------------------
  function calculateWidthHeightAreaFromPolygon(polygon)
  {

  let WHminMax = {}

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  // Iterate through all points to find the outer limits
  for (const point of polygon) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minZ) minY = point.y;
    if (point.y > maxZ) maxY = point.y;
    if (point.z < minZ) minZ = point.z;
    if (point.z > maxZ) maxZ = point.z;
  }

    WHminMax.myWidth = maxX - minX,
    WHminMax.myDeep = maxY - minY, // In 3D this is technically "depth" (Z-axis)
    WHminMax.myHeight = maxZ - minZ, // In 3D this is technically "depth" (Z-axis)
    WHminMax.myCenterX = (minX + maxX) / 2,
    WHminMax.myCenterY = (minY + maxY) / 2,
    WHminMax.myCenterZ = (minZ + maxZ) / 2

    WHminMax.myMinX = minX
    WHminMax.myMaxX = maxX
    WHminMax.myMinY = minY
    WHminMax.myMaxY = maxY
    WHminMax.myMinZ = minZ
    WHminMax.myMaxZ = maxZ
    WHminMax.myArea = WHminMax.myWidth * WHminMax.myHeight

    return WHminMax
  }
//-----------------------------------------------------------
window.addBorderToMesh = function (targetMesh, color = 0xffff00, parent) {
  const edgesGeom = new THREE.EdgesGeometry(targetMesh.geometry);
  const edgesMat = new THREE.LineBasicMaterial({
        color: color
        ,linewidth: 1  // ignored on most platforms, but ok
      })

  if(!targetMesh)
    return

  const edges = new THREE.LineSegments(edgesGeom, edgesMat);

  // Make the outline sit slightly above the surface to avoid z-fighting
  edges.renderOrder = 1;
  edges.material.depthTest = false;

  edges.scale.setScalar(1.01);

  //ONE FULL CRAZY DAY ONLY TO DISCOVER THIS SOLUTION !?!
  //clicking on the edges was completly out of place and EVERYWHERE!!!!!
  edges.raycast = () => {};          // ignore raycasts
  edges.traverse((obj) => {
    obj.raycast = () => {};          // just in case there are children
  });
// Avoid z-fighting with the mesh
  edges.renderOrder = 1;
  edges.material.depthTest = false;


  if (parent)
  {
    if (parent.edges)
      targetMesh.remove(parent.edges)
    parent.edges = edges;
  }
  targetMesh.add(edges);

  return edges; // Return it so you
}
//-------------------------------------------------
function alignEntityToPlane(targetEntity, planeEntity, offset = 0.01)
{

  const planeObj  = planeEntity.object3D;   // detected plane visual
  const targetObj = targetEntity.object3D;  // your entity’s mesh/group

  // 1. Copy position + orientation
  targetObj.position.copy(planeObj.position);
  targetObj.quaternion.copy(planeObj.quaternion);

  // 2. Move a bit “above” the plane along its normal
  const normal = new Vector3(0, 1, 0);             // plane’s local +Y
  normal.applyQuaternion(planeObj.quaternion);     // rotate into world space

  targetObj.position.addScaledVector(normal, offset);
}
//-------------------------------------------------
function alignMeshToPlane(mesh, planeEntity, offset = 0.01)
{
  const planeObj = planeEntity.object3D; // IWSDK’s visual for the plane

  // Copy position + orientation
  mesh.position.copy(planeObj.position);
  mesh.quaternion.copy(planeObj.quaternion);

  // Move slightly “above” the plane along its normal
  const normal = new Vector3(0, 1, 0);        // plane local +Y
  normal.applyQuaternion(planeObj.quaternion); // rotate into world space
  mesh.position.addScaledVector(normal, offset);
}
//-----------------------------------------------------------
function getObjectsSelected(groupName, subGroupName, exceptThisEntity, selected, placed)
{
  let entities = new Set()
  for(let [id, entity] of mapEntityIDtoMyObject)
    if(entity !== exceptThisEntity
        && (selected === undefined || selected === entity.selected)
        && (placed === undefined || placed === entity.placed)
        && (!groupName || groupName === entity.myObject.video.groupName)
        && (!subGroupName || subGroupName === entity.myObject.video.subGroupName)
    )
      entities.add(entity)

  return entities

}
//-----------------------------------------------------------
function getObjectsFromVideosGroup(groupName, subGroupName, exceptThisEntity)
{
  let entities = new Set()
  for(let [id, entity] of mapEntityIDtoMyObject)
    if(entity !== exceptThisEntity
        && (!groupName || groupName === entity.myObject.video.groupName)
        && (!subGroupName || subGroupName === entity.myObject.video.subGroupName)
      )
      entities.add(entity)

  return entities
}
//-----------------------------------------------------------
function getPlanesSelected(exceptThisEntity, selected = true)
{
  let entities = new Set()
  for(let [id, entity] of mapEntityIDtoMyPlane)
    if(entity !== exceptThisEntity && entity.selected == selected)
      entities.add(entity)

  return entities

}
//-----------------------------------------------------------
function entitiesCommand(entities, command, param1)
{
if(entities)
  for(let entity of entities)
  switch(command)
  {
    case "SELECT": entity.myObject.select(param1);break


    default : consoleLogIfIsInLocalhost("COMMAND NOT FOUND: entitiesCommand")
  }

}
//-----------------------------------------------------------
function joinEntitiesToPlane(plane, entities)
{
  if(!entities.size)
    return

  let planesToRearrange = new Set()

  for(let entity of entities)
  if(entity.planeJoined !== plane)
  {
    entity.placed = true
    if(entity.planeJoined)
    {
        entity.planeJoined.mapIDtoObjects.delete(entity.object3D.id)
        entity.planeJoined.persistentInfo.videoCodes = entity.planeJoined.persistentInfo.videoCodes.replaceAll(" " + entity.myObject.video.code + " ", "")
        planesToRearrange.add(entity.planeJoined)
    }
    plane.mapIDtoObjects.set(entity.object3D.id, entity)
    entity.planeJoined = plane
    plane.persistentInfo.videoCodes += " " + entity.myObject.video.code + " "
  }

MyPlane.storePlanesPersistentInfo()

for(let plane2 of planesToRearrange)
  plane2.rearrangeObjects()

plane.rearrangeObjects()
}
//-------------------------------------------------------------------
function getWorldCenter(entity) {
  const obj = entity.object3D;
  if (!obj) return null;

  obj.updateWorldMatrix(true, true);

  const box = new THREE.Box3().setFromObject(obj);
  const center = new THREE.Vector3();
  box.getCenter(center);
  return center;
}
//-------------------------------------------------------------------
function getTopLeft(entity) {
  const obj = entity.object3D
  if (!obj) return null

  obj.updateWorldMatrix(true, true)

  const box = new THREE.Box3().setFromObject(obj)

  const center = new THREE.Vector3()
  return center.set(box.max.x, box.max.y, box.max.z)
}
//-------------------------------------------------------------------
function getBottomRight(entity) {
  const obj = entity.object3D
  if (!obj) return null

  obj.updateWorldMatrix(true, true)

  const box = new THREE.Box3().setFromObject(obj)
  const center = new THREE.Vector3()
  return center.set(box.min.x, -box.min.y, -box.min.z)
}
//-------------------------------------------------------------------
// Move 'movingEntity' so its center matches 'referenceEntity' center
function alignCenters(movingEntity, referenceEntity, center_topLeft_bottomRight = "center")
{
  if(!movingEntity) //like in creating Objects
  {

  }

  const movingObj = movingEntity.object3D;
  const refObj    = referenceEntity.object3D;
  if (!movingObj || !refObj) return;

  let refCenter
  let movingCenter
  // 1. Get centers in world space
  switch(center_topLeft_bottomRight)
  {
    case "center":
      refCenter    = getWorldCenter(referenceEntity);
      movingCenter = getWorldCenter(movingEntity);
      break
    case "topLeft":
      refCenter    = getTopLeft(referenceEntity);
      movingCenter = getTopLeft(movingEntity);
      break
    case "bottomRight":
      refCenter    = getBottomRight(referenceEntity);
      movingCenter = getBottomRight(movingEntity);
      break

  }
  if (!refCenter || !movingCenter) return;

  // 2. How much we need to move (in world coordinates)
  const shiftWorld = new THREE.Vector3().subVectors(refCenter, movingCenter);

  // 3. Apply that shift to the moving object's *world* position,
  //    then convert back into its parent's local space
  const parent = movingObj.parent;
  const newWorldPos = new THREE.Vector3();
  movingObj.getWorldPosition(newWorldPos);
  newWorldPos.add(shiftWorld);

  if (parent) {
    parent.updateWorldMatrix(true, true);
    parent.worldToLocal(newWorldPos);
  }

  movingObj.position.copy(newWorldPos);
  movingObj.updateMatrixWorld(true);

  return movingEntity
}
//----------------------------------------------------------------------------
/**
 * Forces an entity to always catch the raycast first,
 * effectively blocking interaction with anything behind OR in front of it.
 */
function makeInteractionPriority(entity)
{
  const object3D = entity.object3D

  // We need to find the Mesh specifically, as that's what handles raycasting
  let targetMesh = null;

  if (object3D.isMesh) {
    targetMesh = object3D
  } else {
    // If the entity is a Group, find the first mesh inside
    object3D.traverse((child) => {
      if (!targetMesh && child.isMesh) {
        targetMesh = child
      }
    });
  }

  if (!targetMesh) {
    console.warn("No mesh found to apply priority logic.");
    return;
  }

  // 1. Save the original (native) raycast method
  const originalRaycast = targetMesh.raycast.bind(targetMesh);

  // 2. Overwrite with our "Hacked" version
  targetMesh.raycast = (raycaster, intersects) => {
    const previousCount = intersects.length;

    // Run the standard math to see if we hit the object
    originalRaycast(raycaster, intersects);

    // If a new intersection was added, we hit this object
    if (intersects.length > previousCount) {
      // Get the specific hit result for this object
      const hit = intersects[intersects.length - 1];

      // CRITICAL STEP:
      // We force the distance to 0.
      // When the SDK sorts [hitA, hitB, hitC], this will now be index 0.
      hit.distance = 0;

      // Optional: If you want it to essentially be "on the camera lens"
      // hit.point = raycaster.ray.origin;
    }
  };
}
//-----------------------------------------
function quaternionToRadiansXYZ(q) {
  // q is a THREE.Quaternion (or an object with x, y, z, w)
  const euler = new THREE.Euler();
  euler.setFromQuaternion(q, 'XYZ'); // rotation order: X then Y then Z

  return {
    x: euler.x,
    y: euler.y,
    z: euler.z,
  };
}
//------------------------------------------------------------------------------------------
function getPlaneWorldCorners(planeMesh) {
  // 1. Ensure the matrix is up to date
  // If you just moved the object in this frame, this is required.
  planeMesh.updateMatrixWorld(true);

  // 2. Get dimensions from the geometry parameters
  // (Assumes standard PlaneGeometry created at center 0,0)
  const width = planeMesh.geometry.parameters.width;
  const height = planeMesh.geometry.parameters.height;

  const hw = width / 2;  // Half-Width
  const hh = height / 2; // Half-Height

  // 3. Define the 4 corners in LOCAL space
  // Standard PlaneGeometry faces Z, so Z=0
  const corners = {
    tl: new THREE.Vector3(-hw,  hh, 0), // Top-Left
    tr: new THREE.Vector3( hw,  hh, 0), // Top-Right
    bl: new THREE.Vector3(-hw, -hh, 0), // Bottom-Left
    br: new THREE.Vector3( hw, -hh, 0), // Bottom-Right
  };

  // 4. Transform them to WORLD space
  // We apply the mesh's full transformation matrix to each vector
  corners.tl.applyMatrix4(planeMesh.matrixWorld);
  corners.tr.applyMatrix4(planeMesh.matrixWorld);
  corners.bl.applyMatrix4(planeMesh.matrixWorld);
  corners.br.applyMatrix4(planeMesh.matrixWorld);

  return corners;
}
//-------------------------------------------------------
function getPointFromPercentage(planeMesh, xPct, yPct) {
  // 1. Force update matrix to ensure world coordinates are accurate
  planeMesh.updateMatrixWorld(true);

  // 2. Get dimensions
  const width = planeMesh.geometry.parameters.width;
  const height = planeMesh.geometry.parameters.height;
  const hw = width / 2;
  const hh = height / 2;

  // 3. Calculate Corners in Local Space
  // Note: We only need the 4 corners to establish the boundaries
  const tl = new THREE.Vector3(-hw,  hh, 0);
  const tr = new THREE.Vector3( hw,  hh, 0);
  const bl = new THREE.Vector3(-hw, -hh, 0);
  const br = new THREE.Vector3( hw, -hh, 0);

  // 4. Transform to World Space
  tl.applyMatrix4(planeMesh.matrixWorld);
  tr.applyMatrix4(planeMesh.matrixWorld);
  bl.applyMatrix4(planeMesh.matrixWorld);
  br.applyMatrix4(planeMesh.matrixWorld);

  // 5. Bilinear Interpolation
  // A. Find the point on the Top Edge (0% to 100% across)
  const topPoint = new THREE.Vector3().lerpVectors(tl, tr, xPct);

  // B. Find the point on the Bottom Edge (0% to 100% across)
  const bottomPoint = new THREE.Vector3().lerpVectors(bl, br, xPct);

  // C. Find the point between Top and Bottom (0% to 100% down)
  const targetPoint = new THREE.Vector3().lerpVectors(topPoint, bottomPoint, yPct);

  return targetPoint;
}

window.MyPlane = MyPlane


