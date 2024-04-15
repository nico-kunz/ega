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
 * Checks if two line segments intersect. Algorithm from https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment, last access 16.04.2024
 * @param line1 The first line segement.
 * @param line2 The second line segment.
 * @returns True if the lines intersect, false otherwise.
 */
export function intersectsLine(line1: EdgePositions, line2: EdgePositions) : boolean {
    const t1 = (line1.x1 - line2.x1)*(line2.y1 - line2.y2) - (line1.y1 - line2.y1)*(line2.x1 - line2.x2);
    const t2 = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2)*(line2.x1 - line2.x2);

    const t = t1/t2;
    if(t < 0 || t > 1) 
        return false;

    const u1 = (line1.x1 - line1.x2) * (line1.y1 - line2.y1) - (line1.y1 - line1.y2) * (line1.x1 - line2.x1);
    const u2 = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2)

    const u = -1 * (u1/u2)

    if(u < 0 || u > 1)
        return false;

    return true
}