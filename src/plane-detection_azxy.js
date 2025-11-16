"use strict"





/*
<script type="module">
    // Code adapted from three.js' WebXR hit test sample.
    // three.js is covered by MIT license which can be found at:
    // https://github.com/mrdoob/three.js/blob/master/LICENSE

    // The code also links to a .png file from ARCore Android SDK.
    // It is covered by Apache 2.0 license which can be found at:
    // https://github.com/google-ar/arcore-android-sdk/blob/c684bbda37e44099c273c3e5274fae6fccee293c/LICENSE

    import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
    import { XRControllerModelFactory } from 'https://unpkg.com/three@0.127.0/examples/jsm/webxr/XRControllerModelFactory.js';
    import {WebXRButton} from '../js/util/webxr-button.js';
    import {hitTest, filterHitTestResults} from '../js/hit-test.js';

    const usePlaneOrigin = document.getElementById('usePlaneOrigin');

    const allPlaneOrigins = [];
    usePlaneOrigin.addEventListener('input', element =>{
    consoleLogIfIsInLocalhost("Changing state of plane origins");
    allPlaneOrigins.forEach(group => {
    group.visible = usePlaneOrigin.checked
});
});

    // Suppress XR events for interactions with the DOM overlay
    document.querySelector('header').addEventListener('beforexrselect', (ev) => {
    consoleLogIfIsInLocalhost(ev.type);
    ev.preventDefault();
});
*/

var popupWindowXRcontrolCenter;
var text_XRcontrolCenter

//IMPORTANT: inspired/copied from https://cabanier.github.io/webxr-samples-1/proposals/plane-detection.html
class PlaneDetection
{

    /*
    xrButton = null;


    container;
    let group;
    let camera, scene, renderer;
    let controller1, controller2;
    let controllerGrip1, controllerGrip2;
    let startTime;
    let launchedCapture = false;

    */
    static arrayOfFloorWallCeiling = ["floor","wall","ceiling"]

    static webXRshowOptions = ["hide", "back","objects", "all"]
    static webXRshow_option = 1
    static UMNIVERSEshowOptions = ["hide", "only objects", "place and objects", "all places]"]
    static UMNIVERSEshow_option = 3

