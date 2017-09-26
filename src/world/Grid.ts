import {EditorTile} from "../editor/EditorTile";
import {Tile} from "./Tile";

export class Grid {
    public readonly width: number;
    public readonly height: number;
    private _tiles: EditorTile[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this._tiles = [];
        for (let x = 0; x < width; x++) {
            this._tiles[x] = [];
            for (let y = 0; y < height; y++) {
                this._tiles[x][y] = new EditorTile(x * Tile.SIZE, y * Tile.SIZE);
            }
        }
    }

    map (callback: (tile: EditorTile, x: number, y: number) => void) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(this.tiles[x][y], x, y);
            }
        }
    }

    get tiles(): EditorTile[][] {
        return this._tiles;
    }

}