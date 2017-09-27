export abstract class Tile {
    static readonly SIZE = 24;

    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

}