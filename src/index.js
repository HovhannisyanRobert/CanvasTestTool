import * as PIXI from "pixi.js";


window.addEventListener("load", () => {
  console.log(44444);
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

  const form = document.getElementById("form");
  const myFile = document.getElementById("myFile");
  form.addEventListener("submit", (e) => {
    const newUrl = myFile.value.slice(12);

    e.preventDefault();
    addSprite(newUrl);
  });

  const mainContainer = new PIXI.Container();
  mainContainer.width = app.renderer.view.width;
  mainContainer.height = app.renderer.view.height;
  // mainContainer.x = app.renderer.view.width / 2;
  // mainContainer.y = app.renderer.view.height / 2;
  app.stage.addChild(mainContainer);

  async function addSprite(texturePAth) {
    // const texture = await PIXI.Assets.load(`img/${texturePAth}`);

    const sp = PIXI.Sprite.from(`img/${texturePAth}`);

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