    //------------------------------
    constructor() {

        if(!PlaneDetection.loadManager)
        {
            PlaneDetection.loadManager = new THREE.LoadingManager();
            PlaneDetection.loader = new THREE.TextureLoader(PlaneDetection.loadManager);
            PlaneDetection.gridTexture = PlaneDetection.loader.load('https://raw.githubusercontent.com/google-ar/arcore-android-sdk/c684bbda37e44099c273c3e5274fae6fccee293c/samples/hello_ar_c/app/src/main/assets/models/trigrid.png');
            PlaneDetection.gridTexture.wrapS = THREE.RepeatWrapping;
            PlaneDetection.gridTexture.wrapT = THREE.RepeatWrapping;
        }


        this.intersected = [];

        this.tempMatrix = new THREE.Matrix4();

        this.boxgeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.material = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            roughness: 0.7,
            metalness: 0.0
        })

        /*
    let raycaster;
    let cached_frame;

    let reticle;
    // hitResult will be set when reticle is visible:
    let hitResult;
         */
        this.planeMaterials = [];
        this.lineMaterials = [
            new THREE.LineBasicMaterial({color: 0xff0000}),
            new THREE.LineBasicMaterial({color: 0x00ff00}),
            new THREE.LineBasicMaterial({color: 0x0000ff}),
        ];

        this.lineGeometries = [
            new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 0, 0)]),
            new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 5, 0)]),
            new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 5)]),
        ];

        this.baseOriginGroup = new THREE.Group();
        this.baseOriginGroup.add(new THREE.Line(this.lineGeometries[0], this.lineMaterials[0]));
        this.baseOriginGroup.add(new THREE.Line(this.lineGeometries[1], this.lineMaterials[1]));
        this.baseOriginGroup.add(new THREE.Line(this.lineGeometries[2], this.lineMaterials[2]));

        this.anchorId = 1;
        this.allAnchors = new Map();

        this.planeId = 1;
        this.allPlanes = new Map();

        //const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);//.translate(0, 0.1, 0);
        this.geometry = new THREE.TorusGeometry( .1, .03, 16, 100 ).rotateX(Math.PI/2).translate(0, -0.05, 0);


        //this.usePlaneOrigin = true //document.getElementById('usePlaneOrigin');

        this.allPlaneOrigins = []
        /*
        usePlaneOrigin.addEventListener('input', element =>{
            consoleLogIfIsInLocalhost("Changing state of plane origins");
            allPlaneOrigins.forEach(group => {
                group.visible = true //  or false usePlaneOrigin.checked
                })
            */

                this.init();

        PlaneDetection.changeUMNIVERSEshowOptions()

    } //constructor
    //------------------------------
    init()
    {

    //this.container = document.createElement('div');
    //document.body.appendChild(container);

    this.scene = new THREE.Scene();
    this.camera =  webXRgameAndCameraAndSceneThreeJS.camera

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    light.position.set(0.5, 1, 0.25)
    myAddObjectToScene(this.scene, light)

    this.renderer = webXRgameAndCameraAndSceneThreeJS.gameRenderer //new THREE.WebGLRenderer({ antialias: true, alpha: true });
    //this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.domElement.id = "MY_DIV_FOR_WEBXR"
    this.renderer.domElement.style.width = window.innerWidth + "px"
    this.renderer.domElement.style.height = window.innerHeight + "px"
    const parentElement = this.renderer.domElement.parentElement
    if(parentElement)
    {
        parentElement.style.zIndex = 0
        PlaneDetection.webXRgameAndCameraAndSceneThreeJS_div = parentElement
        let divIntroducedByMetaWebXRemulator = parentElement.previousSibling
        if(divIntroducedByMetaWebXRemulator && divIntroducedByMetaWebXRemulator.style.zIndex == 9998) //before
        {
            //if(!isInLocalhost)
            divIntroducedByMetaWebXRemulator.style.display = "none"
            divIntroducedByMetaWebXRemulator.style.zIndex = 100 //to debug seeing room on the back and must FIT!
        }
    }
    else PlaneDetection.webXRgameAndCameraAndSceneThreeJS_div = this.renderer.domElement

        /*
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight );
        this.renderer.xr.enabled = true;
        this.renderer.autoClear = false;
        */

    if(false)
    {
    this.container.appendChild(renderer.domElement);
    this.xrButton = new WebXRButton({
    //onRequestSession: this.onRequestSession,
    //onEndSession: this.onEndSession,
    textEnterXRTitle: "START AR",
    textXRNotFoundTitle: "AR NOT FOUND",
    textExitXRTitle: "EXIT AR",
    });

    //document.querySelector('header').appendChild(xrButton.domElement);

    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-ar')
        .then((supported) => {
            xrButton.enabled = supported;
        });
      }
    }


    this.reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
    );
    this.reticle.matrixAutoUpdate = false
    this.reticle.visible = false
    myAddObjectToScene(this.scene, this.reticle)


        this.planeMaterials.push(PlaneDetection.createPlaneMaterial({color: 0xff0000}));
        this.planeMaterials.push(PlaneDetection.createPlaneMaterial({color: 0x00ff00}));
        this.planeMaterials.push(PlaneDetection.createPlaneMaterial({color: 0x0000ff}));
        this.planeMaterials.push(PlaneDetection.createPlaneMaterial({color: 0xffff00}));
        this.planeMaterials.push(PlaneDetection.createPlaneMaterial({color: 0x00ffff}));
        this.planeMaterials.push(PlaneDetection.createPlaneMaterial({color: 0xff00ff}));

    // controllers

        this.controller1 = this.renderer.xr.getController( 0 )
        this.controller1.addEventListener( 'selectstart', this.onSelectStart )
        this.controller1.addEventListener( 'selectend', this.onSelectEnd )
        myAddObjectToScene(this.scene, this.controller1 )

        this.controller2 = this.renderer.xr.getController( 1 )
        this.controller2.addEventListener( 'selectstart', this.onSelectStart )
        this.controller2.addEventListener( 'selectend', this.onSelectEnd )
        myAddObjectToScene(this.scene, this.controller2 )

    const controllerModelFactory = new window.XRControllerModelFactory();

        this.controllerGrip1 = this.renderer.xr.getControllerGrip( 0 );
        this.controllerGrip1.add( controllerModelFactory.createControllerModel( this.controllerGrip1 ) );
        myAddObjectToScene(this.scene, this.controllerGrip1 );

        this.controllerGrip2 = this.renderer.xr.getControllerGrip( 1 );
        this.controllerGrip2.add( controllerModelFactory.createControllerModel( this.controllerGrip2 ) );
        myAddObjectToScene(this.scene, this.controllerGrip2 );

        this.raycaster = new THREE.Raycaster();

        this.group = new THREE.Group()
        myAddObjectToScene(this.scene, this.group)

    window.addEventListener('resize', this.onWindowResize);
}
//-------------------------------------------------
    static loadManager
    static loader
    static gridTexture
