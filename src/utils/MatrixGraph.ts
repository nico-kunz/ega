import { Edges, Nodes } from "v-network-graph";

export class MatrixGraph {
    capacity: number[][];
    flow: number[][];
    height: number[];
    seen: number[];
    excess: number[];
    excessVerts: number[];
    n: number;

    constructor(nodesRef: Nodes, edgesRef: Edges) {
        this.n = Object.keys(nodesRef).length
        this.flow = fill2DArray(this.n, 0)
        this.capacity = fill2DArray(this.n, 0)
        this.height = Array(this.n).fill(0)
        this.excess = Array(this.n).fill(0)
        this.excessVerts = []
        this.seen = Array(this.n).fill(0)

        for (const edgeId in edgesRef) {
            const edge = edgesRef[edgeId]
            this.capacity[parseInt(edge.source)-1][parseInt(edge.target)-1] = parseInt(edge.label)
        }
    }
}

function fill2DArray(size: number, value: number) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => value))
}