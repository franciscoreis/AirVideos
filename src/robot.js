

import {
  createComponent,
  createSystem,
  Pressed,
  Vector3
} from '@iwsdk/core';

export const Robot = createComponent('Robot', {});

export class RobotSystem extends createSystem({
  robot: { required: [Robot] },
  robotClicked: { required: [Robot, Pressed] }
}) {
  init() {
    this.lookAtTarget = new Vector3();
    this.vec3 = new Vector3();
    this.queries.robotClicked.subscribe('qualify', (entity) => {
      if(CLICKED_BY_ENTITY_NOT_TOUCH)
        entity.myObject.clicked()
    });
  }

  update() {
    this.queries.robot.entities.forEach((entity) => {
      this.player.head.getWorldPosition(this.lookAtTarget);
      const spinnerObject = entity.object3D;
      spinnerObject.getWorldPosition(this.vec3);
      this.lookAtTarget.y = this.vec3.y;
      spinnerObject.lookAt(this.lookAtTarget);
    });
  }
}
