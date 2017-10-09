import {Tile} from "./Tile";
import {TileRenderable} from "./TileRenderable";
import {TileType} from "../editor/tileset/TileType";
import {editor} from "../index";
import {TilesetFamily} from "../editor/tileset/TilesetFamily";

export class Layer {
    private tiles: TileRenderable[][];
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        for (let x = 0; x < width; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < height; y++) {
                this.tiles[x][y] = null;
            }
        }
    }

    public addTile(tileX: number, tileY: number, tile: TileRenderable): void {
        let tileToAdd = new TileRenderable(tile.tilesetX, tile.tilesetY, tile.type, tile.family);
        tileToAdd.x = tileX * Tile.SIZE;
        tileToAdd.y = tileY * Tile.SIZE;
        this.tiles[tileX][tileY] = tileToAdd;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.map(function (tile) {
            tile.draw(ctx, editor.tileset);
        });
    }

    public map(callback: (tile: TileRenderable, x: number, y: number) => void) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.tiles[x][y] !== null) {
                    callback(this.tiles[x][y], x, y);
                }
            }
        }
    }

    public getFamilyTile(x: number, y:number, family: TilesetFamily): TileRenderable {
        // change x/y to be able to fill the map
        if (x < 0) {
            x = 1;
        }
        if (y < 0) {
            y = 1;
        }
        if (x >= this.width) {
            x = this.width - 1;
        }
        if (y >= this.height) {
            y = this.height - 1;
        }
        if (this.tiles[x][y] !== null && this.tiles[x][y].family === family) {
            return this.tiles[x][y];
        }
        return null;
    }

}