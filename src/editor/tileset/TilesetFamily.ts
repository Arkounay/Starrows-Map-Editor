import {Tile} from "../../world/Tile";
import Vector from "../../math/Vector";
import {TileType} from "./TileType";
import {TileRenderable} from "../../world/TileRenderable";

export class TilesetFamily {
    public inner: TileRenderable;
    public innerTL: TileRenderable;
    public innerT: TileRenderable;
    public innerTR: TileRenderable;
    public innerL: TileRenderable;
    public innerR: TileRenderable;
    public innerBL: TileRenderable;
    public innerB: TileRenderable;
    public innerBR: TileRenderable;
    public outerTL: TileRenderable;
    public outerTR: TileRenderable;
    public outerBL: TileRenderable;
    public outerBR: TileRenderable;

    public hydrateFromInner(x: number, y: number): void {
        this.innerTL = new TileRenderable(x - 1, y - 1, TileType.InnerTL);
        this.innerT = new TileRenderable(x, y - 1, TileType.InnerT);
        this.innerTR = new TileRenderable(x + 1, y - 1, TileType.InnerTR);
        this.innerL = new TileRenderable(x - 1, y, TileType.InnerL);
        this.inner = new TileRenderable(x, y, TileType.Inner);
        this.innerR = new TileRenderable(x + 1, y, TileType.InnerR);
        this.innerBL = new TileRenderable(x - 1, y + 1, TileType.InnerBL);
        this.innerB = new TileRenderable(x, y + 1, TileType.InnerB);
        this.innerBR = new TileRenderable(x + 1, y + 1, TileType.InnerBR);
    }

    public hydrateFromOuterLeft(x: number, y: number): void {
        this.outerTL = new TileRenderable(x, y, TileType.OuterTL);
        this.outerTR = new TileRenderable(x + 1, y, TileType.OuterTR);
        this.outerBL = new TileRenderable(x, y + 1, TileType.OuterBL);
        this.outerBR = new TileRenderable(x + 1, y + 1, TileType.OuterBR);
    }

}