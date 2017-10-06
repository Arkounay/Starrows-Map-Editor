import {Tile} from "./Tile";
import {TileRenderable} from "./TileRenderable";
import {TileType} from "../editor/tileset/TileType";
import {editor} from "../index";

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
        let tileToAdd = new TileRenderable(tile.tilesetX, tile.tilesetY, tile.type);
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

    public getTile(x: number, y:number): TileRenderable {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.tiles[x][y];
        }
        return null;
    }

}