import { MatrixGraph } from "../MatrixGraph";

export function fordFulkerson(graph: MatrixGraph, source: number, sink: number, update: Function, waitForNextStep: Function): Promise<number> {
    const residual = graph.capacity.map(row => row.slice())
    let maxFlow = 0

    async function dfs(u: number, visited: boolean[], pathFlow: number): Promise<number> {
        if (u == sink) return pathFlow

        visited[u] = true

        for(let v = 0; v < graph.n; v++) {
            if(!visited[v] && residual[u][v] > 0) {
                const flow = Math.min(pathFlow, residual[u][v])
                const resultFlow = await dfs(v, visited, flow)

                if(resultFlow > 0) {
                    residual[u][v] -= resultFlow
                    residual[v][u] += resultFlow

                    update(u, v, resultFlow, residual[u][v])
                    update(v, u, -resultFlow, residual[v][u])
                    await waitForNextStep()
                    return resultFlow
                }
            }
        }

        return 0
    }
    return new Promise(async(resolve) => {
        let x = 0
        while(true) {
            console.log("STEP", x)
            x++
            const visited = Array(graph.n).fill(false)
            const pathFlow = await dfs(source, visited, Infinity)
    
            if(pathFlow == 0) break
            maxFlow += pathFlow
            // await waitForNextStep()
        }
        
        console.log(residual)
        resolve(maxFlow)
    })

}