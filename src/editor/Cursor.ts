import {MouseState} from "./MouseState";
import Vector from "../math/Vector";
import {World} from "../world/World";
import {Tile} from "../world/Tile";
import {Camera} from "./Camera";
import {editor} from "../index";

export class Cursor {
    public readonly lastClick = new Vector();
    public readonly lastTranslate = new Vector();
    public readonly position = new Vector();
    public readonly worldPosition = new Vector();
    public state = MouseState.None;
    private lastTilePosition = new Vector();

    addEvents(world: World, canvas: HTMLCanvasElement, camera: Camera): void {
        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0 ) {
                this.state = MouseState.Drawing;
                this.onMouseMove(e, camera, canvas, world);
            }
            if (e.button === 1) {
                this.state = MouseState.Scrolling;
                this.lastClick.set(e.x / camera.zoom, e.y / camera.zoom);
            }
        });
        canvas.addEventListener('mouseup', (e) => {
            this.state = MouseState.None;
            this.lastTranslate.set(camera.position.x, camera.position.y);
        });
        canvas.addEventListener('wheel', (e) => {
            let hasChanged = false;
            if (e.deltaY < 0 && camera.zoom < 2) {
                // allow zoom in
                camera.zoom += .25;
                hasChanged = true;
            } else if (e.deltaY > 0 && camera.zoom > .5) {
                // allow zoom out
                camera.zoom -= .25;
                hasChanged = true;
            }
            if (hasChanged) {
                let offset = canvas.getBoundingClientRect();
                camera.position.add((-e.clientX + offset.left + (this.worldPosition.x - camera.position.x) / camera.zoom), (-e.clientY + offset.top + (this.worldPosition.y - camera.position.y) / camera.zoom));
                this.lastTranslate.set(camera.position.x, camera.position.y);

                editor.draw();
            }
        });
        canvas.addEventListener('mousemove', (e) => {
            this.onMouseMove(e, camera, canvas, world);
        });

    }

    private onMouseMove(e: MouseEvent, camera: Camera, canvas: HTMLCanvasElement, world: World) {
        this.position.set(e.x / camera.zoom, e.y / camera.zoom);
        let offset = canvas.getBoundingClientRect();
        this.worldPosition.x = (e.clientX - camera.position.x * camera.zoom - offset.left ) / camera.zoom;
        this.worldPosition.y = (e.clientY - camera.position.y * camera.zoom - offset.top ) / camera.zoom;
        let tileX = Math.trunc(this.worldPosition.x / Tile.SIZE);
        let tileY = Math.trunc(this.worldPosition.y / Tile.SIZE);

        switch (this.state) {
            case MouseState.None:
                Cursor.updateSelectedTile(tileX, tileY, world);
                break;

            case MouseState.Scrolling:
                camera.position.set(this.position.x - this.lastClick.x + this.lastTranslate.x, this.position.y - this.lastClick.y + this.lastTranslate.y);
                break;

            case MouseState.Drawing:
                Cursor.updateSelectedTile(tileX, tileY, world);
                let isNewTile = tileX !== this.lastTilePosition.x || tileY !== this.lastTilePosition.y;
                this.lastTilePosition.set(tileX, tileY);
                if (isNewTile && tileX >= 0 && tileX < world.grid.width && tileY >= 0 && tileY < world.grid.height) {
                    editor.addTile(tileX, tileY);
                }
                break;
        }

        editor.draw();
    }

    private static updateSelectedTile(tileX: number, tileY: number, world: World) {
        if (tileX >= 0 && tileX < world.grid.width && tileY >= 0 && tileY < world.grid.height) {
            let tile = world.grid.tiles[tileX][tileY];
            world.grid.map(function (tile) {
                tile.isSelected = false;
            });
            tile.isSelected = true;
        }
    }
}