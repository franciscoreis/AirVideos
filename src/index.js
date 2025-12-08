

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
  SceneUnderstandingSystem,
  AudioUtils,
} from '@iwsdk/core';

import {
  AudioSource,
  DistanceGrabbable,
    OneHandGrabbable,
  Pressed,
  MovementMode,
  Interactable,
  PlaybackMode,
  ScreenSpace,
  PanelUI,
  PanelDocument,
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
    ,Raycaster
    ,Vector2
    ,ArrowHelper
    ,LinearFilter
    ,Quaternion
} from '@iwsdk/core';




import { PanelSystem } from './panel.js';

import { Robot } from './robot.js';
import { RobotSystem } from './robot.js';

import { MyVideo } from './myVideo.js';
import { MyVideoSystem } from './myVideo.js';

import { createDashboard
        , DashboardTag
        , DashboardButton
        } from './dashboardWithRectangles.js';



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
  ,Raycaster: Raycaster
  ,Vector2: Vector2
  ,ArrowHelper: ArrowHelper
  ,LinearFilter: LinearFilter
  ,Quaternion: Quaternion
}
window.THREE = THREE

window.mapEntityIDtoMyPlane = new Map() //all planes
window.mapEntityIDtoMyDetectedPlane = new Map() //detected (not artificial)
window.mapGroupArtificialPlanes = new Map() //artificial planes

var planeSelected
var hasPlaneDetection
globalThis.lastState_artificialPlanesShowing //0 : detected planes, >= 1 : artificial planes


window.mapEntityIDtoMyObject = new Map()

window.mapWallTableIDtoPersistentInfo = new Map()
var loaded_mapWallTableIDtoPersistentInfo = {}

var positionDashBoardNow = false
window.dashboardButtons = new Map()

const mapCodeToEntity = new Map()

const DASHBOARD_WALL = ["exit", "remove", "close"]
const DASHBOARD_ROBOT = ["exit", "artificial_walls", "close"]
const DASHBOARD_VIDEO = ["exit", "play", "close"]
const DASHBOARD_VIDEO_PLAYING = ["exit", "pause", "maximize", "close"]
var dashBoard_owner_myObject

