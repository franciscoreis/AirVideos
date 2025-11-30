

import {
  createComponent,
  createSystem,
  Interactable,
  DistanceGrabbable,
  Pressed,
  Vector3
} from '@iwsdk/core';

export const MyVideo = createComponent('MyVideo', {});

export class MyVideoSystem extends createSystem({
  myVideo: { required: [MyVideo] },
  myVideoClicked: { required: [MyVideo, Pressed] },
  //myVideoGrabbed: { required: [MyVideo, DistanceGrabbable] },
  //myVideoTouched: { required: [MyVideo, Pressed] },

}) {
  init() {
    this.lookAtTarget = new Vector3();
    this.vec3 = new Vector3();
    this.alwaysHorizontal = false
    this.alwaysVertical = false
    this.selected = false

    this.queries.myVideoClicked.subscribe('qualify', (entity) => {
      console.log("CLICKED MY VIDEO")
      if (entity.myObject && CLICKED_BY_ENTITY_NOT_TOUCH)
        entity.myObject.clicked()
    });
    this.queries.myVideoClicked.subscribe('disqualify', (entity) => {
      console.log("POINTER UP")
    });


     this.prevTouchedIds = new Set();

  }

update(delta, time)
{
    this.queries.myVideo.entities.forEach((entity) => {
      this.player.head.getWorldPosition(this.lookAtTarget);
      const spinnerObject = entity.object3D;
      spinnerObject.getWorldPosition(this.vec3);
      if(this.alwaysHorizontal)
        this.lookAtTarget.x = this.vec3.x
      if(this.alwaysVertical)
         this.lookAtTarget.y = this.vec3.y
      if(this.alwaysHorizontal)
        this.lookAtTarget.z = this.vec3.z
      //spinnerObject.lookAt(this.lookAtTarget);
    });


    return
    const currTouchedIds = new Set();

    // All entities currently touched this frame
    for (const entity of this.queries.myVideoTouched.entities) {
      const id = entity.id;
      currTouchedIds.add(id);

      // 🔹 Just touched (Pressed became true this frame)
      if (!this.prevTouchedIds.has(id)) {
        console.log('JUST TOUCHED (pointer down):', id);

        const comp = entity.get(MyVideo);
        comp?.onPointerDown?.();
        entity.myObject?.onPointerDown?.();
      }
    }

    // 🔹 Just released (Pressed was true last frame, but not now)
    for (const id of this.prevTouchedIds) {
      if (!currTouchedIds.has(id)) {
        // find the entity again if needed
        const entity = this.queries.myVideoTouched.world.entities.get(id);
        console.log('JUST RELEASED (pointer up):', id);

        if (entity) {
          const comp = entity.get(MyVideo);
          comp?.onClick?.();
          entity.myObject?.clicked?.();
        }
      }

    // Save for next frame
    this.prevTouchedIds = currTouchedIds;
  }

  }
}