//-------------------------------------------------
    static createPlaneMaterial = (params) =>
    new THREE.MeshBasicMaterial(Object.assign(params, {
        map: PlaneDetection.gridTexture,
        opacity: 0.5,
        transparent: true,
    }));
//------------------------------------------------
    static createGeometryFromPolygon(polygon)
    {
        const geometry = new THREE.BufferGeometry();

        const vertices = [];
        const uvs = [];
        polygon.forEach(point => {
            vertices.push(point.x, point.y, point.z);
            uvs.push(point.x, point.z);
        })

        const indices = [];
        for(let i = 2; i < polygon.length; ++i) {
            indices.push(0, i-1, i);
        }

        geometry.setAttribute('position',
            new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('uv',
            new THREE.BufferAttribute(new Float32Array(uvs), 2))
        geometry.setIndex(indices);

        return geometry;
    }
//-------------------------------------------------
    onVisibilityChange(event) {
        consoleLogIfIsInLocalhost("Visibility change for "
        + (event.session.isImmersive ? "immersive" : "non-immersive")
        + " session: "
        + event.session.visibilityState);
    }
//-------------------------------------------------
    onSessionStarted(session)
    {
    popupWindowXRcontrolCenter.style.display = "block"

        //session.addEventListener('end', this.onSessionEnded);
    //session.addEventListener('select', this.onSelect);
    session.addEventListener('visibilitychange', this.onVisibilityChange);

    //this.renderer.xr.setReferenceSpaceType('local');
    //this.renderer.xr.setSession(session);

    //this.renderer.setAnimationLoop(render);
    this.startTime = new Date();
}
//------------------------------------------
    onEndSession(session) {
    //this.session.end();
}
//---------------------------------------------------------
    onSessionEnded(event) {

    popupWindowXRcontrolCenter.style.display = "none"
    myPlaneDetection = undefined
    //this.renderer.setAnimationLoop(null);
    //this.renderer.xr.setSession(null);
    this.launchedCapture = false
    PlaneDetection.changeUMNIVERSEshowOptions(3)
    changed_showOnlyActivePlaceWhenViewingFromAvatar(true)
}
//---------------------------------------------------------
    onWindowResize()
    {
    //this.camera.aspect = windowInnerWidth() / windowInnerHeight();
    //this.camera.updateProjectionMatrix();

    this.renderer.setSize(windowInnerWidth(), windowInnerHeight());
    }
//---------------------------------------------------------
getIntersections( controller )
{

    this.tempMatrix.identity().extractRotation( controller.matrixWorld );

    this.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
    this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.tempMatrix );

    return raycaster.intersectObjects( this.group.children, false );

}
//-------------------------------------------------------
intersectObjects( controller )
{

    // Do not highlight when already selected

    if ( controller.userData.selected !== undefined ) return;

    const line = controller.getObjectByName( 'line' );
    const intersections = this.getIntersections( controller );

    if ( intersections.length > 0 ) {

    const intersection = intersections[ 0 ];

    const object = intersection.object;
    object.material.emissive.r = 1;
    intersected.push( object );

    line.scale.z = intersection.distance;

} else {

    line.scale.z = 5;

}

}
//------------------------------------------
    cleanIntersected()
    {

    while ( this.intersected.length ) {

    const object = this.intersected.pop();
    object.material.emissive.r = 0;

}

}

