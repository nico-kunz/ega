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

    const edges = makeEdges(layout, maxCapacity);

    return {
        nodes: nodes,
        layout: layout,
        edges: edges
    }
}

function makeEdges(layout: Layouts, maxCapacity: number) {
    const distances = getDistancesSorted(layout);
    const edges: Edges = {};


    for (const elem of distances) {
        const [n1, n2] = elem[0].split(",");

        const edge = { source: n1, target: n2 };
        const edgePositions = getEdgePositions(layout, edge);

        // check if edge intersects with any other edge
        const intersects = Object.values(edges).some(e => {
            const ePos = getEdgePositions(layout, e);
            //console.log(edge, e)
            
            // check if they both connect the same node
            if(e.source == edge.source || e.source == edge.target || e.target == edge.source || e.target == edge.target) return false;

            return intersectsLine(ePos, edgePositions);
        });

        if(intersects)
            continue

        const numOfNodes = Object.keys(layout.nodes).length
        console.log("LENGTH:" ,numOfNodes)
        const containsStartOrEndNode = n1 == "1" || n1 == String(numOfNodes) || n2 == "1" || n2 == String(numOfNodes)
        const capacity = (false) ? maxCapacity :  Math.floor(Math.random() * maxCapacity) + 1
        edges[`${n1}-${n2}`] = { source: n1, target: n2, label: capacity, flow: 0 };
    }

    console.log(edges)
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

    // number of attempts to generate a coordinate without intersecting another node
    const maxAttempts = 1000;
    let attempts = 0;

    // first coordinate should be to the left of the center
    coordinates.push({x: -squareSize.width/2 + radius*3, y: 0})

    while (coordinates.length < n - 1 && attempts < maxAttempts) {
        const coordinate = getRandomCoordinate(squareSize, radius*3);
        if (coordinates.every(c => distance(c, coordinate) > radius * 3)) {
            coordinates.push(coordinate);
        }
        attempts++;
    }
    
    // last coordinate should be to the right of the center
    coordinates.push({x: squareSize.width/2 - radius*3, y: 0})

    if (attempts === maxAttempts) {
        console.error("Could not generate random coordinates without intersection.");
    }

    return coordinates;
}