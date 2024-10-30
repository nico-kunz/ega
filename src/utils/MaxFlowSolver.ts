import { Edges, Nodes } from "v-network-graph";
import { MatrixGraph } from "./MatrixGraph";
import { fordFulkerson } from "./algorithms/FordFulkersonDFS";
import { edmondsKarp } from "./algorithms/EdmondsKarp";
import { dinics } from "./algorithms/Dinics";
import { pushRelabel } from "./algorithms/pushRelabel";


export class MaxFlowSolver {
    edges: Edges
    nodes: Nodes
    history: any[] = []
    currentIndex = 0

    constructor(edgesRef: Edges, nodesRef: Nodes, algo = 0) {
        //nodesRef[Object.keys(nodesRef)[0]].name = "TEST"
        console.log("MaxFlowSolver", algo)
        this.edges = edgesRef
        this.nodes = nodesRef
        let graph = new MatrixGraph(nodesRef, edgesRef)

        const waitForNextStep = async () => {
            return new Promise(resolve => {
                // resolve when next button is pressed (next-step event)
                document.addEventListener("next-step", resolve, { once: true})
            })
        }

        switch(algo) {
            case 0:
                fordFulkerson(graph, 0, Object.keys(nodesRef).length - 1, this.updateEdge.bind(this), waitForNextStep, this.flushEdges.bind(this)).then(console.log)
                break
            case 1:
                edmondsKarp(graph, 0, Object.keys(nodesRef).length - 1, this.updateEdge.bind(this), waitForNextStep, this.flushEdges.bind(this)).then(console.log)
                break
            case 2:
                dinics(graph, 0, Object.keys(nodesRef).length - 1, this.updateEdge.bind(this), waitForNextStep).then(console.log)
                break
            case 3:
                pushRelabel(graph, 0, Object.keys(nodesRef).length - 1, this.updateEdge.bind(this), waitForNextStep).then(console.log)
                break;
        }
    }
    
    updateEdges(matrix: number[][]) {
        console.log(matrix)
        for(let y = 0; y < matrix.length; y++) {
            for(let x = 0; x < matrix[y].length; x++) {
                const edge = this.edges[`${y+1}-${x+1}`]
                if(edge) {
                    edge.flow = matrix[y][x]
                }
            }
        }
    }

    flushEdges() {
        for(const key in this.edges) {
            if(this.edges[key].color == "blue") {
                this.edges[key].color = "red"
            }
        }
    }

    updateEdge(u: number, v: number, flow: number, capacity: number) {
        const edge = this.edges[`${u+1}-${v+1}`]
        if(edge) {
            edge.flow = flow
            edge.label = capacity
            edge.color = "blue"
        }
    }
}


