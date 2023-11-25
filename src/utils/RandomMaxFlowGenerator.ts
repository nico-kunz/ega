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
export function makeRandomMaxFlowGraph(numberOfNodes: number, maxCapacity: number, squareSize?: Size, radius = 16) {
    
}

/**
 * Get `n` random coordinates in a square of size `squareSize`.
 * @param n Number of coordinates to generate.
 * @param squareSize Size of the square, limits the max value of the coordinates.
 * @returns Array of n coordinates in the square.
 */
function getRandomCoordinates(n: number, squareSize: Size) : Coordinate[] {
    const coordinates: Coordinate[] = [];
    for (let i = 0; i < n; i++) {
        coordinates.push({
            x: Math.random() * squareSize.width,
            y: Math.random() * squareSize.height
        })
    }

    return coordinates;
}