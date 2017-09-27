import {Tile} from "../../world/Tile";

export class Tileset {
    public img: HTMLImageElement;

    constructor(imgPath: string) {
        this.img = new Image();
        this.img.src = imgPath;
    }

    public drawTile(ctx: CanvasRenderingContext2D, tileX: number, tileY: number, x: number, y: number) {
        ctx.drawImage(this.img, tileX * Tile.SIZE, tileY * Tile.SIZE, Tile.SIZE, Tile.SIZE, x * Tile.SIZE, y * Tile.SIZE, Tile.SIZE, Tile.SIZE);
    }
}