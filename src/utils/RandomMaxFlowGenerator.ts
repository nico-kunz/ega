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
/*export function makeRandomMaxFlowGraph(numberOfNodes: number, maxCapacity: number, squareSize?: Size, radius = 16) {
    
}*/

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
    return {
        x: Math.floor(Math.random() * (squareSize.width - radius+1)) + radius,
        y: Math.floor(Math.random() * (squareSize.height - radius+1)) + radius
    }
}