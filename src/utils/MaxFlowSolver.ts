import { Edges, Layouts, Nodes } from "v-network-graph";
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
