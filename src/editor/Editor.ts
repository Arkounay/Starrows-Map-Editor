import {MouseState} from "./MouseState";
import Vector from "../math/Vector";
import {World} from "../world/World";
import {Tile} from "../world/Tile";
import {Camera} from "./Camera";
import {TilesetFamily} from "./tileset/TilesetFamily";
import {Cursor} from "./Cursor";
import {Tileset} from "./tileset/Tileset";
import {TileRenderable} from "../world/TileRenderable";

export class Editor {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private cursor = new Cursor();
    private camera = new Camera();
    private world = new World(32, 32);

    private ground: TilesetFamily;
    public readonly tileset: Tileset;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = canvas.getContext('2d');

        this.cursor.addEvents(this.world, canvas, this.camera);

        this.ground = new TilesetFamily;
        this.ground.hydrateFromInner(16, 3);
        this.ground.hydrateFromOuterLeft(16, 0);

        this.tileset = new Tileset('assets/tilesets/tileset.png');
    }

    public draw(): void {
        let ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(this.camera.position.x, this.camera.position.y);
        this.world.draw(ctx);
        ctx.translate(-this.camera.position.x, -this.camera.position.y);
        ctx.scale(1 / this.camera.zoom, 1 / this.camera.zoom)
    }


    public addTile(tileX: number, tileY: number): void {
        let canDrawTop = tileY - 1 >= 0;
        let canDrawBottom = tileY + 1 < this.world.height;
        let canDrawLeft = tileX - 1 >= 0;
        let canDrawRight = tileX + 1 < this.world.width;

        let layer = this.world.getLayers()[0];
        layer.addTile(tileX , tileY, this.ground.inner);

        if (canDrawTop) {
            // TODO : generic tiles
            layer.addTile(tileX, tileY - 1, this.ground.innerT);
            if (canDrawLeft) {
                layer.addTile(tileX - 1, tileY - 1, this.ground.innerTL);
            }
            if (canDrawRight) {
                layer.addTile(tileX + 1, tileY - 1, this.ground.innerTR);
            }
        }

        if (canDrawLeft) {
            layer.addTile(tileX - 1, tileY, this.ground.innerL);
            if (canDrawBottom) {
                layer.addTile(tileX - 1, tileY + 1, this.ground.innerBL);
            }
        }

        if (canDrawRight) {
            layer.addTile(tileX + 1, tileY, this.ground.innerR);
            if (canDrawBottom) {
                layer.addTile(tileX + 1, tileY + 1, this.ground.innerBR);
            }
        }

        if (canDrawBottom) {
            layer.addTile(tileX , tileY + 1, this.ground.innerB);
        }

        layer.map((tile: TileRenderable, x: number, y: number) => {
            // TODO : check tile family
            if (tile !== null) {
                let tileTL = layer.getTile(x - 1, y - 1);
                let tileT = layer.getTile(x, y - 1);
                let tileTR = layer.getTile(x + 1, y - 1);
                let tileL = layer.getTile(x - 1, y);
                let tileR = layer.getTile(x + 1, y);
                let tileBL = layer.getTile(x - 1, y + 1);
                let tileB = layer.getTile(x, y + 1);
                let tileBR = layer.getTile(x + 1, y + 1);

                if (tileT === null && tileL === null) {
                    layer.addTile(x, y, this.ground.innerTL);
                }
                if (tileT === null && tileR === null) {
                    layer.addTile(x, y, this.ground.innerTR);
                }
                if (tileB === null && tileL === null) {
                    layer.addTile(x, y, this.ground.innerBL);
                }
                if (tileB === null && tileR === null) {
                    layer.addTile(x, y, this.ground.innerBR);
                }
                if (tileT === null && tileL !== null && tileR !== null) {
                    layer.addTile(x, y, this.ground.innerT);
                }
                if (tileB === null && tileL !== null && tileR !== null) {
                    layer.addTile(x, y, this.ground.innerB);
                }
                if (tileL === null && tileT !== null && tileB !== null) {
                    layer.addTile(x, y, this.ground.innerL);
                }
                if (tileR === null && tileT !== null && tileB !== null) {
                    layer.addTile(x, y, this.ground.innerR);
                }
                if (tileT !== null && tileR !== null && tileB !== null && tileL !== null) {
                    if (tileTL !== null && tileTR !== null && tileBR !== null && tileBL === null) {
                        layer.addTile(x, y, this.ground.outerTR);
                    } else if (tileTL !== null && tileTR !== null && tileBR === null && tileBL !== null) {
                        layer.addTile(x, y, this.ground.outerTL);
                    } else if (tileTL !== null && tileTR === null && tileBR !== null && tileBL !== null) {
                        layer.addTile(x, y, this.ground.outerBL);
                    } else if (tileTL === null && tileTR !== null && tileBR !== null && tileBL !== null) {
                        layer.addTile(x, y, this.ground.outerBR);
                    } else {
                        layer.addTile(x, y, this.ground.inner);
                    }
                }
            }
        });
    }
}