import { MatrixGraph } from "../MatrixGraph";

export function dinics(graph: MatrixGraph, source: number, sink: number, update: Function, waitForNextStep: Function): Promise<number> {
    let maxFlow = 0;
    let level;

    return new Promise(async (resolve) => {     
        let x = 0   
        while ((level = bfsLevelGraph(graph, source, sink))) {
            console.log("STEP", x)
            x++
            let flow;
            while ((flow = dfsBlockingFlow(graph, source, sink, level, Infinity, update)) > 0) {
                maxFlow += flow;
                await waitForNextStep()
            }
        }
    
        resolve(maxFlow);
    });
}

function bfsLevelGraph(graph: MatrixGraph, source: number, sink: number): number[] | null {
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

function dfsBlockingFlow(
    graph: MatrixGraph,
    u: number,
    sink: number,
    level: number[],
    flow: number,
    update: Function
): number {
    if (u === sink) return flow;

    for (let v = 0; v < graph.n; v++) {
        if (graph.capacity[u][v] - graph.flow[u][v] > 0 && level[v] === level[u] + 1) {
            const bottleneck = dfsBlockingFlow(
                graph,
                v,
                sink,
                level,
                Math.min(flow, graph.capacity[u][v] - graph.flow[u][v]),
                update
            );

            if (bottleneck > 0) {
                graph.flow[u][v] += bottleneck;
                graph.flow[v][u] -= bottleneck;
                update(u, v, graph.flow[u][v], graph.capacity[u][v]);
                update(v, u, graph.flow[v][u], graph.capacity[v][u]);
                return bottleneck;
            }
        }
    }

    return 0;
}