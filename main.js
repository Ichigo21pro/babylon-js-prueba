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
import "@babylonjs/loaders";
import { ActionManager, ExecuteCodeAction, SceneLoader } from "babylonjs";
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
const createScene = () => {
  return new Promise((resolve) => {
    //metemos todo lo necesario, entre ello la escena en si con la logica de babylon
    const scene = new BABYLON.Scene(engine);
    //
    //////////////////// camara ///////////////////
    //
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      1,
      10,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero()); // Apunta hacia el centro
    camera.attachControl(canvas, true); // Habilitar control de la cámara
    camera.wheelPrecision = 10;
    // Luz
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(3, 2, 5),
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
    const ground = BABYLON.Mesh.CreateGround("ground", 50, 50, 2, scene);
    const groundMaterial = new BABYLON.StandardMaterial(
      "groundMaterial",
      scene
    );
    const groundTexture = new BABYLON.Texture(
      "/public/Tiles_04_normalOgl.jpg",
      scene
    ); // Cambia esto por la ruta de tu textura

    // Ajustes de textura
    groundTexture.uScale = 10; // Ajustar escala horizontal
    groundTexture.vScale = 10; // Ajustar escala vertical

    groundMaterial.diffuseTexture = groundTexture; // Asignar la textura al material

    ground.material = groundMaterial; // Asignar el material al piso

    // player
    const loadModel = async () => {
      const model = await SceneLoader.ImportMeshAsync(
        null,
        "https://assets.babylonjs.com/meshes/",
        "HVGirl.glb",
        scene
      );
      const realPlayer = model.meshes[0];
      realPlayer.scaling.setAll(0.1);

      const camera = scene.activeCamera;
      camera.setTarget(realPlayer);

      // Animaciones
      const walkForwardAnimation = scene.getAnimationGroupByName("Walking");
      const walkBackAnimation = scene.getAnimationGroupByName("WalkingBack");
      const idleAnimation = scene.getAnimationGroupByName("Idle");
      const danceAnimation = scene.getAnimationGroupByName("Samba");

      // Velocidades
      const playerWalkSpeed = 0.1;
      const playerRunSpeed = 0.3;
      const playerSpeedBackwards = 0.05;
      const playerRotationSpeed = 0.05;

      // Manejo de teclas
      const keyStatus = {
        w: false,
        s: false,
        a: false,
        d: false,
        shift: false,
        b: false,
      };

      scene.actionManager = new ActionManager(scene);

      const registerKeyPress = (key) => {
        return new ExecuteCodeAction(
          ActionManager.OnKeyDownTrigger,
          (event) => {
            const pressedKey = event.sourceEvent.key.toLowerCase();
            if (pressedKey === key) {
              keyStatus[key] = true;
            }
          }
        );
      };

      const registerKeyRelease = (key) => {
        return new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
          const releasedKey = event.sourceEvent.key.toLowerCase();
          if (releasedKey === key) {
            keyStatus[key] = false;
          }
        });
      };

      ["w", "s", "a", "d", "shift", "b"].forEach((key) => {
        scene.actionManager.registerAction(registerKeyPress(key));
        scene.actionManager.registerAction(registerKeyRelease(key));
      });

      scene.onBeforeRenderObservable.add(() => {
        let moving = false;

        // Determinar si el jugador está moviéndose
        if (keyStatus.w || keyStatus.s || keyStatus.a || keyStatus.d) {
          moving = true;

          if (keyStatus.w) {
            walkForwardAnimation.start(
              true,
              keyStatus.shift ? 2 : 1,
              walkForwardAnimation.from,
              walkForwardAnimation.to,
              false
            );
          } else if (keyStatus.s) {
            walkBackAnimation.start(
              true,
              1,
              walkBackAnimation.from,
              walkBackAnimation.to,
              false
            );
          }

          if (keyStatus.a) {
            realPlayer.rotate(BABYLON.Vector3.Up(), -playerRotationSpeed);
          }

          if (keyStatus.d) {
            realPlayer.rotate(BABYLON.Vector3.Up(), playerRotationSpeed);
          }
        }
        if (keyStatus.b) {
          danceAnimation.start(
            true,
            1,
            danceAnimation.from,
            danceAnimation.to,
            false
          );
        }

        // Movimiento del jugador según la velocidad y la tecla presionada
        let speed = 0;
        if (keyStatus.w) {
          speed = keyStatus.shift ? playerRunSpeed : playerWalkSpeed;
        } else if (keyStatus.s) {
          speed = -playerSpeedBackwards;
        }

        realPlayer.moveWithCollisions(realPlayer.forward.scale(speed));

        // Si no se está moviendo, detener todas las animaciones excepto la de Idle
        if (!moving) {
          walkForwardAnimation.stop();
          walkBackAnimation.stop();
          danceAnimation.stop();
          idleAnimation.start(
            true,
            1,
            idleAnimation.from,
            idleAnimation.to,
            false
          );
        }
      });
    };
    loadModel();
    ///////////////////////////////////////////////////

    /*// Verificar colisión con el jugador
      if (object.intersectsMesh(player, false)) {
        //alert("¡Colisión! Juego terminado.");
        //engine.stopRenderLoop();
      }

      // Eliminar objetos que salgan del escenario
      if (object.position.y < -1) {
        object.dispose();
        fallingObjects.shift();
      }*/

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
    resolve(scene); // Devuelve la escena una vez que esté lista
    //
  });
};
//
const scene = createScene();
///////////////////////////////////////////// LOOP /////////////////////////////////////////////
//actualizamos la escena
// Crear la escena y configurar el bucle de renderizado
createScene().then((scene) => {
  engine.runRenderLoop(() => {
    scene.render(); // Asegúrate de que `scene` es una instancia de `BABYLON.Scene`
  });
  ///////////////////////////////////////////// RESIZE ///////////////////////////////////////////
  //actualizamos el tamaño
  window.addEventListener("resize", () => {
    engine.resize(); // Ajustar el tamaño del canvas al redimensionar la ventana
  });
});
////////////////////////////////////////////////////
