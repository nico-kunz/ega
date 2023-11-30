import { Edge, Edges, Layouts, Nodes } from "v-network-graph";
import { Coordinate, RectangleSize, EdgePositions } from "./types";


/**
 * Generates a random max-flow problem graph with maximal planarity and strong connectivity.
 */
export function makeRandomMaxFlowGraph(numberOfNodes: number, maxCapacity: number, squareSize: RectangleSize, radius = 16) {
    const nodes: Nodes = {};
    const layout: Layouts = { nodes: {} };
    const coords = getRandomNodes(numberOfNodes, squareSize, radius);
    for (let i = 0; i < coords.length; i++) {
        const newNode = `${i + 1}`;
        nodes[newNode] = { name: newNode };
        layout.nodes[newNode] = { x: coords[i].x, y: coords[i].y };
    }

    const edges = makeEdges(layout, maxCapacity)

    return {
        nodes: nodes,
        layout: layout,
        edges: edges
    }
}

function makeEdges(layout: Layouts, maxCapacity: number) {
    // get dictionary for all node pairs and their distance
    const distances = getDistancesSorted(layout);
    const edges: Edges = {};


    // add edge from start node to random node 
    const startNode = Object.keys(layout.nodes)[0];
    const endNode = Object.keys(layout.nodes)[1];
    edges[`${startNode}-${endNode}`] = { source: startNode, target: endNode, label: Math.floor(Math.random() * maxCapacity) + 1 };

    // add edge from end node to random node
    const endNode2 = Object.keys(layout.nodes)[2];
    edges[`${endNode}-${endNode2}`] = { source: endNode, target: endNode2, label: Math.floor(Math.random() * maxCapacity) + 1 };
    


    // connect closest nodes
    for (const elem of distances) {
        const [n1, n2] = elem[0].split(",");
        // check if edge would intersect
        const edge = { source: n1, target: n2 };
        const edgePositions = getEdgePositions(layout, edge);
        
        // check if edge intersects with any other edge
        const intersects = Object.values(edges).some(e => {
            const ePos = getEdgePositions(layout, e);
            return intersectsLine(ePos, edgePositions);
        });
        
        if (intersects)
            continue;


        edges[`${n1}-${n2}`] = { source: n1, target: n2, label: Math.floor(Math.random() * maxCapacity) + 1 };
    }


    return edges;
}

function intersectsLine(a: EdgePositions, b: EdgePositions): boolean {
    const p1 = {x: a.x1, y: a.y1};
    const p2 = {x: a.x2, y: a.y2};
    const p3 = {x: b.x1, y: b.y1};
    const p4 = {x: b.x2, y: b.y2};
    const ccw = (p1: Coordinate, p2: Coordinate, p3: Coordinate) => {
        return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
    }

    return ccw(p1,p3,p4) !== ccw(p2,p3,p4) && ccw(p1,p2,p3) !== ccw(p1,p2,p4);
}

function getEdgePositions(layout: Layouts, edge: Edge): {x1: number, y1: number, x2: number, y2: number} {
    const source = layout.nodes[edge.source];
    const target = layout.nodes[edge.target];
    return {x1: source.x, y1: source.y, x2: target.x, y2: target.y};
}

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
 * @returns List of node pairs.
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
export function getRandomNodes(n: number, squareSize: RectangleSize, radius = 16) : Coordinate[] {
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
function getRandomCoordinate(squareSize: RectangleSize, radius: number) : Coordinate {
    // get random coordinates, center of square is 0,0
    const x = getRandomArbitrary(-squareSize.width/2 + radius, squareSize.width/2 - radius);
    const y = getRandomArbitrary(-squareSize.height/2 + radius, squareSize.height/2 - radius);
    return {x: x, y: y};
}


function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}