//---------------------------------------------
    onSelectStart( event )
    {

    this.controller = event.target;

    const intersections = this.getIntersections( controller );

    if ( intersections.length > 0 ) {

    const intersection = intersections[ 0 ];

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random()});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.y = 1;
    mesh.visible = false;
    mesh.matrixAutoUpdate = false;

    // Reticle matrix is expressed relative to `referenceSpace`, but we need to
    // pass a pose relative to the plane space. Luckily, our JS-side hit test
    // contains that information as well.
    this.cached_frame.createAnchor(
    new XRRigidTransform({x: intersection.uv.x, z: intersection.uv.y, y: 0}),
    intersection.object.space)
    .then((anchor) => {
    this.group.add(mesh);

    // new anchor created:
    const anchorContext = {
    id: this.anchorId,
    mesh: mesh,
}

    this.allAnchors.set(anchor, anchorContext);
    consoleLogIfIsInLocalhost("New anchor created, id=" + this.anchorId);
    this.anchorId++;
});

    /*
    const object = new THREE.Mesh( boxgeometry, material );

              object.position.x = intersection.point.x;
              object.position.y = intersection.point.y;
              object.position.z = intersection.point.z;
    object.castShadow = true;
              object.receiveShadow = true;

              myAddObjectToScene(scene, object)
    */
}

}
//-------------------------------------------------------
    onSelectEnd( event ) {

    const controller = event.target;

    if ( controller.userData.selected !== undefined ) {

    const object = controller.userData.selected;
    object.material.emissive.b = 0;
    this.group.attach( object );

    controller.userData.selected = undefined;

}


}
//-------------------------------------------------------------------
processAnchors(timestamp, frame)
{
    const referenceSpace = this.renderer.xr.getReferenceSpace();

    if (frame.trackedAnchors)
    {
    this.allAnchors.forEach((anchorContext, anchor) => {
    if (!frame.trackedAnchors.has(anchor)) {
    // anchor was removed
        this.allAnchors.delete(anchor);
        consoleLogIfIsInLocalhost("Anchor no longer tracked, id=" + anchorContext.id);

        this.group.remove(anchorContext.mesh);
    }
    });

    frame.trackedAnchors.forEach(anchor => {
    if (this.allAnchors.has(anchor)) {
    const anchorContext = this.allAnchors.get(anchor);
    const anchorPose = frame.getPose(anchor.anchorSpace, referenceSpace);
    // update pose
    if (anchorPose) {
    anchorContext.mesh.visible = true;
    anchorContext.mesh.matrix.fromArray(anchorPose.transform.matrix);
} else {
    anchorContext.mesh.visible = false;
}
} else {
        consoleLogIfIsInLocalhost("New anchors should be processed in a createAnchor(...).then() promise");
}
});
}
}

