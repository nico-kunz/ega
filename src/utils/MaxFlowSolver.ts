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

function dfs(graph: FlowGraph, source: string, sink: string, flow = Infinity): number {
    if (source === sink) {
        return flow
    }
    let visited :{[key: string]: boolean}= {}

    for(const edge of graph.nodes[source].edges as FlowEdge[]) {
        if(edge.residual > 0 && visited[edge.target] !== true) {
            const bottleneck = dfs(graph, edge.target, sink, Math.min(flow, edge.residual))

            // If we found a path, augment the flow to (partly) "block" the path
            if (bottleneck > 0) {
                edge.augment(bottleneck)
                return bottleneck
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
        this.nodes["4"].name = "TEST"
        console.log(fordFulkerson(this, "1", "4"))
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