import { Edges, Layouts, Nodes } from "v-network-graph";

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
