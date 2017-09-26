"use strict";

import {World} from "./world/World";
import {Cursor} from "./editor/Cursor";
import Vector from "./math/Vector";
import {Camera} from "./editor/Camera";

const canvas = <HTMLCanvasElement> document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cursor = new Cursor();
let camera = new Camera();
let ctx = canvas.getContext('2d');

let world = new World(32, 32);
world.draw(ctx);

cursor.addEvents(world, canvas, ctx, camera);

export function draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(camera.position.x, camera.position.y);
    world.draw(ctx);
    ctx.translate(-camera.position.x, -camera.position.y);
    ctx.scale(1 / camera.zoom, 1 / camera.zoom)
}

