import {MouseState} from "./MouseState";
import Vector from "../math/Vector";
import {World} from "../world/World";
import {Tile} from "../world/Tile";
import {Camera} from "./Camera";
import {TilesetFamily} from "./tileset/TilesetFamily";
import {Cursor} from "./Cursor";
import {Tileset} from "./tileset/Tileset";

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

        this.world.getLayers()[0].addTile(tileX , tileY, this.ground.inner);

        if (canDrawTop) {
            this.world.getLayers()[0].addTile(tileX, tileY - 1, this.ground.innerT);
            if (canDrawLeft) {
                this.world.getLayers()[0].addTile(tileX - 1, tileY - 1, this.ground.innerTL);
            }
            if (canDrawRight) {
                this.world.getLayers()[0].addTile(tileX + 1, tileY - 1, this.ground.innerTR);
            }
        }

        if (canDrawLeft) {
            this.world.getLayers()[0].addTile(tileX - 1, tileY, this.ground.innerL);
            if (canDrawBottom) {
                this.world.getLayers()[0].addTile(tileX - 1, tileY + 1, this.ground.innerBL);
            }
        }

        if (canDrawRight) {
            this.world.getLayers()[0].addTile(tileX + 1, tileY, this.ground.innerR);
            if (canDrawBottom) {
                this.world.getLayers()[0].addTile(tileX + 1, tileY + 1, this.ground.innerBR);
            }
        }

        if (canDrawBottom) {
            this.world.getLayers()[0].addTile(tileX , tileY + 1, this.ground.innerB);
        }
    }
}