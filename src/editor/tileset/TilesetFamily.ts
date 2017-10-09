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

    public extraInnerBL: TileRenderable;
    public extraInnerB: TileRenderable;
    public extraInnerBR: TileRenderable;

    public hydrateFromInner(x: number, y: number): void {
        this.innerTL = new TileRenderable(x - 1, y - 1, TileType.InnerTL, this);
        this.innerT = new TileRenderable(x, y - 1, TileType.InnerT, this);
        this.innerTR = new TileRenderable(x + 1, y - 1, TileType.InnerTR, this);
        this.innerL = new TileRenderable(x - 1, y, TileType.InnerL, this);
        this.inner = new TileRenderable(x, y, TileType.Inner, this);
        this.innerR = new TileRenderable(x + 1, y, TileType.InnerR, this);
        this.innerBL = new TileRenderable(x - 1, y + 1, TileType.InnerBL, this);
        this.innerB = new TileRenderable(x, y + 1, TileType.InnerB, this);
        this.innerBR = new TileRenderable(x + 1, y + 1, TileType.InnerBR, this);
    }

    public hydrateFromInnerExtraBottom(x: number, y: number): void {
        this.extraInnerBL = new TileRenderable(x - 1, y + 2, TileType.InnerBL, this);
        this.extraInnerB = new TileRenderable(x, y + 2, TileType.InnerB, this);
        this.extraInnerBR = new TileRenderable(x + 1, y + 2, TileType.InnerBR, this);
    }

    public hydrateFromOuterLeft(x: number, y: number): void {
        this.outerTL = new TileRenderable(x, y, TileType.OuterTL, this);
        this.outerTR = new TileRenderable(x + 1, y, TileType.OuterTR, this);
        this.outerBL = new TileRenderable(x, y + 1, TileType.OuterBL, this);
        this.outerBR = new TileRenderable(x + 1, y + 1, TileType.OuterBR, this);
    }

    public hydrateFromOuterLeftInverse(x: number, y: number): void {
        this.outerTL = new TileRenderable(x + 1, y + 1, TileType.OuterTL, this);
        this.outerTR = new TileRenderable(x, y + 1, TileType.OuterTR, this);
        this.outerBL = new TileRenderable(x + 1, y, TileType.OuterBL, this);
        this.outerBR = new TileRenderable(x, y, TileType.OuterBR, this);
    }

    public hasExtraBottom(): boolean {
        return this.extraInnerB !== null;
    }

}