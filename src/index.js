import * as PIXI from "pixi.js";


window.addEventListener("load", () => {
  const app = new PIXI.Application({
    background: "#1099bb",
    width: 1440,
    height: 810,
  });
  // const pormptWidth = +window.prompt("insert Canvas width");
  // const pormptHeight = +window.prompt("insert Canvas height");
  app.renderer.view.width = 1440;
  app.renderer.view.height = 810;
  document.body.appendChild(app.view);

  globalThis.__PIXI_APP__ = app; // pixi extension

  const myFile = document.getElementById("myFile");
  myFile.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const imgElement = document.createElement("img");
        imgElement.src = reader.result;
        fetch(reader.result)
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            addSprite(url);
          });
      };
      reader.readAsDataURL(file);
    }
  });

  const mainContainer = new PIXI.Container();
  mainContainer.width = app.renderer.view.width;
  mainContainer.height = app.renderer.view.height;
  // mainContainer.x = app.renderer.view.width / 2;
  // mainContainer.y = app.renderer.view.height / 2;
  app.stage.addChild(mainContainer);

  async function addSprite(texturePAth) {
    const sp = PIXI.Sprite.from(texturePAth);

    sp.eventMode = "static";
    sp.cursor = "pointer";
    sp.anchor.set(0.5);
    sp.on("pointerdown", onDragStart, sp);

    mainContainer.addChild(sp);
  }
  let dragTarget = null;
  mainContainer.eventMode = "static";
  mainContainer.hitArea = app.screen;
  mainContainer.on("pointerup", onDragEnd);
  mainContainer.on("pointerupoutside", onDragEnd);

  function onDragMove(event) {
    if (dragTarget) {
      dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    }
  }

  function onDragStart() {
    this.alpha = 0.5;
    dragTarget = this;
    mainContainer.on("pointermove", onDragMove);
  }

  function onDragEnd() {
    if (dragTarget) {
      mainContainer.off("pointermove", onDragMove);
      dragTarget.alpha = 1;
      dragTarget = null;
    }
  }
});
