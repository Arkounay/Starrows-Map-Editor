import {Layer} from "./Layer";
import {Tile} from "./Tile";
import {Grid} from "./Grid";
import {Tileset} from "../editor/tileset/Tileset";
import {TilesetFamily} from "../editor/tileset/TilesetFamily";
import Vector from "../math/Vector";

export class World {
    private _width: number;
    private _height: number;
    private layers: Layer[] = [];
    private _grid: Grid;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this.layers.push(new Layer(width, height));
        this._grid = new Grid(width, height);
    }

    public getLayers() : Layer[] {
        return this.layers;
    }

    public draw(ctx: CanvasRenderingContext2D) {

        this.layers[0].draw(ctx);
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(0, 0, 0, .75)';
        ctx.beginPath();
        for (let i = 0; i <= this.grid.height * Tile.SIZE; i+= Tile.SIZE) {
            ctx.moveTo(0, i);
            ctx.lineTo(this.grid.width * Tile.SIZE, i);
        }
        for (let i = 0; i <= this.grid.width * Tile.SIZE; i+= Tile.SIZE) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.grid.height * Tile.SIZE);
        }
        ctx.stroke();

        this.grid.map(function(tile){
            if (tile.isSelected) {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(0, 0, 255, .15)';
                ctx.setLineDash([3, 5]);
                ctx.fillRect(tile.x, tile.y, Tile.SIZE, Tile.SIZE);
                ctx.stroke();
            }
        });

    }


    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get grid(): Grid {
        return this._grid;
    }

}