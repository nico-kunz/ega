import { Edges, Layouts, Nodes } from "v-network-graph";
import { Coordinate, RectangleSize } from "./types";
import { distance, getEdgePositions, getNodePairs, getRandomCoordinate, intersectsLine } from "./utils";

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
            console.log(edge, e)
            const test = intersectsLine(edgePositions, ePos);
            console.log("intersects", test)
            return test
        });
        
            
        if (intersects)
            continue;


        edges[`${n1}-${n2}`] = { source: n1, target: n2, label: Math.floor(Math.random() * maxCapacity) + 1 };
    }

    return edges;
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