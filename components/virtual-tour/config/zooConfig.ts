type EnclousurePosition = [number, number, number]

export type EnclousureBounds = {
    minX: number
    maxX: number
    minZ: number
    maxZ: number
}

const width = 31
const height = 10
const depth = 31
const enclousureSize = 9 // it's a square, so only one value is needed

const penguinEnclousurePosition: EnclousurePosition = [-7, 0, -7]
const pandaEnclousurePosition: EnclousurePosition = [7, 0, 7]
const lionEnclousurePosition: EnclousurePosition = [7, 0, -7]
const elephantEnclousurePosition: EnclousurePosition = [-7, 0, 7]

const enclousureHalfSize = enclousureSize / 2
const worldHalfWidth = width / 2
const worldHalfDepth = depth / 2

function createEnclousureBounds(position: EnclousurePosition): EnclousureBounds {
    return {
        minX: position[0] - enclousureHalfSize,
        maxX: position[0] + enclousureHalfSize,
        minZ: position[2] - enclousureHalfSize,
        maxZ: position[2] + enclousureHalfSize,
    }
}

const zooConfig = {
    width,
    height,
    depth,
    worldHalfWidth,
    worldHalfDepth,
    penguinEnclousurePosition,
    pandaEnclousurePosition,
    lionEnclousurePosition,
    elephantEnclousurePosition,
    enclousureSize,
    enclousureHalfSize,
    penguinEnclousureBounds: createEnclousureBounds(penguinEnclousurePosition),
    pandaEnclousureBounds: createEnclousureBounds(pandaEnclousurePosition),
    lionEnclousureBounds: createEnclousureBounds(lionEnclousurePosition),
    elephantEnclousureBounds: createEnclousureBounds(elephantEnclousurePosition),
}

export default zooConfig
