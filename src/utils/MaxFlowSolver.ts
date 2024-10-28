import { Edges, Nodes } from "v-network-graph";
import { MatrixGraph } from "./MatrixGraph";

function fordFulkersonMatrix(graph: MatrixGraph, source: number, sink: number) {
    const residual = graph.capacity.map(row => row.slice())
    let maxFlow = 0

    function dfs(u: number, visited: boolean[], pathFlow: number): number {
        if (u == sink) return pathFlow

        visited[u] = true

        for(let v = 0; v < graph.n; v++) {
            if(!visited[v] && residual[u][v] > 0) {
                const flow = Math.min(pathFlow, residual[u][v])
                const resultFlow = dfs(v, visited, flow)

                if(resultFlow > 0) {
                    residual[u][v] -= resultFlow
                    residual[v][u] += resultFlow
                    return resultFlow
                }
            }
        }

        return 0
    }

    while(true) {
        const visited = Array(graph.n).fill(false)
        const pathFlow = dfs(source, visited, Infinity)

        if(pathFlow == 0) break
        maxFlow += pathFlow
    }

    return maxFlow
}

function edmondsKarpMatrix(graph: MatrixGraph, source: number, sink: number): number {
    let maxFlow = 0
    while (true) {
        let flow = bfsMatrix(graph, source, sink)
        if(flow === Infinity) {
            break
        }
        maxFlow += flow
    }
    return maxFlow
}

function bfsMatrix(graph: MatrixGraph, source: number, sink: number): number {
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
    for(let node = sink; prev[node]; node = prev[node]) {
        bottleneck = Math.min(bottleneck, graph.capacity[prev[node]][node] - graph.flow[prev[node]][node])
    }

    // Update flow values and return bottleneck
    for(let node = sink; prev[node]; node = prev[node]) {
        graph.flow[prev[node]][node] += bottleneck
        graph.flow[node][prev[node]] -= bottleneck
    }

    return bottleneck
}

function dinicMatrix(graph: MatrixGraph, source: number, sink: number): number {
    let maxFlow = 0;
    let level;

    while ((level = bfsLevelGraphMatrix(graph, source, sink))) {
        let flow;
        while ((flow = dfsBlockingFlowMatrix(graph, source, sink, level, Infinity)) > 0) {
            maxFlow += flow;
        }
    }

    return maxFlow;
}

function bfsLevelGraphMatrix(graph: MatrixGraph, source: number, sink: number): number[] | null {
    const level: number[] = Array(graph.n).fill(-1);
    const queue: number[] = [source];
    level[source] = 0;

    while (queue.length > 0) {
        const u = queue.shift()!;
        for (let v = 0; v < graph.n; v++) {
            if (graph.capacity[u][v] - graph.flow[u][v] > 0 && level[v] === -1) {
                level[v] = level[u] + 1;
                queue.push(v);
            }
        }
    }

    return level[sink] === -1 ? null : level;
}

function dfsBlockingFlowMatrix(
    graph: MatrixGraph,
    u: number,
    sink: number,
    level: number[],
    flow: number
): number {
    if (u === sink) return flow;

    for (let v = 0; v < graph.n; v++) {
        if (graph.capacity[u][v] - graph.flow[u][v] > 0 && level[v] === level[u] + 1) {
            const bottleneck = dfsBlockingFlowMatrix(
                graph,
                v,
                sink,
                level,
                Math.min(flow, graph.capacity[u][v] - graph.flow[u][v])
            );

            if (bottleneck > 0) {
                graph.flow[u][v] += bottleneck;
                graph.flow[v][u] -= bottleneck;
                return bottleneck;
            }
        }
    }

    return 0;
}

function pushRelabel(graph: MatrixGraph, source: number, sink: number): number {
    initPreflow(graph, source)
    
    while(graph.excessVerts.length > 0) {
        const u = graph.excessVerts.shift()!
        if(u != source && u != sink) {
            discharge(graph, u)
        }
    }

    let maxFlow = 0;
    for(let i = 0; i < graph.n; i++) {
        maxFlow += graph.flow[i][sink]
    }

    console.log(graph)
    return maxFlow

}

function initPreflow(graph: MatrixGraph, source: number) {
    graph.height[source] = graph.n
    graph.excess[source] = Infinity
    for (let i = 0; i < graph.n; i++) {
        if(i != source) {
            push(graph, source, i)
        }
    }
}

function push(graph: MatrixGraph, u: number, v: number) {
    const d = Math.min(graph.excess[u], graph.capacity[u][v] - graph.flow[u][v])
    graph.flow[u][v] += d
    graph.flow[v][u] -= d
    graph.excess[u] -= d
    graph.excess[v] += d

    if(d > 0 && graph.excess[v] == d) {
        graph.excessVerts.push(v)
    }
}

function relabel(graph: MatrixGraph, u: number) {
    let d = Infinity
    for (let i = 0; i < graph.n; i++) {
        if(graph.capacity[u][i] - graph.flow[u][i] > 0) {
            d = Math.min(d, graph.height[i])
        }
    }
    if(d < Infinity) {
        graph.height[u] = d + 1
    }
}

function discharge(graph: MatrixGraph, u: number) {
    while(graph.excess[u] > 0) {
        if(graph.seen[u] < graph.n) {
            const v = graph.seen[u]
            if(graph.capacity[u][v] - graph.flow[u][v] > 0 && graph.height[u] > graph.height[v]) {
                push(graph, u, v)
            } else {
                graph.seen[u]++;
            }
        } else {
            relabel(graph, u)
            graph.seen[u] = 0
        }
    }
}

export class MaxFlowSolver {
    constructor(edgesRef: Edges, nodesRef: Nodes, algo = 0) {
        //nodesRef[Object.keys(nodesRef)[0]].name = "TEST"
        console.log("MaxFlowSolver", algo)
        let graph = new MatrixGraph(nodesRef, edgesRef)

        switch(algo) {
            case 0:
                console.log(fordFulkersonMatrix(graph, 0, Object.keys(nodesRef).length - 1))
                break
            case 1:
                console.log(edmondsKarpMatrix(graph, 0, Object.keys(nodesRef).length - 1))
                break
            case 2:
                console.log(dinicMatrix(graph, 0, Object.keys(nodesRef).length - 1))
                break
            case 3:
                console.log(pushRelabel(graph, 0, Object.keys(nodesRef).length - 1))
                break;
        }
    }
}