//------------------------------------------------------------------------------
 onSelect(event)
    {
    if (this.reticle.visible) {
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random()});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.y = Math.random() * 2 + 1;
    mesh.visible = false;
    mesh.matrixAutoUpdate = false;

    // Reticle matrix is expressed relative to `referenceSpace`, but we need to
    // pass a pose relative to the plane space. Luckily, our JS-side hit test
    // contains that information as well.
    event.frame.createAnchor(
    new XRRigidTransform(hitResult.point_on_plane),
    hitResult.plane.planeSpace)
    .then((anchor) => {
        this.group.add(mesh);

    // new anchor created:
    const anchorContext = {
    id: this.anchorId,
    mesh: mesh,
}

    this.allAnchors.set(anchor, anchorContext);
    consoleLogIfIsInLocalhost("New anchor created, id=" + this.anchorId);
    this.anchorId++;
});
}
}
//--------------------------------------------
    processPlanes(timestamp, frame) {
    const referenceSpace = this.renderer.xr.getReferenceSpace();

    if (frame.detectedPlanes) {
        this.allPlanes.forEach((planeContext, plane) => {
        if (!frame.detectedPlanes.has(plane))
        {
        // plane was removed
            this.allPlanes.delete(plane);
            consoleLogIfIsInLocalhost("Plane no longer tracked, id=" + planeContext.id);

            this.group.remove(planeContext.mesh);
        }
    });

    frame.detectedPlanes.forEach(plane => {
    const planePose = frame.getPose(plane.planeSpace, referenceSpace);
    let planeMesh;

    if (this.allPlanes.has(plane))
    {
    // may have been updated:
    const planeContext = this.allPlanes.get(plane);
    planeMesh = planeContext.mesh;

    if (planeContext.timestamp < plane.lastChangedTime)
    {
    // updated!
        consoleLogIfIsInLocalhost ("plane updated");
        planeContext.timestamp = plane.lastChangedTime;

    const geometry = PlaneDetection.createGeometryFromPolygon(plane.polygon);
    planeContext.mesh.geometry.dispose();
    planeContext.mesh.geometry = geometry;
}
} else {
    // new plane

    // Create geometry:
    const geometry = PlaneDetection.createGeometryFromPolygon(plane.polygon);
    planeMesh = new THREE.Mesh(geometry,
    this.planeMaterials[this.planeId % this.planeMaterials.length]
    );

    planeMesh.matrixAutoUpdate = false;
    planeMesh.space = plane.planeSpace;

    if(PlaneDetection.webXRshow_option !== 2 || !PlaneDetection.arrayOfFloorWallCeiling.includes(plane._semanticLabel))
        this.group.add(planeMesh);

    // Create plane origin visualizer:
    const originGroup = this.baseOriginGroup.clone();
    originGroup.visible = true //usePlaneOrigin.checked;

    planeMesh.add(originGroup);
    this.allPlaneOrigins.push(originGroup);

    const planeContext = {
    id: this.planeId,
    timestamp: plane.lastChangedTime,
    mesh: planeMesh,
    origin: originGroup,
};

    this.allPlanes.set(plane, planeContext);
    consoleLogIfIsInLocalhost("New plane detected, id=" + this.planeId);
    this.planeId++;
}

    if (planePose) {
    planeMesh.visible = true;
    planeMesh.matrix.fromArray(planePose.transform.matrix);
} else {
    planeMesh.visible = false;
}
});
}
}
//-----------------------------------------------------------------
    render(timestamp, frame)
    {

    if(!frame.detectedPlanes)
       return  //feature "plane-detection" no supported

    if ((frame.detectedPlanes.size === 0)
        && false //UNDER CONSTRUCTION useRoomCapture.checked
        && ((new Date() - startTime) > 1000)
        && (launchedCapture === false))
    {
        //UNDER CONSTRUCTION
       if (frame.session.initiateRoomCapture)
            frame.session.initiateRoomCapture();

    this.launchedCapture = true;
    }
    if (frame) {
    this.cached_frame = frame;
        this.processAnchors(timestamp, frame);
        this.processPlanes(timestamp, frame);

    let referenceSpace = this.renderer.xr.getReferenceSpace();

    // 2. Describe how far you want to move the origin.
    //    Here we move it +1 m up and –0.5 m forward
    const pixels = compensateXforSided2Din3D(0)
    const pixelsVert = compensateYforSided2Din3D(0)


    //works if window is not resized during XR session (CALCULATIONS MUST BE IMPROVED...)
    const offset = new XRRigidTransform(
      { x: -6 * pixels / 1920,  y: 4.6 * pixelsVert / 1920,  z: 0 },      // translation
      { x: 0,  y: 0,    z: 0,   w: 1 }  // rotation (identity quaternion)
    );

    // 3. Ask WebXR for a *new* space that applies that offset
    referenceSpace = referenceSpace.getOffsetReferenceSpace(offset); // WebXR API


    this.reticle.visible = false;
    this.hitResult = null;

    const pose = frame.getViewerPose(referenceSpace);
    if (pose)
    {
        this.renderer.getContext().clearColor(0, 0, 0, 0);
        this.renderer.getContext().clear(this.renderer.getContext().COLOR_BUFFER_BIT | this.renderer.getContext().DEPTH_BUFFER_BIT);

        const ray = new XRRay(pose.transform);

    // Perform a JS-side hit test against mathematical (infinte) planes:
    const hitTestResults = hitTest(frame, ray, referenceSpace);
    // Filter results down to the ones that fall within plane's polygon:
    const hitTestFiltered = filterHitTestResults(hitTestResults);

    let display = "none"
    if (hitTestFiltered && hitTestFiltered.length > 0)
    {
        display = "block"
        this.hitResult = hitTestFiltered[0];

        const plane = this.hitResult.plane;
        if(plane)
        {
            text_XRcontrolCenter.innerHTML = plane._semanticLabel
        }

        const hitMatrix = this.hitResult.hitMatrix;

        hitMatrix[12] += 0.001; // move the reticle slightly away from the plane
        hitMatrix[13] += 0.001; // center to prevent z-fighting with plane meshes
        hitMatrix[14] += 0.001;

        this.reticle.visible = true;

        this.reticle.matrix.fromArray(hitMatrix);
    }
    else text_XRcontrolCenter.innerHTML = "-"

   popupWindowXRcontrolCenter.style.display = display
}

        this.renderer.render(this.scene, this.camera);
}
}
//-----------------------------------------------
    static changeWebXRshowOptions(option)
    {

        const optionBefore = PlaneDetection.webXRshow_option
        if(option !== undefined)
            PlaneDetection.webXRshow_option = option
        else
            option = PlaneDetection.webXRshow_option

        switch(PlaneDetection.webXRshow_option)
        {
            case 0:
        }

        if(optionBefore !== option && (option === 2 || optionBefore === 2))
            for(let [plane, planeContext] of myPlaneDetection.allPlanes)
                if(PlaneDetection.arrayOfFloorWallCeiling.includes(plane._semanticLabel))
                    option === 2 ? myPlaneDetection.group.remove(planeContext.mesh) : myPlaneDetection.group.add(planeContext.mesh)

        //for(let child of myPlaneDetection.group.children)
        //  consoleLogIfIsInLocalhost(child.mesh)


        PlaneDetection.webXRgameAndCameraAndSceneThreeJS_div.style.display = option ? "block": "none"
        PlaneDetection.webXRgameAndCameraAndSceneThreeJS_div.style.zIndex = option < 2 ? 0: 9999



    }
