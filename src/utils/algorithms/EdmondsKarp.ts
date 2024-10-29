import { MatrixGraph } from "../MatrixGraph"

export function edmondsKarp(graph: MatrixGraph, source: number, sink: number, update: Function, waitForNextStep: Function): Promise<number> {
    let maxFlow = 0

    return new Promise(async (resolve) => {
        let x = 0
        while (true) {
            console.log("STEP", x)
            x++
            let flow = bfs(graph, source, sink, update)
            if(flow === Infinity) {
                break
            }
            maxFlow += flow
            await waitForNextStep()
        }
        
        resolve(maxFlow)
    })
}

function bfs(graph: MatrixGraph, source: number, sink: number, update: Function): number {
    let Q = [source]
    let visited :{[key: string]: boolean} = {}
    visited[source] = true

    let prev :{[key: string]: number} = {}
    while (Q.length > 0) {
        let node: number = Q.shift()!
        if (node === sink) {
            break;
        }

        for (let i = 0; i < graph.n; i++) {
            if (graph.capacity[node][i] - graph.flow[node][i] > 0 && visited[i] !== true) {
                visited[i] = true
                prev[i] = node
                Q.push(i)
            }
        }
    }

    // If we reached the sink, find the bottleneck
    let bottleneck = Infinity
    for(let node = sink; prev[node] != undefined; node = prev[node]) {
        bottleneck = Math.min(bottleneck, graph.capacity[prev[node]][node] - graph.flow[prev[node]][node])
    }

    // Update flow values and return bottleneck
    for(let node = sink; prev[node] != undefined; node = prev[node]) {
        graph.flow[prev[node]][node] += bottleneck
        graph.flow[node][prev[node]] -= bottleneck
        update(prev[node], node, graph.flow[prev[node]][node], graph.capacity[prev[node]][node])
        update(node, prev[node], graph.flow[node][prev[node]], graph.capacity[node][prev[node]])
    }

    return bottleneck
}