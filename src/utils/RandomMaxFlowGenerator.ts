import { Layouts, Nodes } from "v-network-graph";

interface Size {
    width: number;
    height: number;
}

interface Coordinate {
    x: number;
    y: number;
}

/**
 * Generates a random max-flow problem graph with maximal planarity and strong connectivity.
 */
/**
 * Calculate the euclidean distance between two coordinates.
 * @param c1 
 * @param c2 
 * @returns The euclidean distance between the two coordinates.
 */
function distance(c1: Coordinate, c2: Coordinate) {
    return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
}

/**
 * Get all possible node pairs (without duplicates) sorted by their distance.
 * @param layout Layout containing nodes and their coordinates.
 * @returns Sorted Array of node pairs ("x,y") and their distance
 */
function getDistancesSorted(layout: Layouts) {
    // make all node pairs
    const nodePairs = getNodePairs(Object.keys(layout.nodes));
    
    // get distance for each node pair
    const distances: Record<string, number> = {};
    for (const pair of nodePairs) {
        distances[pair.join(",")] = distance(layout.nodes[pair[0]], layout.nodes[pair[1]]);
    }

    // sort by distance
    const sorted = Object.entries(distances).sort((a, b) => a[1] - b[1]);

    console.log("Node pairs sorted by distance:", sorted);
    return sorted;
}

/**
 * Get all node pairs from a list of nodes, without repetition.
 * @param nodes List of nodeids.
 * @returns List of (n choose k) node pairs.
 */
function getNodePairs(nodes: string[]) {
    const pairs: [string, string][] = [];

    for (let i = 0; i < nodes.length; i++) {
        for(let j = i+1; j < nodes.length; j++) {
            pairs.push([nodes[i], nodes[j]]);
        }
    }

    // should result in n choose k pairs (choose k items from n without repetition and without order)
    console.log(pairs);
    return pairs;
}

/**
 * Get `n` random coordinates in a square of size `squareSize`.
 * @param n Number of coordinates to generate.
 * @param squareSize Size of the square, limits the max value of the coordinates.
 * @param radius Radius of a node to be considered.
 * @returns Array of n node coordinates in the square.
 */
export function getRandomNodes(n: number, squareSize: Size, radius = 16) : Coordinate[] {
    const coordinates: Coordinate[] = [];
    const maxAttempts = 1000;
    let attempts = 0;

    const distance = (c1: Coordinate, c2: Coordinate) => Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));

    while (coordinates.length < n && attempts < maxAttempts) {
        const coordinate = getRandomCoordinate(squareSize, radius*3);
        if (coordinates.every(c => distance(c, coordinate) > radius * 3)) {
            coordinates.push(coordinate);
        }
        attempts++;
    }

    if (attempts === maxAttempts) {
        console.error("Could not generate random coordinates without intersection.");
    }

    return coordinates;
}

/**
 * Get random coordinate in a square of size `squareSize` considering 'radius' of the node.
 * @param squareSize Size of the square, limits the max value of the coordinates.
 * @param radius Radius of a node to be considered.
 * @returns Random coordinate in the square.
 */
function getRandomCoordinate(squareSize: Size, radius: number) : Coordinate {
    // get random coordinates, center of square is 0,0
    const x = getRandomArbitrary(-squareSize.width/2 + radius, squareSize.width/2 - radius);
    const y = getRandomArbitrary(-squareSize.height/2 + radius, squareSize.height/2 - radius);
    return {x: x, y: y};
}


function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}