//-----------------------------------------------
    static changeUMNIVERSEshowOptions(option, active)
    {

        const optionBefore = PlaneDetection.UMNIVERSEshow_option
        if(option !== undefined)
        {
            PlaneDetection.UMNIVERSEshow_option = option
            for(let i = 0; i < PlaneDetection.UMNIVERSEshowOptions.length; i++)
                $(".radio_UMNIVERSEshowOptions_" + i).prop("checked", i === option)
            $(".checkboxes_showOnlyActivePlaceWhenViewingFromAvatar").prop("checked", option === 2)
        }
        else
            option = PlaneDetection.UMNIVERSEshow_option

        let IDSplace = active ? active.IDSplace : getValidIDSplaceOfCameraOnObject()


        for(let [IDSplace2, place] of places)
         if(!place.doNotMakeVisible)
          switch(PlaneDetection.UMNIVERSEshow_option)
          {
            case 0:
                place.makeVisible(false)
                break;
            case 1:
                place.makeVisible(!IDSplace || place.IDSplace === IDSplace)
                if(place.IDSplace === IDSplace)
                {
                    switchPlaceBetweenCSS3DandWebGL(undefined, place, true)
                    place.makeVisible(false, true) //hides place but leaves objects visible
                }
                break;
            case 2:
                place.makeVisible(!IDSplace || place.IDSplace === IDSplace)
                break;
            case 3:
                place.makeVisible(true)
                break;
          }


    }
