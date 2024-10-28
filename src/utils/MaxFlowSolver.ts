import { Edges, Layouts, Nodes } from "v-network-graph";
import { MatrixGraph } from "./MatrixGraph";

function fordFulkerson(graph: FlowGraph, source: string, sink: string): number {
    let maxFlow = 0
    while (true) {
        let flow = dfs(graph, source, sink)
        if (flow === 0) {
            break
        }
        maxFlow += flow
    }
    return maxFlow
}


function dfs(graph: FlowGraph, source: string, sink: string, visited: {[key: string]: boolean} = {}, flow = Infinity): number {
    if (source === sink) {
        return flow
    }
    
    visited[source] = true
    for(const edge of graph.nodes[source].edges as FlowEdge[]) {
        if(edge.residual > 0 && visited[edge.target] !== true) {
            const bottleneck = dfs(graph, edge.target, sink, visited, Math.min(flow, edge.residual))

            // If we found a path, augment the flow to (partly) "block" the path
            if (bottleneck > 0) {
                edge.augment(bottleneck)
                return bottleneck
            }
        }
    }

    return 0;
}

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

function edmondsKarp(graph: FlowGraph, source: string, sink: string): number {
    let maxFlow = 0
    while (true) {
        let flow = bfs(graph, source, sink)
        console.log("flow: ", flow)
        if (flow === Infinity) {
            break
        }
        maxFlow += flow
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

    let prev :{[key: string]: FlowEdge} = {}
    while (Q.length > 0) {
        let node: number = Q.shift()!
        if (node === sink) {
            break;
        }

        for (let i = 0; i < graph.n; i++) {
            if (graph.capacity[node][i] - graph.flow[node][i] > 0 && visited[i] !== true) {
                visited[i] = true
                prev[i] = new FlowEdge(String(node), String(i), graph.capacity[node][i], graph.flow[node][i])
                Q.push(i)
            }
        }
    }

    // If we reached the sink, find the bottleneck
    let bottleneck = Infinity
    for(let node = sink; prev[node]; node = parseInt(prev[node].source)) {
        bottleneck = Math.min(bottleneck, graph.capacity[parseInt(prev[node].source)][node] - graph.flow[parseInt(prev[node].source)][node])
    }

    // Update flow values and return bottleneck
    for(let node = sink; prev[node]; node = parseInt(prev[node].source)) {
        graph.flow[parseInt(prev[node].source)][node] += bottleneck
        graph.flow[node][parseInt(prev[node].source)] -= bottleneck
    }

    return bottleneck
}

function bfs(graph: FlowGraph, source: string, sink: string): number {
    let Q = [source]
    let visited :{[key: string]: boolean} = {}
    visited[source] = true

    let prev :{[key: string]: FlowEdge} = {}
    while (Q.length > 0) {
        let node: string = Q.shift()!
        if (node === sink) {
            break;
        }

        for (const edge of graph.nodes[node].edges as FlowEdge[]) {
            if (edge.residual > 0 && visited[edge.target] !== true) {
                visited[edge.target] = true
                prev[edge.target] = edge
                Q.push(edge.target)
            }
        }
    }

    // If we reached the sink, find the bottleneck
    let bottleneck = Infinity
    for(let node = sink; prev[node]; node = prev[node].source) {
        console.log("Prev node residual", prev[node].residual)
        bottleneck = Math.min(bottleneck, prev[node].residual)
    }

    // Update flow values and return bottleneck
    for(let node = sink; prev[node]; node = prev[node].source) {
        console.log("Prev node residual", prev[node].residual)
        prev[node].augment(bottleneck)
    }

    return bottleneck
}

function dinic(graph: FlowGraph, source: string, sink: string): number {
    let maxFlow = 0;
    let level: { [key: string]: number } | null;

    // Build Level Grap
    while ((level = bfsLevelGraph(graph, source, sink))) { 
        let flow;

        // find blocking flows
        while ((flow = dfsBlockingFlow(graph, source, sink, level, Infinity)) > 0) {
            maxFlow += flow;
        }
    }

    return maxFlow;
}

function bfsLevelGraph(graph: FlowGraph, source: string, sink: string): { [key: string]: number } | null {
    const level: { [key: string]: number } = {};
    const queue: string[] = [source];
    level[source] = 0;

    while (queue.length > 0) {
        const node = queue.shift()!;
        for (const edge of graph.nodes[node].edges as FlowEdge[]) {
            // Only consider edges with residual capacity
            if (edge.residual > 0 && level[edge.target] === undefined) {
                level[edge.target] = level[node] + 1;
                queue.push(edge.target);
            }
        }
    }

    // Check if sink is reachable in level graph
    return level[sink] !== undefined ? level : null;
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


function dfsBlockingFlow(
    graph: FlowGraph,
    node: string,
    sink: string,
    level: { [key: string]: number },
    flow: number
): number {
    if (node === sink) return flow;

    for (const edge of graph.nodes[node].edges as FlowEdge[]) {
        if (edge.residual > 0 && level[edge.target] === level[node] + 1) {
            const bottleneck = dfsBlockingFlow(
                graph,
                edge.target,
                sink,
                level,
                Math.min(flow, edge.residual)
            );

            if (bottleneck > 0) {
                edge.augment(bottleneck);
                return bottleneck;
            }
        }
    }

    return 0;
}


class FlowEdge {
    source: string
    target: string
    capacity: number
    flow: number
    residual: number

    constructor(source: string, target: string, capacity: number, flow: number) {
        this.source = source
        this.target = target
        this.capacity = capacity
        this.residual = capacity
        this.flow = flow
    }

    augment(flow: number) {
        this.flow += flow
        this.residual -= flow
    }
}

class FlowGraph {
    edges: Edges = {}
    nodes: Nodes = {}

    constructor(edges: Edges, nodes: Nodes) {
        this.nodes = nodes

        for(const nodeId in nodes) {
            nodes[nodeId].edges = []
        }
        
        for (const edgeId in edges) {
            const edge = edges[edgeId]
            this.nodes[edge.source].edges.push(new FlowEdge(edge.source, edge.target, edge.label, 0))
        }

        this.edges = edges
        //this.nodes["4"].name = "TEST"
        console.log(dinic(this, "1", String(Object.keys(nodes).length)))
    }
}

export class MaxFlowSolver {
    constructor(edgesRef: Edges, nodesRef: Nodes, layoutRef: Layouts) {
        //nodesRef[Object.keys(nodesRef)[0]].name = "TEST"
        let flowgraph = new FlowGraph(edgesRef, nodesRef)
    }
    static test(edges: Edges, nodes: Nodes) {
        nodes[3].name = "Test"
        console.log(nodes[3].name)
    }
}
