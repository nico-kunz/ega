import { Edge, Layouts } from "v-network-graph";
import { Coordinate, EdgePositions, RectangleSize } from "./types";

/**
 * Calculate the euclidean distance between two coordinates.
 * @param c1 
 * @param c2 
 * @returns The euclidean distance between the two coordinates.
 */
export function distance(c1: Coordinate, c2: Coordinate) {
    return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
}

/**
 * Return the x and y coordinates of both ends of a given edge.
 * @param layout Layout containing the nodes and edges.
 * @param edge Edge containing the source and target node.
 * @returns Object containing the x and y coordinates of both ends of the edge. 
 */
export function getEdgePositions(layout: Layouts, edge: Edge): {x1: number, y1: number, x2: number, y2: number} {
    const source = layout.nodes[edge.source];
    const target = layout.nodes[edge.target];
    return {x1: source.x, y1: source.y, x2: target.x, y2: target.y};
}

/**
 * Get random coordinate in a square of size `squareSize` considering 'radius' of the node.
 * @param squareSize Size of the square, limits the max value of the coordinates.
 * @param radius Radius of a node to be considered.
 * @returns Random coordinate in the square.
 */
export function getRandomCoordinate(squareSize: RectangleSize, radius: number) : Coordinate {
    // get random coordinates, center of square is 0,0
    const x = getRandomArbitrary(-squareSize.width/2 + radius, squareSize.width/2 - radius);
    const y = getRandomArbitrary(-squareSize.height/2 + radius, squareSize.height/2 - radius);
    return {x: x, y: y};
}

/**
 * Get random value between min and max.
 * @param min Minimum value.
 * @param max Maximum value.
 * @returns Random number between min and max.
 */
function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

/**
 * Get all node pairs from a list of nodes, without repetition.
 * @param nodes List of nodeids.
 * @returns List of node pairs.
 */
export function getNodePairs(nodes: string[]) {
    const pairs: [string, string][] = [];

    for (let i = 0; i < nodes.length; i++) {
        for(let j = i+1; j < nodes.length; j++) {
            if (i === j) continue;
            pairs.push([nodes[i], nodes[j]]);
        }
    }

    // should result in n choose k pairs (choose k items from n without repetition and without order)
    console.log(pairs);
    return pairs;
}

/**
 * Checks if two edges intersect.
 * @param a The first edge.
 * @param b The second edge.
 * @returns True if the edges intersect, false otherwise.
 */
export function intersectsLine(a: EdgePositions, b: EdgePositions): boolean {
    // check if they are the same edge
    if (edgesEqual(a,b)) return false;

    const p1 = {x: a.x1, y: a.y1};
    const p2 = {x: a.x2, y: a.y2};
    const p3 = {x: b.x1, y: b.y1};
    const p4 = {x: b.x2, y: b.y2};
    const ccw = (p1: Coordinate, p2: Coordinate, p3: Coordinate) => {
        return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
    }

    return ccw(p1,p3,p4) !== ccw(p2,p3,p4) && ccw(p1,p2,p3) !== ccw(p1,p2,p4);
}

/**
 * Checks if two edges are equal.
 * @param e1 The first edge.
 * @param e2 The second edge.
 * @returns True if the edges are equal, false otherwise.
 */
function edgesEqual(e1: EdgePositions, e2: EdgePositions) {
    // check both ways
    return (e1.x1 == e2.x1 && e1.y1 == e2.y1 && e1.x2 == e2.x2 && e1.y2 == e2.y2);
}