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
import {
  ActionManager,
  AnimationGroup,
  ExecuteCodeAction,
  SceneLoader,
} from "babylonjs";
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
    // // Configurar el motor de física para la escena
    // scene.enablePhysics(
    //   new BABYLON.Vector3(0, -9.81, 0),
    //   new BABYLON.CannonJSPlugin()
    // );
    //
    //////////////////// camara ///////////////////
    //
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      1,
      10,
      new BABYLON.Vector3(-1.5, 14.5, 21.5),
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
    const ground = BABYLON.Mesh.CreateGround("ground", 10000, 10000, 2, scene);
    const groundMaterial = new BABYLON.StandardMaterial(
      "groundMaterial",
      scene
    );
    const groundTexture = new BABYLON.Texture(
      "/public/groundTexture/Tiles_04_basecolor.jpg",
      scene
    ); // Cambia esto por la ruta de tu textura

    // Ajustes de textura
    groundTexture.uScale = 1200; // Ajustar escala horizontal
    groundTexture.vScale = 1200; // Ajustar escala vertical

    groundMaterial.diffuseTexture = groundTexture; // Asignar la textura al material

    ground.material = groundMaterial; // Asignar el material al piso

    // Cargar el skybox
    const loadSkybox = async () => {
      const skyboxMesh = await SceneLoader.ImportMeshAsync(
        null,
        "/public/sky/",
        "sky.glb",
        scene
      );

      const skybox = skyboxMesh.meshes[0];
      skybox.scaling.setAll(1000); // Escalar para cubrir toda la escena

      // Asegurarse de que el skybox no tenga interacciones ni colisiones
      skybox.isPickable = false; // No ser seleccionable
      skybox.checkCollisions = false; // Sin colisiones
      skybox.receiveShadows = false; // No recibir sombras
      skybox.doNotSyncBoundingInfo = true; // No sincronizar información de límites

      return skybox;
    };

    loadSkybox(); // Cargar el skybox al inicio

    // player
    /*const loadModel = async () => {

      const model = await SceneLoader.ImportMeshAsync(
        null,
        "https://assets.babylonjs.com/meshes/",
        "HVGirl.glb",
        scene
      );
      const realPlayer = model.meshes[0];
      realPlayer.scaling.setAll(0.4);

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
    loadModel();*/
    //fantasma

    // Cargar el modelo GLTF
    // Crear variables para cada animación
    var biteFront,
      biteInPlace,
      dance,
      death,
      hitRecieve,
      idle,
      jump,
      no,
      walk,
      yes;
    // Variables para el estado del personaje
    var isWalking = false;
    var isJumping = false;

    // Variables para la dirección del personaje
    var direction = new BABYLON.Vector3(0, 0, 1); // Dirección inicial (hacia adelante)

    BABYLON.SceneLoader.ImportMesh(
      "",
      "/public/",
      "Ghost.gltf",
      scene,
      function (newMeshes, particleSystems, skeletons, animationGroups) {
        // // Asegúrate de incluir todos estos parámetros
        // console.log("Animaciones disponibles:", animationGroups);

        // // Reproducir todas las animaciones disponibles
        // animationGroups.forEach(function (animationGroup) {
        //   animationGroup.start(true); // El parámetro true indica que se repiten
        // });

        // Asignar animaciones a variables
        animationGroups.forEach((animationGroup) => {
          switch (animationGroup.name) {
            case "Bite_Front":
              biteFront = animationGroup;
              break;
            case "Bite_InPlace":
              biteInPlace = animationGroup;
              break;
            case "Dance":
              dance = animationGroup;
              break;
            case "Death":
              death = animationGroup;
              break;
            case "HitRecieve":
              hitRecieve = animationGroup;
              break;
            case "Idle":
              idle = animationGroup;
              break;
            case "Jump":
              jump = animationGroup;
              break;
            case "No":
              no = animationGroup;
              break;
            case "Walk":
              walk = animationGroup;
              break;
            case "Yes":
              yes = animationGroup;
              break;
          }
        });

        // Ajustar la posición del modelo
        var ghost = newMeshes[0]; // La malla principal del modelo
        ghost.position = new BABYLON.Vector3(0, 2, 0); // Posición inicial
        ghost.rotation = new BABYLON.Vector3(0, 0, 0); // Rotación inicial

        camera.setTarget(ghost);
        // Reproducir una animación específica
        // control de personaje

        // Función para detener todas las animaciones
        function stopAllAnimations() {
          animationGroups.forEach((animationGroup) => {
            animationGroup.stop();
          });
        }
        ////////////////////////////////////////////////

        ///////////////////////////////////////////////

        // Manejo de teclas
        const keyStatus = {
          w: false,
          s: false,
          a: false,
          d: false,
          [" "]: false,
          b: false,
          shift: false,
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
          return new ExecuteCodeAction(
            ActionManager.OnKeyUpTrigger,
            (event) => {
              const releasedKey = event.sourceEvent.key.toLowerCase();
              if (releasedKey === key) {
                keyStatus[key] = false;
              }
            }
          );
        };

        ["w", "s", "a", "d", " ", "b", "shift"].forEach((key) => {
          scene.actionManager.registerAction(registerKeyPress(key));
          scene.actionManager.registerAction(registerKeyRelease(key));
        });
        let moving = false;
        scene.onBeforeRenderObservable.add(() => {
          moving = false;

          // Determinar si el jugador está moviéndose
          if (
            keyStatus.w ||
            keyStatus.s ||
            keyStatus.a ||
            keyStatus.d ||
            keyStatus.b ||
            keyStatus[" "] ||
            keyStatus.shift
          ) {
            moving = true;

            if (keyStatus.w) {
              walk.start(
                true,
                keyStatus.shift ? 2 : 1,
                walk.from,
                walk.to,
                false
              );
              direction = new BABYLON.Vector3(0, 0, 1); // Dirección hacia adelante
              ghost.rotation.y = 0; // Orientación hacia atrás
              ghost.position.addInPlace(direction.scale(-0.1)); // Mover el modelo
            }
            if (keyStatus.a) {
              walk.start(
                true,
                keyStatus.shift ? 2 : 1,
                walk.from,
                walk.to,
                false
              );
              // Hacia la izquierda
              direction = new BABYLON.Vector3(-1, 0, 0); // Dirección hacia la izquierda
              ghost.rotation.y = -Math.PI / 2; // Rotar hacia la derecha
              ghost.position.addInPlace(direction.scale(-0.1)); // Mover el modelo
            }
            if (keyStatus.d) {
              walk.start(
                true,
                keyStatus.shift ? 2 : 1,
                walk.from,
                walk.to,
                false
              );
              // Hacia la derecha
              direction = new BABYLON.Vector3(1, 0, 0); // Dirección hacia la derecha
              ghost.rotation.y = Math.PI / 2; // Apuntar hacia la izquierda
              ghost.position.addInPlace(direction.scale(-0.1)); // Mover el modelo
            }

            if (keyStatus.s) {
              walk.start(
                true,
                keyStatus.shift ? 2 : 1,
                walk.from,
                walk.to,
                false
              );
              // Hacia atrás
              direction = new BABYLON.Vector3(0, 0, -1); // Dirección hacia atrás
              ghost.rotation.y = -Math.PI; // Orientación hacia adelante
              ghost.position.addInPlace(direction.scale(-0.1)); // Mover el modelo
            }

            if (keyStatus.b) {
              dance.start(true, 1, dance.from, dance.to, false);
            }
          }

          if (keyStatus[" "]) {
            console.log("Salto");
            jump.start(false, 1, jump.from, jump.to, false);
            direction = new BABYLON.Vector3(0, 1, 0); // Dirección hacia adelante
            ghost.rotation.y = 0; // Orientación hacia atrás
            ghost.position.addInPlace(direction.scale(0.1)); // Mover el modelo
          }
          if (keyStatus.shift) {
            jump.start(false, 1, jump.from, jump.to, false);
            direction = new BABYLON.Vector3(0, 1, 0); // Dirección hacia adelante
            ghost.rotation.y = 0; // Orientación hacia atrás
            ghost.position.addInPlace(direction.scale(-0.1)); // Mover el modelo
          }
          // Si no se está moviendo, detener todas las animaciones excepto la de Idle
          if (!moving) {
            walk.stop();
            dance.stop();
            jump.stop();
            idle.start(true, 1, idle.from, idle.to, false);
          }
        });
      }
    );

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
