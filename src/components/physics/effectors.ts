import { debug } from "../../kaplay";
import { Vec2 } from "../../math";
import type { Comp, GameObj } from "../../types";
import type { PosComp } from "../transform";
import type { AreaComp } from "./area";
import type { BodyComp } from "./body";

export type SurfaceEffectorCompOpt = {
    speed: number;
    speedVariation?: number;
    forceScale?: number;
};

export interface SurfaceEffectorComp extends Comp {
    speed: number;
    speedVariation: number;
    forceScale: number;
}

export function surfaceEffector(
    opts: SurfaceEffectorCompOpt,
): SurfaceEffectorComp {
    return {
        id: "surfaceEffector",
        require: ["area"],
        speed: opts.speed,
        speedVariation: opts.speedVariation ?? 0,
        forceScale: opts.speedVariation ?? 0.1,
        add(this: GameObj<AreaComp | SurfaceEffectorComp>) {
            this.onCollideUpdate((obj, col) => {
                const dir = col?.normal.normal();
                const currentVel = obj.vel.project(dir);
                const wantedVel = dir?.scale(this.speed);
                const force = wantedVel?.sub(currentVel);
                obj.addForce(force?.scale(obj.mass * this.forceScale));
            });
        },
    };
}

export type AreaEffectorCompOpt = {
    useGlobalAngle?: boolean;
    forceAngle: number;
    forceMagnitude: number;
    forceVariation: number;
};

export interface AreaEffectorComp extends Comp {
    useGlobalAngle: boolean;
    forceAngle: number;
    forceMagnitude: number;
    forceVariation: number;
}

export function areaEffector(opts: AreaEffectorCompOpt): AreaEffectorComp {
    return {
        id: "areaEffector",
        require: ["area"],
        useGlobalAngle: opts.useGlobalAngle || false,
        forceAngle: opts.forceAngle,
        forceMagnitude: opts.forceMagnitude,
        forceVariation: opts.forceVariation ?? 0,
        add(this: GameObj<AreaComp | AreaEffectorComp>) {
            this.onCollideUpdate((obj, col) => {
                const dir = Vec2.fromAngle(this.forceAngle);
                const force = dir.scale(this.forceMagnitude);
                obj.addForce(force);
            });
        },
    };
}

export type ForceMode = "constant" | "inverseLinear" | "inverseSquared";

export type PointEffectorCompOpt = {
    forceMagnitude: number;
    forceVariation: number;
    distanceScale?: number;
    forceMode?: ForceMode;
};

export interface PointEffectorComp extends Comp {
    forceMagnitude: number;
    forceVariation: number;
    distanceScale: number;
    forceMode: ForceMode;
}

export function pointEffector(opts: PointEffectorCompOpt): PointEffectorComp {
    return {
        id: "pointEffector",
        require: ["area", "pos"],
        forceMagnitude: opts.forceMagnitude,
        forceVariation: opts.forceVariation ?? 0,
        distanceScale: opts.distanceScale ?? 1,
        forceMode: opts.forceMode || "inverseLinear",
        add(this: GameObj<PointEffectorComp | AreaComp | PosComp>) {
            this.onCollideUpdate((obj, col) => {
                const dir = this.pos.sub(obj.pos);
                const length = dir.len();
                const distance = length * this.distanceScale / 10;
                const forceScale = this.forceMode === "constant"
                    ? 1
                    : this.forceMode === "inverseLinear"
                    ? 1 / distance
                    : 1 / distance ** 2;
                const force = dir.scale(
                    this.forceMagnitude * forceScale / length,
                );
                obj.addForce(force);
            });
        },
    };
}

export type ConstantForceCompOpt = {
    force?: Vec2;
};

export interface ConstantForceComp extends Comp {
    force?: Vec2;
}

export function constantForce(opts: ConstantForceCompOpt): ConstantForceComp {
    return {
        id: "constantForce",
        require: ["body"],
        force: opts.force,
        update(this: GameObj<BodyComp | ConstantForceComp>) {
            if (this.force) {
                this.addForce(this.force);
            }
        },
    };
}
