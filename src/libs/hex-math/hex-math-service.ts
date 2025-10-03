import {Injectable} from '@angular/core';
const SQRT3 = Math.sqrt(3);

export type Axial = { q: number; r: number };
export type Cube = { x: number; y: number; z: number };

@Injectable({providedIn: 'root'})
export class HexMathService {
  axialToPixel(a: Axial, size: number) {
    const x = size * (SQRT3 * a.q + (SQRT3 / 2) * a.r);
    const y = size * (3 / 2) * a.r;
    return { x, y };
  }
  pixelToAxial(x: number, y: number, size: number): Axial {
    const q = (SQRT3 / 3 * x - 1 / 3 * y) / size;
    const r = (2 / 3 * y) / size;
    return this.cubeToAxial(this.cubeRound(this.axialToCube({ q, r })));
  }
  axialToCube(a: Axial): Cube { return { x: a.q, z: a.r, y: -a.q - a.r }; }
  cubeToAxial(c: Cube): Axial { return { q: c.x, r: c.z }; }
  cubeRound(c: Cube): Cube {
    let rx = Math.round(c.x), ry = Math.round(c.y), rz = Math.round(c.z);
    const dx = Math.abs(rx - c.x), dy = Math.abs(ry - c.y), dz = Math.abs(rz - c.z);
    if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
    return { x: rx, y: ry, z: rz };
  }
  hexKey(a: Axial) { return `${a.q}:${a.r}`; }
}
