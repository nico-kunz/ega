<script setup lang="ts">
import { EdgeLabelArea, Edges, Layouts, Nodes, defineConfigs } from 'v-network-graph';
import { VNetworkGraph, VEdgeLabel } from 'v-network-graph';
import { reactive } from 'vue';
import { makeRandomMaxFlowGraph } from './utils/RandomMaxFlowGenerator';
import { MaxFlowSolver } from './utils/MaxFlowSolver';
  
const configs = reactive(
    defineConfigs({
    view: {
        scalingObjects: true,
        autoPanAndZoomOnLoad: "center-zero"
    },
    edge: {
        type: 'curve',
        gap: 20,
        label: {
            background: {
                color: '#FFFFFF00',
                padding: 2,
                visible: true,
            },
        },
        marker: {
            target: {
                type: 'arrow'
            }
        }
    },
    node: {
        zOrder: {
            zIndex: 80,
        },
        label: {
        color: "#FFF",
        direction: "center",
        text: (node) => {
            if(node.name === "1")
            return "S";
            if(node.name === n.toString())
            return "D";

            return node.name as string;
        }
        },
        normal: {
            radius: 16,
        }
    }
    })
)

const nodes : Nodes = reactive({

})

const layout : Layouts = reactive({
nodes: {},
})

const n = 5;
const graph = makeRandomMaxFlowGraph(n, 20, {width: 1200, height: 900});
const layoutNodes = graph.layout.nodes;
for (const node in layoutNodes) {
    nodes[node] = { name: node };
    layout.nodes[node] = { x: layoutNodes[node].x, y: layoutNodes[node].y };
}

const edges : Edges = reactive({
    ...graph.edges
})



function addNode() {
    console.log(Object.keys(nodes)[0])
    //nodes[Object.keys(nodes)[0]].name = "HALLO";
    console.log(edges)
    new MaxFlowSolver(edges, nodes, layout)
    // const newNode = `${Object.keys(nodes).length + 1}`;
    // nodes[newNode] = { name: newNode };
    // layout.nodes[newNode] = { x: -34.55937750784574, y: -10.346841686848222 };
    // edges[`edge${Object.keys(edges).length + 1}`] = { source: "1", target: newNode };
}
</script>
<template>
  <v-network-graph class="graph" :nodes="nodes" :edges="edges" :layouts="layout" :configs="configs">
    <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.flow + '/' + edge.label" align="center" vertical-align="above" v-bind="slotProps" />
    </template>
  </v-network-graph>
  <button @click="layout.nodes.node1.y -= 10">Move node 1</button>
  <button @click="nodes.node1.name = 'Node 1 changed'">Change node 1 name</button>
  <button @click="addNode">Add node</button>
</template>

<style scoped>
.graph {
  width: 1200px;
  height: 900px;
  border: 1px solid #000;
}
</style>
