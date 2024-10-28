import { MatrixGraph } from "../MatrixGraph";

export function pushRelabel(graph: MatrixGraph, source: number, sink: number): number {
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