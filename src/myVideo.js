

import {
  createComponent,
  createSystem,
  Pressed,
  Vector3
} from '@iwsdk/core';

export const MyVideo = createComponent('MyVideo', {});

export class MyVideoSystem extends createSystem({
  myVideo: { required: [MyVideo] },
  myVideoClicked: { required: [MyVideo, Pressed] }
}) {
  init() {
    this.lookAtTarget = new Vector3();
    this.vec3 = new Vector3();
    this.alwaysHorizontal = false
    this.alwaysVertical = false
    this.selected = false
    this.queries.myVideoClicked.subscribe('qualify', (entity) => {
      console.log("CLICKED MY VIDEO")
      if(entity.myObject)
         entity.myObject.clicked()
      
    });
     this.queries.myVideoClicked.subscribe('disqualify', (entity) => {
      console.log("POINTER UP")
    });
  }

  update() {
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
  }
}
