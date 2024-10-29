import { MatrixGraph } from "../MatrixGraph";

export function pushRelabel(graph: MatrixGraph, source: number, sink: number, update: Function, waitForNextStep: Function): Promise<number> {
    
    return new Promise(async (resolve) => {
        let x = 0
        initPreflow(graph, source, update)
        while(graph.excessVerts.length > 0) {
            console.log("STEP", x)
            x++
            const u = graph.excessVerts.shift()!
            if(u != source && u != sink) {
                discharge(graph, u, update)
            }
            await waitForNextStep()
        }

        let maxFlow = 0;
        for(let i = 0; i < graph.n; i++) {
            maxFlow += graph.flow[i][sink]
        }
    
        console.log(graph)
        resolve(maxFlow)
    })
}

function initPreflow(graph: MatrixGraph, source: number, update: Function) {
    graph.height[source] = graph.n
    graph.excess[source] = Infinity
    for (let i = 0; i < graph.n; i++) {
        if(i != source) {
            push(graph, source, i, update)
        }
    }
}

function push(graph: MatrixGraph, u: number, v: number, update: Function) {
    const d = Math.min(graph.excess[u], graph.capacity[u][v] - graph.flow[u][v])
    graph.flow[u][v] += d
    graph.flow[v][u] -= d
    graph.excess[u] -= d
    graph.excess[v] += d
    
    update(u, v, graph.flow[u][v], graph.capacity[u][v])
    update(v, u, graph.flow[v][u], graph.capacity[v][u])

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

function discharge(graph: MatrixGraph, u: number, update: Function) {
    while(graph.excess[u] > 0) {
        if(graph.seen[u] < graph.n) {
            const v = graph.seen[u]
            if(graph.capacity[u][v] - graph.flow[u][v] > 0 && graph.height[u] > graph.height[v]) {
                push(graph, u, v, update)
            } else {
                graph.seen[u]++;
            }
        } else {
            relabel(graph, u)
            graph.seen[u] = 0
        }
    }
}