var globalEntity

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

  for(let [code, video] of VideosCut.videosAvailable)
  if(!mapCodeToEntity.get(code))
  {
  const headerHeight = 20
  const mesh = textureWithImage($(".img_airvideos_code_" + code)[0], video.title, headerHeight)

    const entity = world.createTransformEntity(mesh)
      .addComponent(Interactable)
   //   .addComponent(Pressed) //need two clicks to activate!!!
        /*
      .addComponent(DistanceGrabbable, {
        movementMode: MovementMode.MoveFromTarget,
        snapToHand: false,
        translate: false,
        })
         */
      /*
       .addComponent(OneHandGrabbable, {
        // Makes it grabbable with one hand
        translate: true, // Can move it around
        rotate: true, // Can rotate it
      })
       */
      .addComponent(MyVideo)

    if(false)
    entity.addComponent(TabletInteractable, {
      id: 'my-green-box',
      isActive: true
    });

    entity.object3D.position.set(x + 0, y + 1.5, z + -1.5)
    //entity.object3D.rotation.copy(mesh.rotation);
    //entity.object3D.rotateX( -Math.PI / 2 )
    entity.object3D.scale.setScalar(0.30)
    entity.object3D.scale.y = -entity.object3D.scale.y
    entity.object3D.scale.z = -entity.object3D.scale.z

    entity.object3D.before_myScalarSignsForVideos = entity.object3D.scale.clone()
    entity.object3D.before_myQuaternionSignsForVideos = entity.object3D.quaternion.clone()



    entity.myObject = new MyObjectVideo(entity, mesh, video)

    mapCodeToEntity.set(code, entity)
    video.objectIn3D = undefined

    entity.meshWithBorder = mesh
    addBorderToMesh(mesh, undefined)
    entity.myObject.info = get_mapYoutubeCodesToInfo(video.code)
    if(entity.myObject.info.selected)
       entity.myObject.clicked() //to select
    entity.myObject.info.entity = entity

    makeInteractionPriority(entity, 0.1) //interact before the planes

    x += 0.55
    y += 0.0
    z += 0
    if(x > 2.5)
    {
      x = xIni
      y += -0.55
    }

  }


  if(false) //FLOOR for Debugging
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
    makeThisAndChildrenPointToEntity(mesh, entity) //important in Touch action
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
makeVisible(visible)
{
    makeObject3Dvisible(this.object3D, visible)
    if(visible)
    {
       if (!this.entity.hasComponent(Interactable))
         this.entity.addComponent(Interactable);
    }
else
    {
       if (this.entity.hasComponent(Interactable))
         this.entity.removeComponent(Interactable);
    }
}
//-----------------------------------------------------------
clicked()
{
const entity = this.entity
entity.selected = !entity.selected
addBorderToMesh(entity.meshWithBorder, entity.selected ? 0xff0000 : 0xffff00)
}
//-----------------------------------------------------------
select(selectedNOTselected, doNotCall_selectORnotYoutubeCode)
{
const entity = this.entity
const result = entity.selected !== selectedNOTselected
entity.selected = selectedNOTselected
addBorderToMesh(entity.meshWithBorder, entity.selected ? 0xff0000 : 0xffff00)
if(!doNotCall_selectORnotYoutubeCode && this.info)
    selectORnotYoutubeCode(this.info.code, selectedNOTselected, true)
return result //true if changed
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
class MyObjectVideo extends MyObject
{
  static firstEntityToBeSelected

  constructor(entity, mesh, video)
  {
    super(entity, mesh)
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
   MyObjectVideo.firstEntityToBeSelected = undefined

if(!entity.selected)
{
  this.select(true)
  if(!MyObjectVideo.firstEntityToBeSelected)
    MyObjectVideo.firstEntityToBeSelected = entity
}
else if(!showingWallsAndTable)
  {
    playThisCode(this.video.code, undefined, true)
    positionDashboardAndShow(true, DASHBOARD_VIDEO_PLAYING, this)
  }
else if(MyObjectVideo.firstEntityToBeSelected && MyObjectVideo.firstEntityToBeSelected !== entity)
  this.select(false)
else if(entitiesNotSelected.size < 1)
      entitiesCommand(entitiesSelected, "SELECT", false)
else if (entitiesSelected.size == 1)
   entitiesCommand(entitiesNotSelected, "SELECT", true)
else
   this.select(false)

addBorderToMesh(entity.meshWithBorder, entity.selected ? 0xff0000 : 0xffff00)
}

}//class MyObjectVideo
//-------------------------------------------------
export class MyPlane extends MyObject
{

  constructor(entity, mesh)
  {
    super(entity, mesh)

    if(mapEntityIDtoMyPlane.get(this.id))
      return

    this.plane = entity.getValue(XRPlane, '_plane')
    this.mapIDtoObjects = new Map()

    mapEntityIDtoMyPlane.set(this.id, entity)

  }
//-----------------------------------------------------------
clicked()
{
const entity = this.entity
const planesSelected = getPlanesSelected(entity, true) //all selected
let entitiesSelected = getObjectsSelected(undefined, undefined, undefined, true, undefined, this) //selected outside this plane

if(entitiesSelected.size)
{
    entitiesCommand(planesSelected, "SELECT", false)
    this.select(true)
    positionDashboardAndShow()
    joinEntitiesToPlane(this, entitiesSelected, true)//placed by user
    return
}




if(!entity.selected)
{
  planeSelected = this
  entitiesCommand(planesSelected, "SELECT", false)
  this.select(true)

  positionDashboardAndShow()


    //FIRST PLACES ALL THAT ARE NOT PLACED (do not want videos free in the space disturbing the user's view)
  let objects = getObjectsSelected(undefined, undefined, undefined, undefined, false) //not placed
  const thereAreUnplacedObjects = objects.size > 0
  if (!thereAreUnplacedObjects)
    objects = getObjectsSelected(undefined, undefined, undefined, true, undefined) //selected
  if (objects.size > 0) //import
  {
    joinEntitiesToPlane(this, objects, true)//placed by user
    if(!thereAreUnplacedObjects)
      entitiesCommand(objects, "SELECT", true) //if not select become selected
  }
}
else //already selected
{
    let atLeastOne = false
    for(let [id, entityObject] of this.mapIDtoObjects)
       if(entityObject.myObject.select(false))
           atLeastOne = true
    if(!dashboardRoot.object3D.visible)
        positionDashboardAndShow(true, undefined, this)
    else if(!atLeastOne)
    {
     //change limitation or orientation
        entity.myObject.rearrangeObjects()
    }
}
}
//-------------------------------------------------------------
removeFromScene()
{
      const entity = this.entity
      const id = this.id
      consoleLogIfIsInLocalhost('Plane removed: ' + id);
      entity.detectedNOTremoved = false
      mapEntityIDtoMyPlane.delete(id)

      removeEntityFromScene(entity)

      mapWallTableIDtoPersistentInfo.delete(id)

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

     const pointXYZ = getPointFromPercentage(this.entity.object3D
          ,  (nMax + 0.5) / nMax_max * (topEdgeLength - freeSpaceX) /topEdgeLength  + freeSpaceX / topEdgeLength / 2
          , 1 - ((nMin + 0.5) / nMin_max * (leftEdgeLength - freeSpaceY) /leftEdgeLength  + freeSpaceY / leftEdgeLength / 2)
          )
     entity.object3D.position.copy(pointXYZ);
     //entity.object3D.position.copy(corners.bl);

     entity.object3D.scale.setScalar(scale)



       if(this.myScalarSignsForVideos) //useful to reorientate videos to face users (no upside down or reading from right)!
       {
       entity.object3D.scale.x *= this.myScalarSignsForVideos.x
       entity.object3D.scale.y *= this.myScalarSignsForVideos.y
       entity.object3D.scale.z *= this.myScalarSignsForVideos.z
      }

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
//-------------------------------------------------
export class MyRobot extends MyObject {
     constructor(entity, mesh) {
        super(entity, mesh)
    }
//-----------------------------------
    clicked()
    {
      showOrHideWallsTables()
      positionDashboardAndShow(showingWallsAndTable, DASHBOARD_ROBOT, this)
      AudioUtils.play(this.entity)
    }

} //class MyRobot
//-------------------------------------------------
export class MyButton extends MyObject {

    constructor(entity, mesh) {
        super(entity, mesh)
    }
//-----------------------------------
    clicked()
    {
            consoleLogIfIsInLocalhost("MyButton CLICKED")


       switch (this.id)
       {
        case "exit":
          positionDashboardAndShow(false)
          endWebXR()
          break
        case "remove":
          planeSelected.removeFromScene()
          planeSelected = undefined
          positionDashboardAndShow(false)
          break
        case "artificial_walls":
            artificialPlanesShowing(globalThis.lastState_artificialPlanesShowing + 1)
            break
        case "play":
              playThisCode(dashBoard_owner_myObject.video.code)
              positionDashboardAndShow(true, DASHBOARD_VIDEO_PLAYING, dashBoard_owner_myObject)
              break
        case "pause":
              pauseVideoPlayer()
              positionDashboardAndShow(true, DASHBOARD_VIDEO, dashBoard_owner_myObject)
              break
        case "maximize":
              positionDashboardAndShow(false)
              endWebXR()
              maximizeMinimizeVideoPlayer(true)
              break
        case "close":
          positionDashboardAndShow(false)
          break
      }


    }


} //class MyButton
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


    if(true || this.plane.semanticLabel === "wall" || this.plane.semanticLabel === "table")
      if(this.plane.semanticLabel !== "floor") //dangerous for user no longer see where he is walking!
      {
         const myPlane = addMyPlane(entity.object3D, WHminMax, this.plane.semanticLabel)
         mapEntityIDtoMyDetectedPlane.set(myPlane.myObject.id, myPlane)
         if(mapEntityIDtoMyDetectedPlane.size === 1) //first
             artificialPlanesShowing(0, true) //hides artifical planes
      }

    });

    // Called when a plane is removed/lost
    this.queries.planes.subscribe('disqualify', (entity) => {

      for(let [id, entityLoop] of mapEntityIDtoMyPlane)
        if(entity.object3D.uuid === entityLoop.original_object3D.uuid)
          {
              const myDetectedPlaneEntity = entityLoop
              mapEntityIDtoMyDetectedPlane.delete(myDetectedPlaneEntity.myObject.id)
              myDetectedPlaneEntity.myObject.removeFromScene()
              break
          }


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
//----------------------------------------------------------
         function addMyPlane(planeObj, WHminMax, semanticLabel, config = {})
         {
         const scalar = config.scalar || 1

         const mesh = createDraggableMesh(WHminMax.myWidth, WHminMax.myHeight, undefined, true, 0);

          // 2. Turn it into an IWSDK entity that is interactable & draggable
          const myDetectedPlaneEntity = world
            .createTransformEntity(mesh)
            .addComponent(Interactable, {})
            //.addComponent(Pressed) needs two clicks to activate
            .addComponent(MyVideo)
              /*
            .addComponent(DistanceGrabbable, {
              movementMode: MovementMode.MoveFromTarget,
              snapToHand: false,
              translate: false, // Allow moving
              rotate: false,
              distanceLimits: { min: 0.1, max: 10.0 },
            });

               */

          myDetectedPlaneEntity.original_object3D = planeObj
          myDetectedPlaneEntity.meshWithBorder = mesh
          addBorderToMesh(mesh, undefined)

          // 3. Align it with the plane pose (center-ish)
          myDetectedPlaneEntity.object3D.position.copy(planeObj.position);
          myDetectedPlaneEntity.object3D.quaternion.copy(planeObj.quaternion);
          myDetectedPlaneEntity.object3D.rotateX(-Math.PI / 2)
          myDetectedPlaneEntity.object3D.scale.setScalar(scalar)


          myDetectedPlaneEntity.object3D.updateMatrixWorld();

          const myPlane = new MyPlane(myDetectedPlaneEntity, mesh)

          myPlane.myScalarSignsForVideos = config.myScalarSignsForVideos
           myPlane.makeVisible(showingWallsAndTable)



          myPlane.label = semanticLabel
          myDetectedPlaneEntity.myObject.WHminMax = WHminMax

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


         return myDetectedPlaneEntity

         }
//----------------------------------------------------------
function removeEntityFromScene(entity)
{
if(entity)
  entity.destroy();
/* does all of the below
const object3D = entity.object3D;
if (object3D.parent)
  object3D.parent.remove(object3D);
world.removeEntity(entity);
world.deleteEntity(entity);

 */
}
//---------------------------------------------------
function makeThisAndChildrenPointToEntity(meshOrOther, entity)
{
    if(!meshOrOther)
        return
    meshOrOther.entity = entity
    if(meshOrOther.children)
        for(let child of meshOrOther.children)
            makeThisAndChildrenPointToEntity(child, entity)
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

    window.addVideosNotYetAdded()

    // XR session just started
    if (this.lastState === 'non-immersive' && state === 'visible')
    {

        window.xrSession = world.session
        myAirVideos_afterSessionStarts()

        createArtificialPlanes()

      console.log('[IWSDK] XR session started');


      closePopover()

      hasPlaneDetection = world.session.enabledFeatures.includes('plane-detection')

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

    this.lastState = state
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

myWorldCreate()

async function myWorldCreate()
{

if (! await navigator.xr.isSessionSupported('immersive-ar'))
    return showMessageErrorOnSOSforDuration("Augmented reality is not supported")

World.create(document.getElementById('scene-container'), {
  assets,
  xr: {
    sessionMode: SessionMode.ImmersiveAR,
    offer: 'always',
    // Optional structured features; layers/local-floor are offered by default
    features: { handTracking: true
              //, anchors: { required: false }
              //, persistentAnchors: { required: true }
              , hitTest: { required: true }, planeDetection: { required: false }, meshDetection: false, layers: { required: false } }
  },
  features: { locomotion: false, grabbing: false, physics: true, sceneUnderstanding: true, enableGrabbing: false
                        , interaction: {
                far: 10.0, // Sets max ray length to 10 meters
                near: 0.1
              }
           },
    // IMPORTANT: Add persistent-anchors to optionalFeatures
    // (It is rarely 'required' because the app should fallback if not supported)
    //optionalFeatures: ['persistent-anchors']

})
  .then((world) => {

  window.world = world

  const { camera } = world

  camera.position.set(0, 1, 0.5)

  const { scene: robotMesh } = AssetManager.getGLTF('robot');
  // defaults for AR
  robotMesh.position.set(-1.2, 0.4, -1.8);
  robotMesh.scale.setScalar(1);
  
  const robotEntity = world
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

const myRobot = new MyRobot(robotEntity, robotMesh)

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

 /*
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

  */


world
    .registerComponent(XRPlane)
    .registerComponent(XRMesh)
    .registerComponent(XRAnchor)
    .registerComponent(Interactable)
    .registerSystem(PlaneLoggerSystem)
    //.registerSystem(HitDebugSystem)

    //.registerSystem(PanelSystem)
    .registerSystem(RobotSystem)
    .registerSystem(MyVideoSystem)
    .registerSystem(XRSessionLifecycleSystem)
    //.registerSystem(TabletTouchSystem)
  //
  //

  .registerComponent(DashboardTag)
  .registerComponent(DashboardButton)
  .registerSystem(DashboardFollowSystem)
  .registerSystem(DashboardButtonSystem)
  // now it's safe to create entities with those components
  createDashboard(world)
  // and register the systems


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

myAirVideos_afterWorldCreate()


})
.catch((e) => {
    //NEVER CALLED!*! even when there is an error
    showMessageErrorOnSOSforDuration("WebXR access fail. Set browser flags to enable WebXR planes.")
})
;

} //static async myWorldCreate()
//------------------------------
function createArtificialPlanes()
{
          if(mapGroupArtificialPlanes.size)
              return

          const mesh = createTextTexture("Kjljlkjlkjlk", {width: 3000, height: 1000, bgColor: "#00ff00"})
          if(!globalEntity)
                {
                globalEntity = world.createTransformEntity(mesh)
                globalEntity.removeComponent(Interactable)
                globalEntity.object3D.visible = false
                }

            let x = 0
            let y = 0
            let z = 0

            const object3D = globalEntity.object3D
            const WHminMax = calculateWidthHeightAreaFromPlane(object3D)

            object3D.quaternion.setFromEuler(new THREE.Euler( -Math.PI / 2, 0, 0, 'XYZ'));
            object3D.scale.y = -globalEntity.object3D.scale.y

            let groupArtificialPlanes = new Set()
            mapGroupArtificialPlanes.set(0, groupArtificialPlanes) //none!

            groupArtificialPlanes = new Set()
            mapGroupArtificialPlanes.set(2, groupArtificialPlanes)

            // wall at front
            object3D.position.set(x + 0, y + 1.5, z - 3)
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "wall", {scalar: 1}))

            // wall at back
            object3D.position.set(x, y + 1.5, z + 3)
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "wall", {scalar: 1}))

            // wall at right
            object3D.position.set(x + 2, y + 1.5, z)
            setAngles(object3D, -Math.PI / 2, 0, -Math.PI / 2)
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "wall", {scalar: 1}))

            // wall at left
            object3D.position.set(x - 2, y + 1.5, z)
            setAngles(object3D, -Math.PI / 2, 0, Math.PI / 2)
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "wall", {scalar: 1}))

            // table at front
            object3D.position.set(x + 0, y + 0.3, z - 2)
            object3D.quaternion.setFromEuler(new THREE.Euler( 0, Math.PI ,  Math.PI, 'XYZ'));
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "table", {scalar: 0.6}))

            // table at back
            object3D.position.set(x + 0, y + 0.3, z + 2)
            object3D.quaternion.setFromEuler(new THREE.Euler( 0, 0, Math.PI , 'XYZ'));
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "table", {scalar: 0.6}))


            groupArtificialPlanes = new Set()
            mapGroupArtificialPlanes.set(1, groupArtificialPlanes)

            // wall at front left
            object3D.position.set(x - 1.3, y + 1.5, z - 3)
            setAngles(object3D, Math.PI / 2, Math.PI, Math.PI / 4)
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "wall", {scalar: 1, myScalarSignsForVideos: {x: -1, y: 1, z: 1} }))

            // wall at front right
            object3D.position.set(x + 1.3, y + 1.5, z - 3)
             setAngles(object3D, Math.PI / 2, Math.PI, -Math.PI / 4)
            object3D.myScalarSignsForVideos = {x: -1, y: -1, z: -1}
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "wall", {scalar: 1, myScalarSignsForVideos: {x: -1, y: 1, z: 1} }))

            // wall at back right
            object3D.position.set(x - 1.3, y + 1.5, z + 3)
             setAngles(object3D, Math.PI / 2, Math.PI, -Math.PI / 4)
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "wall", {scalar: 1}))

            // wall at back left
            object3D.position.set(x + 1.3, y + 1.5, z + 3)
             setAngles(object3D, Math.PI / 2, Math.PI, Math.PI / 4)
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "wall", {scalar: 1}))

            // wall at right
            object3D.position.set(x + 2, y + 1.5, z)
            object3D.quaternion.setFromEuler(new THREE.Euler( -Math.PI / 2, 0, -Math.PI / 2 , 'XYZ'));
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "wall", {scalar: 0.8}))

            // wall at left
            object3D.position.set(x - 2, y + 1.5, z)
            object3D.quaternion.setFromEuler(new THREE.Euler( -Math.PI / 2, 0, Math.PI / 2 , 'XYZ'));
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "wall", {scalar: 0.8}))

            // table at right left
            object3D.position.set(x + 2, y - 0.3, z - 1)
            object3D.quaternion.setFromEuler(new THREE.Euler( 0, Math.PI ,  Math.PI, 'XYZ'));
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "table", {scalar: 0.5}))

            // table at right right
            object3D.position.set(x + 2, y - 0.3, z + 1)
            object3D.quaternion.setFromEuler(new THREE.Euler( 0, Math.PI ,  Math.PI, 'XYZ'));
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "table", {scalar: 0.5}))


            // table at left left
            object3D.position.set(x - 2, y - 0.3, z - 1)
            object3D.quaternion.setFromEuler(new THREE.Euler( 0, Math.PI ,  Math.PI, 'XYZ'));
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "table", {scalar: 0.5}))

            // table at left right
            object3D.position.set(x - 2, y - 0.3, z + 1)
            object3D.quaternion.setFromEuler(new THREE.Euler( 0, Math.PI ,  Math.PI, 'XYZ'));
            groupArtificialPlanes.add(addMyPlane(object3D, WHminMax, "table", {scalar: 0.5}))




        artificialPlanesShowing(hasPlaneDetection ? 0 : 1)
        }
