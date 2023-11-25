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
export function getRandomCoordinatesWihoutIntersection(n: number, squareSize: Size, radius = 16) : Coordinate[] {
    const coordinates: Coordinate[] = [];
    const maxAttempts = 1000;
    let attempts = 0;

    const distance = (c1: Coordinate, c2: Coordinate) => Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));

    while (coordinates.length < n && attempts < maxAttempts) {
        const coordinate = getRandomCoordinate(squareSize);
        if (coordinates.every(c => distance(c, coordinate) > radius * 2)) {
            coordinates.push(coordinate);
        }
        attempts++;
    }

    if (attempts === maxAttempts) {
        console.error("Could not generate random coordinates without intersection.");
    }

    return coordinates;
}

function getRandomCoordinate(squareSize: Size) : Coordinate {
    return {
        x: Math.random() * squareSize.width,
        y: Math.random() * squareSize.height
    }
}