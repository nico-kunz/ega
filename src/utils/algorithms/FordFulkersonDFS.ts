import { MatrixGraph } from "../MatrixGraph";

export function fordFulkerson(graph: MatrixGraph, source: number, sink: number) {
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