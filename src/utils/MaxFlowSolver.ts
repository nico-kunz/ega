import { Edges, Nodes } from "v-network-graph";
import { MatrixGraph } from "./MatrixGraph";
import { fordFulkerson } from "./algorithms/FordFulkersonDFS";
import { edmondsKarp } from "./algorithms/EdmondsKarp";
import { dinics } from "./algorithms/Dinics";
import { pushRelabel } from "./algorithms/pushRelabel";


export class MaxFlowSolver {
    constructor(edgesRef: Edges, nodesRef: Nodes, algo = 0) {
        //nodesRef[Object.keys(nodesRef)[0]].name = "TEST"
        console.log("MaxFlowSolver", algo)
        let graph = new MatrixGraph(nodesRef, edgesRef)

        switch(algo) {
            case 0:
                console.log(fordFulkerson(graph, 0, Object.keys(nodesRef).length - 1))
                break
            case 1:
                console.log(edmondsKarp(graph, 0, Object.keys(nodesRef).length - 1))
                break
            case 2:
                console.log(dinics(graph, 0, Object.keys(nodesRef).length - 1))
                break
            case 3:
                console.log(pushRelabel(graph, 0, Object.keys(nodesRef).length - 1))
                break;
        }
    }
}
