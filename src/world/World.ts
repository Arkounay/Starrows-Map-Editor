import {Layer} from "./Layer";
import {Tile} from "./Tile";
import {Grid} from "./Grid";

export class World {
    private _width: number;
    private _height: number;
    private layers: Layer[] = [];
    private _grid: Grid;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this.layers.push(new Layer());
        this._grid = new Grid(width, height);
    }

    public getLayers() : Layer[] {
        return this.layers;
    }

    public draw(ctx: CanvasRenderingContext2D) {

        this.grid.map(function(tile, x, y){
            if (tile.isSelected) {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(0, 0, 255, .15)';
                ctx.setLineDash([3, 5]);
                ctx.fillRect(tile.x, tile.y, Tile.SIZE, Tile.SIZE);
                ctx.stroke();
            }

            ctx.fillStyle="#000000";
            // grid
            ctx.beginPath();
            ctx.setLineDash([3, 5]);
            ctx.moveTo(tile.x, tile.y);
            ctx.lineTo(tile.x + Tile.SIZE, tile.y);
            ctx.lineTo(tile.x + Tile.SIZE, tile.y + Tile.SIZE);
            ctx.lineTo(tile.x, tile.y + Tile.SIZE);
            ctx.stroke();
        });

    }

    get grid(): Grid {
        return this._grid;
    }

}