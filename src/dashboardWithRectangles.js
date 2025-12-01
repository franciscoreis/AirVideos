import {
  World,
  createSystem,
  Interactable,
  DistanceGrabbable,
  MovementMode,
  Pressed,
} from '@iwsdk/core';
import {
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  Group,
  Vector3,
} from 'three';

// --- Simple tag components (empty) ---
export class DashboardTag {}
export class DashboardButton {
  constructor(props) {
    this.id = props.id;      // e.g. 'home', 'settings', 'close'
    this.label = props.label;
  }
}

// --- Helper: create the dashboard root + buttons ---
export function createDashboard(world) {
  // Root entity (no mesh, just a transform)
  window.dashboardRoot = world
    .createTransformEntity()
    .addComponent(DashboardTag);


  dashboardRoot.object3D.visible = false


  // Make it easier to position a bunch of buttons
  const buttonWidth = 0.35;
  const buttonHeight = 0.18;
  const spacing = 0.05;

  const buttonsConfig = [
    { id: 'home',     label: 'Home',     x: -0.4 },
    { id: 'remove', label: 'Remove', x:  0.0 },
    { id: 'close',    label: 'Close',    x:  0.4 },
  ];

  const geometry = new PlaneGeometry(buttonWidth, buttonHeight);

  buttonsConfig.forEach(cfg => {

    //const material = new MeshBasicMaterial({ color: 0x444444 }); // base color
    const mesh = createTextTexture(cfg.label, {width: 300, height: 100})

    mesh.position.set(cfg.x, 0, 0); // arranged horizontally

    const buttonEntity = world
      .createTransformEntity(mesh)
      //.setParent(dashboardRoot) replaced by dashboardRoot.object3D.add(buttonEntity.object3D);
      .addComponent(Interactable)
      .addComponent(DistanceGrabbable, {
        movementMode: MovementMode.MoveFromTarget,
        snapToHand: false,
        distanceLimits: { min: 0.3, max: 2.0 },
      })
      .addComponent(DashboardButton, {
        id: cfg.id,
        label: cfg.label,
      });

    dashboardButtons.add(buttonEntity);

    const myButton = new MyButton(buttonEntity, mesh)
    myButton.id = cfg.id


    buttonEntity.object3D.rotateX( -Math.PI / 2 )
    //buttonEntity.object3D.rotateY( -Math.PI / 2 )

    buttonEntity.buttonConfig = cfg
    makeInteractionPriority(buttonEntity, 0)

    dashboardRoot.object3D.add(buttonEntity.object3D);


    // (Optional) you can store entity refs if you want to change colors on hover later
  });

  return dashboardRoot;
}
