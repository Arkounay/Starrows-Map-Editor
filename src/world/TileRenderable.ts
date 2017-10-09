import {Tile} from "./Tile";
import {TileType} from "../editor/tileset/TileType";
import {Tileset} from "../editor/tileset/Tileset";
import {TilesetFamily} from "../editor/tileset/TilesetFamily";

export class TileRenderable extends Tile {
    public type: TileType;
    public readonly tilesetX: number;
    public readonly tilesetY: number;
    family: TilesetFamily;

    constructor(tilesetX: number, tilesetY: number, type: TileType, family: TilesetFamily) {
        super(0, 0);
        this.tilesetX = tilesetX;
        this.tilesetY = tilesetY;
        this.type = type;
        this.family = family;
    }

    public draw(ctx: CanvasRenderingContext2D, tileset: Tileset) {
        tileset.drawTile(ctx, this.tilesetX, this.tilesetY, this.x / Tile.SIZE, this.y / Tile.SIZE);
    }

}