//------------------------------
function setAngles(object3D, x, y, z, XZY = "XYZ")
{
     object3D.quaternion.setFromEuler(new THREE.Euler( x, y, z , XZY));
    // object3D.rotateX(x)
    // object3D.rotateY(y)
     //object3D.rotateZ(z)
}
//------------------------------
window.artificialPlanesShowing = function(state = globalThis.lastState_artificialPlanesShowing, doNotRearrange)
{

    if(globalThis.lastState_artificialPlanesShowing === undefined)
    {
        globalThis.lastState_artificialPlanesShowing = localStorage.getItem("lastState_artificialPlanesShowing")
        if(globalThis.lastState_artificialPlanesShowing !== null)
            state = parseInt(globalThis.lastState_artificialPlanesShowing)
        else if(state === undefined)
            state = 0
    }

    if(state >= mapGroupArtificialPlanes.size)
        state = 0
    globalThis.lastState_artificialPlanesShowing = state
    localStorage.setItem("lastState_artificialPlanesShowing", globalThis.lastState_artificialPlanesShowing)
    for(let [num, groupArtificialPlanes] of  mapGroupArtificialPlanes)
      for(let entity of groupArtificialPlanes)
      {
          const addedNOTdestroyed = num === state
          entity.myObject.makeVisible(addedNOTdestroyed && showingWallsAndTable)
          if(addedNOTdestroyed)
              mapEntityIDtoMyPlane.set(entity.myObject.id, entity)
          else
          {
              removeEntitiesFromPlane(entity.myObject.mapIDtoObjects.values())
              mapEntityIDtoMyPlane.delete(entity.myObject.id)
          }
      }

    if(!doNotRearrange)
      rearrangeVideosNotPlacedManually()

}
//------------------------------
function rearrangeVideosNotPlacedManually()
{

   let entitiesNotInManualPositions = new Set()
   for(let[id, entity] of mapEntityIDtoMyObject)
       if(!entity.planeJoined
         || entity.myObject.video.idOfPlaneWhereItWasPlacedManually !== entity.planeJoined.id)
           entitiesNotInManualPositions.add(entity)

    for(let i = 0; i < 20; i++)
      if(!entitiesNotInManualPositions.size)
         break
      else
        for(let [id, entity] of mapEntityIDtoMyPlane)
          if(!entity.myObject.mapIDtoObjects.size || i === 1) //second pass accepts planes already with objects
          {
            let entitiesToPlace = new Set()
            let idWhenAddedManually
            for(let entityToPlace of entitiesNotInManualPositions)
            if(!idWhenAddedManually
                || idWhenAddedManually === entityToPlace.myObject.video.idOfPlaneWhereItWasPlacedManually)
            {
                entitiesToPlace.add(entityToPlace)
                if(!idWhenAddedManually)
                    idWhenAddedManually = entityToPlace.myObject.video.idOfPlaneWhereItWasPlacedManually
            }
            if(entitiesToPlace.size)
            {
                joinEntitiesToPlane(entity.myObject, entitiesToPlace)
                for(let entity2 of entitiesToPlace)
                    entitiesNotInManualPositions.delete(entity2)
            }
            else break
          }

    //were not placed normally because there are no planes!!!
    let num = 0
    for(let entity of entitiesNotInManualPositions)
     {
         entity.object3D.position.set((num % 10) * 0.33, 1 + Math.floor(num / 10) * 0.33, -1)
         if(entity.object3D.before_myScalarSignsForVideos)
            {
             entity.object3D.scale.copy(entity.object3D.before_myScalarSignsForVideos)
             entity.object3D.quaternion.copy(entity.object3D.before_myQuaternionSignsForVideos)
            }
         num++
     }

}
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
//------------------------------
  function calculateWidthHeightAreaFromPlane(plane)
  {

  let WHminMax = {}

  let minX = plane.position.x
  let maxX = plane.position.x + 3
  let minY = plane.position.y
  let maxY = plane.position.y + 0
  let minZ = plane.position.z
  let maxZ = plane.position.z + 2


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
window.addBorderToMesh = function (targetMesh, color = 0xffff00) {
  const edgesGeom = new THREE.EdgesGeometry(targetMesh.geometry);
  const edgesMat = new THREE.LineBasicMaterial({
        color: color
        ,linewidth: 5  // ignored on most platforms but... NOT IGNORED on Android Tablet Chrome!!!
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
    if (targetMesh.edges)
      targetMesh.remove(targetMesh.edges)
    targetMesh.edges = edges
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
function getObjectsSelected(groupName, subGroupName, exceptThisEntity, selected, placed, exceptThisPlaneJoined)
{
  let entities = new Set()
  for(let [id, entity] of mapEntityIDtoMyObject)
    if(entity !== exceptThisEntity
        && (selected === undefined || selected === entity.selected)
        && (placed === undefined || placed === entity.placed)
        && (!groupName || groupName === entity.myObject.video.groupName)
        && (!subGroupName || subGroupName === entity.myObject.video.subGroupName)
        && (!exceptThisPlaneJoined || entity.planeJoined !== exceptThisPlaneJoined)
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
function joinEntitiesToPlane(plane, entities, userPlacedNOTautomatic)
{
  if(!entities.size)
    return


  for(let entity of entities)
  if(entity.planeJoined !== plane)
  {
    entity.placed = true
    if(entity.planeJoined)
        removeEntityFromPlane(entity)
    plane.mapIDtoObjects.set(entity.object3D.id, entity)
    entity.planeJoined = plane
    plane.persistentInfo.videoCodes += " " + entity.myObject.video.code + " "
    if(userPlacedNOTautomatic)
        entity.myObject.video.idOfPlaneWhereItWasPlacedManually = entity.planeJoined.id //so that objects from same plane can be rearranged
  }

if(userPlacedNOTautomatic)
   updateVideosIn2D_mine(true)

MyPlane.storePlanesPersistentInfo()

plane.rearrangeObjects()
}

//-------------------------------------------------------------------
function removeEntityFromPlane(entity)
{
    if(!entity || !entity.planeJoined)
      return

    let planesToRearrange = new Set()
    entity.planeJoined.mapIDtoObjects.delete(entity.object3D.id)
    entity.planeJoined.persistentInfo.videoCodes = entity.planeJoined.persistentInfo.videoCodes.replaceAll(" " + entity.myObject.video.code + " ", "")
    entity.planeJoined.rearrangeObjects()
    entity.planeJoined = undefined

}
//-------------------------------------------------------------------
function removeEntitiesFromPlane(entities)
{
    for(let entity of entities)
      removeEntityFromPlane(entity)
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
window.makeInteractionPriority = function(entity, distance = 0)
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
      hit.distance = distance;

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
//--------------------------
class TabletInteractable {
  static schema = {
    // Optional: Add data if you need it (e.g., specific event names)
   id: { type: String, default: 'item-001' },
  };
}
//--------------------------
class TabletTouchSystem extends createSystem({
  // Only find entities that have our tag
  targets: { required: [TabletInteractable] }
}) {
  init() {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    // State for drag detection
    this.startX = 0;
    this.startY = 0;
    this.isPending = false;

    // We attach to window to catch events globally, but filter by target
    window.addEventListener('pointerdown', function () {
      console.log("DOWN ÇlkçkçlkçlkÇLKÇLKÇLK")
    });
    window.addEventListener('pointerup', function () {
      console.log("UP ÇlkçkçlkçlkÇLKÇLKÇLK")
    });
  }
}
//------------------------
function positionDashboardAndShow(showNOTshow = true, dashBoardOwner = DASHBOARD_WALL, myObjectOwner)
{
    positionDashBoardNow = showNOTshow
    dashboardRoot.object3D.visible = showNOTshow

    dashBoard_owner_myObject = showNOTshow ? myObjectOwner : undefined

    for(let [id, entity] of dashboardButtons)
      entity.myObject.makeVisible(showNOTshow && dashBoardOwner.includes(id))
}
//------------------------
class DashboardFollowSystem extends createSystem(
  {
    dashboard: { required: [DashboardTag] },
  },
  {}
) {
  init() {
    this.offset = new Vector3(0, -0.1, -1.5); // slightly below eye & 1.5m away
    this.tmp = new Vector3();
  }

  update(delta) {


   if (positionDashBoardNow)
      positionDashBoardNow = false
   else return



    const camera = this.world.camera; // main XR camera from IWSDK
    if (!camera) return;

    // For each dashboard, put it in front of the camera
    this.queries.dashboard.entities.forEach(entity => {
      const obj = entity.object3D;
      if (!obj) return;

      // position = camera.position + camera.quaternion * offset
      this.tmp.copy(this.offset);
      this.tmp.applyQuaternion(camera.quaternion);

      obj.position.copy(camera.position).add(this.tmp);

      // Make it face the same direction as the camera
      obj.quaternion.copy(camera.quaternion);
    });
  }
}
//------------------------
class DashboardButtonSystem extends createSystem(
  {
    buttonPressed: { required: [DashboardButton, Pressed] },
  },
  {}
) {
  update(delta) {

    // Every frame, see which buttons became pressed
    this.queries.buttonPressed.entities.forEach(entity => {
      const cfg = entity.buttonConfig //INSTEAD OF getComponent(DashboardButton)
      if (!cfg || !CLICKED_BY_ENTITY_NOT_TOUCH)
          return

      entity.myButton.clicked()


      // If you want "on click" once, make sure Pressed is cleared by IWSDK after release
    });
  }

  handleHome() {
    console.log('Dashboard: HOME pressed');
    // your logic here (e.g. change panel, teleport, etc.)
  }

  handleSettings() {
    console.log('Dashboard: SETTINGS pressed');
    // open config, toggle something, etc.
  }

  handleClose(entity) {
    console.log('Dashboard: CLOSE pressed');
    // maybe hide the dashboard:
    const root = entity.parent; // assuming parent is dashboard root
    if (root) root.object3D.visible = false;
  }
}
//----------------------------------------------------------------
window.textureWithImage = function(img, text, headerHeight){

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
  ctx.fillText(text, 10, headerHeight / 2);

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

    geometry.scale(1, 1, 1)              // mirror on X in local space
    geometry.computeVertexNormals()

    return new Mesh(geometry, material)

}

//----------------------------------------------
window.createTextTexture = function (text, config = {}) {
  // Default configuration
  const width = config.width || 512;
  const height = config.height || 256;
  const bgColor = config.bgColor || '#4a90e2'; // Blue
  const textColor = config.textColor || '#ffffff'; // White
  const fontSize = config.fontSize || 60;

  // 1. Create a virtual canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 2. Draw the Background Rectangle
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 3. Draw the Text
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Center the text in the canvas
  ctx.fillText(text, width / 2, height / 2);

  // 4. Create Three.js Texture
  const texture = new THREE.CanvasTexture(canvas);

  // Optional: Improve text sharpness
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true, // Only needed if your canvas has transparent areas
});

   //const geometry = new PlaneGeometry(planeWidth, planeHeight);
    const geometry = new PlaneGeometry(1, -1 * height/width)
    geometry.rotateX(-Math.PI / 2) // so as to avoid difference between planes and objects

    geometry.scale(0.3, 0.3, 0.3)              // mirror on X in local space
    geometry.computeVertexNormals()

   return new Mesh(geometry, material)
}
//--------------------------------
window.getWorld = function(){
    return world
}
//--------------------------------
function makeObject3Dvisible(object3D, visible)
{
    if(!object3D)
        return
    object3D.visible = visible
    if(object3D.children)
        for(let child of object3D.children)
            makeObject3Dvisible(child, visible)

    makeObject3Dvisible(object3D.edges)


}


window.MyPlane = MyPlane
window.MyButton = MyButton

