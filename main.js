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
  scene.createDefaultCameraOrLight(true, false, true); // basic one
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
  const sphere = new BABYLON.MeshBuilder.CreateSphere(
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
  sphereMaterial.diffuseTexture = new BABYLON.Texture("/wood.jpg");

  /*const box = new BABYLON.MeshBuilder.CreateBox("PrimerCubo", {
    size: 0.2,
    width: 0.2,
    height: 0.3,
    depth: 0.4,
    faceColors: [new BABYLON.Color4(1, 0, 0, 1), BABYLON.Color3.Green()], //color de cada cara
  }); //cubo*/
  //
  ////////////////////////////////////////////////
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
