import {World} from "../world/World";
import {Tile} from "../world/Tile";
import {Camera} from "./Camera";
import {TilesetFamily} from "./tileset/TilesetFamily";
import {Cursor} from "./Cursor";
import {Tileset} from "./tileset/Tileset";
import {TileRenderable} from "../world/TileRenderable";
import {TileType} from "./tileset/TileType";

export class Editor {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private cursor = new Cursor();
    private camera = new Camera();
    private world = new World(32, 32);
    private families: TilesetFamily[] = [];

    public readonly tileset: Tileset;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = canvas.getContext('2d');

        // center map
        this.camera.position.x = this.canvas.width / 2 - this.world.width * Tile.SIZE / 2;
        this.camera.position.y = this.canvas.height / 2 - this.world.height * Tile.SIZE / 2;
        this.cursor.lastTranslate.set(this.camera.position.x, this.camera.position.y);

        this.cursor.addEvents(this.world, canvas, this.camera);

        let groundFamily = new TilesetFamily;
        groundFamily.hydrateFromInner(16, 3);
        groundFamily.hydrateFromOuterLeft(16, 0);

        let cliffFamily = new TilesetFamily;
        cliffFamily.hydrateFromInner(1, 1);
        cliffFamily.hydrateFromInnerExtraBottom(1, 1);
        cliffFamily.hydrateFromOuterLeftInverse(3, 0);

        this.families.push(groundFamily);
        this.families.push(cliffFamily);

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

        let groundFamily = this.families[0];

        let layer = this.world.getLayers()[0];
        layer.addTile(tileX , tileY, groundFamily.inner);

        if (canDrawTop) {
            // TODO : generic tiles
            layer.addTile(tileX, tileY - 1, groundFamily.innerT);
            if (canDrawLeft) {
                layer.addTile(tileX - 1, tileY - 1, groundFamily.innerTL);
            }
            if (canDrawRight) {
                layer.addTile(tileX + 1, tileY - 1, groundFamily.innerTR);
            }
        }

        if (canDrawLeft) {
            layer.addTile(tileX - 1, tileY, groundFamily.innerL);
            if (canDrawBottom) {
                layer.addTile(tileX - 1, tileY + 1, groundFamily.innerBL);
            }
        }

        if (canDrawRight) {
            layer.addTile(tileX + 1, tileY, groundFamily.innerR);
            if (canDrawBottom) {
                layer.addTile(tileX + 1, tileY + 1, groundFamily.innerBR);
            }
        }

        if (canDrawBottom) {
            layer.addTile(tileX , tileY + 1, groundFamily.innerB);
        }

        layer.map((tile: TileRenderable, x: number, y: number) => {
            for (let family of this.families) {
                if (tile !== null && tile.family === family) {
                    let tileTL = layer.getFamilyTile(x - 1, y - 1, family);
                    let tileT = layer.getFamilyTile(x, y - 1, family);
                    let tileTR = layer.getFamilyTile(x + 1, y - 1, family);
                    let tileL = layer.getFamilyTile(x - 1, y, family);
                    let tileR = layer.getFamilyTile(x + 1, y, family);
                    let tileBL = layer.getFamilyTile(x - 1, y + 1, family);
                    let tileB = layer.getFamilyTile(x, y + 1, family);
                    let tileBR = layer.getFamilyTile(x + 1, y + 1, family);

                    if (tileT === null) {
                        if (tileL !== null && tileR !== null) {
                            layer.addTile(x, y, family.innerT);
                        }
                        if (tileL === null) {
                            layer.addTile(x, y, family.innerTL);
                        }
                        if (tileR === null) {
                            layer.addTile(x, y, family.innerTR);
                        }
                    }
                    if (tileB === null) {
                        if (tileL !== null && tileR !== null) {
                            layer.addTile(x, y, family.innerB);
                        }
                        if (tileL === null) {
                            layer.addTile(x, y, family.innerBL);
                        }
                        if (tileR === null) {
                            layer.addTile(x, y, family.innerBR);
                        }
                    }
                    if (tileT !== null && tileB !== null) {
                        if (tileL === null) {
                            layer.addTile(x, y, family.innerL);
                        }
                        if (tileR === null) {
                            layer.addTile(x, y, family.innerR);
                        }
                    }
                    if (tileT !== null && tileR !== null && tileB !== null && tileL !== null) {
                        if (tileTL !== null && tileTR !== null && tileBR !== null && tileBL === null) {
                            layer.addTile(x, y, family.outerTR);
                        } else if (tileTL !== null && tileTR !== null && tileBR === null && tileBL !== null) {
                            layer.addTile(x, y, family.outerTL);
                        } else if (tileTL !== null && tileTR === null && tileBR !== null && tileBL !== null) {
                            layer.addTile(x, y, family.outerBL);
                        } else if (tileTL === null && tileTR !== null && tileBR !== null && tileBL !== null) {
                            layer.addTile(x, y, family.outerBR);
                        } else {
                            layer.addTile(x, y, family.inner);
                        }
                    }
                    /*if (family.hasExtraBottom()) {
                        let tileExtraTL = layer.getFamilyTile(x - 1, y - 2, family);
                        let tileExtraT = layer.getFamilyTile(x, y - 2, family);
                        let tileExtraTR = layer.getFamilyTile(x + 1, y - 2, family);
                        let tileExtraBL = layer.getFamilyTile(x - 1, y + 2, family);
                        let tileExtraB = layer.getFamilyTile(x, y + 2, family);
                        let tileExtraBR = layer.getFamilyTile(x + 1, y + 2, family);

                        if (tileB !== null && tileExtraB === null) {
                            if (tileL !== null && tileR !== null) {
                                layer.addTile(x, y, family.innerB);
                            }
                            if (tileL === null) {
                                layer.addTile(x, y, family.innerBL);
                            }
                            if (tileR === null) {
                                layer.addTile(x, y, family.innerBR);
                            }
                        }
                    }*/
                }
            }
        });
    }
}