//------------------------------------------------
static UMNIVERSEshowOptionsHTML()
    {
        let s = "<nobr>"
        for(let i = 0; i < PlaneDetection.UMNIVERSEshowOptions.length; i++)
            s += "<input class='radio_UMNIVERSEshowOptions_" + i + "' type='radio' onClick='PlaneDetection.changeUMNIVERSEshowOptions("+i+")' title='"+PlaneDetection.UMNIVERSEshowOptions[i]+"' " + (PlaneDetection.UMNIVERSEshow_option === i ? "checked" : "") +">"
        s += "</nobr>"
        return s
    }
//------------------------------------------------
    static create_popupWindowXRcontrolCenter()
    {

        popupWindowXRcontrolCenter = createDiv()
        popupWindowXRcontrolCenter.id = "popupWindowXRcontrolCenter"

        popupWindowXRcontrolCenter.style ="border:1px solid #000;pointer-events:none;z-index:30001;position:fixed;bottom:80px;"+(controlCenter3DatRightNotLeft ? "left" : "right") + ":0px;"
            +"text-align: center; background:rgba(0,0,0,0);box-shadow:none"

        popupWindowXRcontrolCenter.style.display = "none"


        document.body.appendChild(popupWindowXRcontrolCenter)//can be different documents


        let s = "<table onClick='event.stopPropagation()' class='wm onlyShowIn3D' style='display:block;width:100%'>"
            + "<tr><td class='wm' style='vertical-align:top;height:1px;pointer-events: all;background-color:#fff'>"

            + "<table>"
            + "<tr><td>" + PlaneDetection.UMNIVERSEshowOptionsHTML() + "</td></tr>"
              + "<tr><td id='text_XRcontrolCenter'></td></tr>"
              + "<tr><td><nobr>"
            for(let i = 0; i < PlaneDetection.webXRshowOptions.length; i++)
                s += "<input type='radio' name='radios_webXRshowOptions' onClick='PlaneDetection.changeWebXRshowOptions("+i+")' title='"+PlaneDetection.webXRshowOptions[i]+"' " + (PlaneDetection.webXRshow_option === i ? "checked" : "") +">"
            s += "</nobr></td></tr>"
              + "</table>"
            + "<br><table border=1 style='width:100%;min-width:100px;'><tr>"
                + "<td style='width:35%;cursor:pointer;background-color:#ffb'><img src='"+ cdniverse +"images/WebXR/webxr.png' style='height:30px'></td>"
                + "<td style='cursor:pointer;color:red;background-color:#cfc'><b>+</b></td>"
                + "<td style='width:35%;cursor:pointer;background-color:#ffb'><img src='"+ cdniverse +"images/umniverse/nine_squares.svg' style='height:20px'></td>"
            + "</tr></table>"

        popupWindowXRcontrolCenter.innerHTML = s

        text_XRcontrolCenter = $("#text_XRcontrolCenter")[0]


    }
}


