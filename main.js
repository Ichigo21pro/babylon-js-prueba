///////////////////////////////////////////////////////// INTRODUCCION /////////////////////////////////////////////////////
/*
4 elementos esenciales 
1.- canvas (on index.html)
2.- Engine
3.- Scene
4.- Camara
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////// imports //////////////////////
//
import * as BABYLON from "@babylonjs/core";
//
///////////////// variables globales ////////////////
//
// recogemos el canvas de index.html
const canvas = document.getElementById("renderCanvas");
//
// creamos la engine ("cabeza") del proyecto
const engine = new BABYLON.Engine(canvas);
//
//creamos la escena
const createScene = function () {
  //metemos todo lo necesario, entre ello la escena en si con la logica de babylon
  const scene = new BABYLON.Scene(engine);
  return scene;
  //
};
//
const scene = createScene();
//
//actualizamos la escena
engine.runRenderLoop(function () {
  scene.render();
});
////////////////////////////////////////////////////
