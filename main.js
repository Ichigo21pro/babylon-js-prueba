///////////////////////////////////////////////////////// INTRODUCCION /////////////////////////////////////////////////////
/*
4 elementos esenciales 
1.- canvas (on index.html)
2.- Engine
3.- Scene
4.- Camara
*/
/*
camera :
-  universal camera (first person game)
- arc rotate camera (diferentes angulos)
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////// imports ///////////////////////////////////////////
//
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/gltf";
import { Inspector } from "babylonjs-inspector";
//
/////////////////////////////////////// variables globales /////////////////////////////////////
//
// recogemos el canvas de index.html
const canvas = document.getElementById("renderCanvas");
//
// creamos la engine ("cabeza") del proyecto
const engine = new BABYLON.Engine(canvas);
//
///////////////////////////////////////////// SCENE ////////////////////////////////////////////
//creamos la escena
const createScene = async function () {
  //metemos todo lo necesario, entre ello la escena en si con la logica de babylon
  const scene = new BABYLON.Scene(engine);
  //
  //////////////////// camara ///////////////////
  //
  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 5, -10),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  // Luz
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;
  //scene.createDefaultCameraOrLight(true, false, true); // basic one
  // other camera :
  //scene.createDefaultLight(); //luz para poder ver
  /*//universal camera
  const camera = new BABYLON.UniversalCamera(
    "MiCamara",
    new BABYLON.Vector3(0, 5, -10),
    scene
  );
  camera.attachControl(true);
  camera.inputs.addMouseWheel();
  camera.setTarget(BABYLON.Vector3.Zero());*/
  /*//Arc camera :
  const camera = new BABYLON.ArcRotateCamera(
    "",
    0, //rotation y (beta)
    0, //rotation z (alpha)
    10, //rotation x (omega)
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(true);
  camera.setPosition(new BABYLON.Vector3(0, 0, -20));
  camera.lowerBetaLimit = Math.PI / 4; //limits rotate
  camera.upperBetaLimit = Math.PI / 2; //limits rotate
  camera.lowerRadiusLimit = 20; //min distance
  camera.upperRadiusLimit = 50; //max distance*/
  //
  //////////////////////////////////////////////
  //
  ///////////////////// elementos ////////////////
  // Piso
  const ground = BABYLON.Mesh.CreateGround("ground", 20, 20, 2, scene);
  // Cubo controlado por el jugador
  const player = BABYLON.MeshBuilder.CreateBox("player", { size: 1 }, scene);
  player.position.y = 2; // Lo colocamos sobre el piso
  // Configuración para objetos que caen
  const fallingObjects = [];
  const objectFallSpeed = 0.05;

  // Función para crear un nuevo objeto que cae
  const createFallingObject = () => {
    const box = BABYLON.MeshBuilder.CreateBox(
      "fallingObject",
      { size: 1 },
      scene
    );
    box.position = new BABYLON.Vector3(
      Math.random() * 20 - 10, // Aleatorio en el eje x
      10, // Comienza por encima de la escena
      0
    );
    fallingObjects.push(box);
  };
  // Control del jugador con las teclas
  const inputMap = {};
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyDownTrigger,
      (evt) => {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
      }
    )
  );
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyUpTrigger,
      (evt) => {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keyup";
      }
    )
  );

  // Velocidad de movimiento del jugador
  const playerSpeed = 0.15;

  scene.onBeforeRenderObservable.add(() => {
    // Movimiento del jugador
    if (inputMap["a"] || inputMap["ArrowLeft"]) {
      player.position.x -= playerSpeed;
    }
    if (inputMap["d"] || inputMap["ArrowRight"]) {
      player.position.x += playerSpeed;
    }

    // Actualizar posición de objetos que caen
    for (const object of fallingObjects) {
      object.position.y -= objectFallSpeed;

      // Verificar colisión con el jugador
      if (object.intersectsMesh(player, false)) {
        alert("¡Colisión! Juego terminado.");
        engine.stopRenderLoop();
      }

      // Eliminar objetos que salgan del escenario
      if (object.position.y < -1) {
        object.dispose();
        fallingObjects.shift();
      }
    }
  });

  // Crear objetos que caen periódicamente
  setInterval(createFallingObject, 1000);

  //añadimos elementos (ejemplos en orden de Complicado - Basicos)
  //
  /*const groundFromHM = new BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "PrimerMapaTextura",
    "/heightmap.png",
    { height: 10, width: 10, subdivisions: 50, maxHeight: 2 }
  );
  groundFromHM.material = new BABYLON.StandardMaterial();
  groundFromHM.material.wireframe = true;*/
  /*const ground = new BABYLON.MeshBuilder.CreateGround("PrimerSuelo", {
    height: 10,
    width: 10,
    subdivisions: 5, //poligonos visuales (no visible a no ser que se aplique lo de abajo)
    subdivisionsX: 10,
  });
  //para que se vea los poligonos de subdivisions
  ground.material = new BABYLON.StandardMaterial();
  ground.material.wireframe = true;*/
  /*const sphere = new BABYLON.MeshBuilder.CreateSphere(
    "PrimeraEsfera",
    {
      segments: 20, //segementos, los "poligonos visuales" (parece que se vea "pixelado") cuantos más cantidad más detallado el objeto
      diameter: 0.3, //diametro de la esfera
      diameterY: 0.4, //diametro en eje Y
    },
    scene
  ); //esfera
  //add material to sphere :
  const sphereMaterial = new BABYLON.StandardMaterial();
  sphere.material = sphereMaterial;
  //cambios:
  // sphereMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); //color
  // sphereMaterial.specularColor = new BABYLON.Color3(1, 0, 0); //light color
  // sphereMaterial.ambientColor = new BABYLON.Color3(0, 1, 1); //color
  // scene.ambientColor = new BABYLON.Color3(0, 1, 0.5); //ambient color
  // sphereMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0); //color emssive
  sphereMaterial.diffuseTexture = new BABYLON.Texture("/wood.jpg");*/
  /*const box = new BABYLON.MeshBuilder.CreateBox("PrimerCubo", {
    size: 0.2,
    width: 0.2,
    height: 0.3,
    depth: 0.4,
    faceColors: [new BABYLON.Color4(1, 0, 0, 1), BABYLON.Color3.Green()], //color de cada cara
  }); //cubo*/
  //
  //import
  /*BABYLON.SceneLoader.ImportMesh(
    "",
    "/",
    "Cow.gltf",
    scene,
    function (meshes, particleSystem, skeletons, animationGroups) {
      const model = meshes[0];
      model.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
      //
      animationGroups[5].play(true);
    }
  );*/

  //
  ////////////////////////////////////////////////
  //
  //////////////////// sound ////////////////////
  //sonidos
  /*
  const bgMusic = new BABYLON.Sound("", "/DivKid.mp3", scene, null, {
    loop: true,
    autoplay: true,
  });*/
  //
  ///////////////////////////////////////////////
  //
  /////////////////////// texto ///////////////////
  //
  /*//añadimos texto (tiene que ser formato.json)
  const fontData = await (await fetch("/Montserrat_Regular.json")).json();
  const text = BABYLON.MeshBuilder.CreateText(
    "",
    "Este es mi texto",
    fontData,
    {
      size: 2,
      depth: 0.1,
      resolution: 64,
    }
  );*/
  //
  /////////////////////////////////////////////////
  //return
  return scene;
  //
};
//
const scene = await createScene();
///////////////////////////////////////////// LOOP /////////////////////////////////////////////
//actualizamos la escena
engine.runRenderLoop(function () {
  scene.render();
});
///////////////////////////////////////////// RESIZE ///////////////////////////////////////////
//actualizamos el tamaño
window.addEventListener("resize", function () {
  engine.resize();
});
////////////////////////////////////////////////////
