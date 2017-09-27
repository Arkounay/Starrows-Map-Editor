"use strict";

import {World} from "./world/World";
import {Cursor} from "./editor/Cursor";
import Vector from "./math/Vector";
import {Camera} from "./editor/Camera";
import {Editor} from "./editor/Editor";

export const editor = new Editor(<HTMLCanvasElement> document.getElementById('canvas'));
editor.draw();
