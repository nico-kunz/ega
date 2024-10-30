<script setup lang="ts">
import { Edges, Layouts, Nodes, defineConfigs } from 'v-network-graph';
import { VNetworkGraph, VEdgeLabel } from 'v-network-graph';
import { reactive, ref } from 'vue';
import { makeRandomMaxFlowGraph } from './utils/RandomMaxFlowGenerator';
import { MaxFlowSolver } from './utils/MaxFlowSolver';
  
const configs = reactive(
    defineConfigs({
    view: {
        scalingObjects: true,
        autoPanAndZoomOnLoad: "center-zero"
    },
    edge: {
        normal: {
            color: edge => edge.color || "#000A",
        },
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
            color: "#000",
        }
    }
    })
)

const nodes : Nodes = reactive({})
const layout : Layouts = reactive({nodes: {},})
const n = 10;
const graph = makeRandomMaxFlowGraph(n, 50, {width: 1200, height: 900});

const layoutNodes = graph.layout.nodes;
for (const node in layoutNodes) {
    nodes[node] = { name: node };
    layout.nodes[node] = { x: layoutNodes[node].x, y: layoutNodes[node].y };
}

const edges : Edges = reactive({...graph.edges})

const solver = ref<MaxFlowSolver | null>(null);
const isRunning = ref(false);

// Emit event for the next step
function emitNextStep() {
  const event = new CustomEvent("next-step");
  document.dispatchEvent(event);
}

const initialNodes = JSON.parse(JSON.stringify(nodes));
const initialEdges = JSON.parse(JSON.stringify(edges));
const initialLayout = JSON.parse(JSON.stringify(layout));

// Reset the graph and solver
function reset() {
    Object.keys(nodes).forEach(key => delete nodes[key]);
    Object.keys(edges).forEach(key => delete edges[key]);
    Object.keys(layout.nodes).forEach(key => delete layout.nodes[key]);

    Object.assign(nodes, JSON.parse(JSON.stringify(initialNodes)));
    Object.assign(edges, JSON.parse(JSON.stringify(initialEdges)));
    Object.assign(layout.nodes, JSON.parse(JSON.stringify(initialLayout.nodes)));
    solver.value = null;
    isRunning.value = false;
}

// Start the algorithm
function startAlgorithm(algo: number) {
  if (!isRunning.value) {
    isRunning.value = true;
    solver.value = new MaxFlowSolver(edges, nodes, algo);
  }
}

</script>
<template>
    <v-network-graph class="graph" :nodes="nodes" :edges="edges" :layouts="layout" :configs="configs">
      <template #edge-label="{ edge, ...slotProps }">
        <v-edge-label :text="edge.flow + '/' + edge.label" align="center" vertical-align="above" v-bind="slotProps" />
      </template>
    </v-network-graph>
  
    <button @click="reset">Reset</button>
    <button @click="startAlgorithm(0)">Start Ford Fulkerson</button>
    <button @click="emitNextStep">Next</button>
  
    <div style="display: flex; justify-content: center; margin-top: 2em;">
      <div style="display: flex; flex-direction: column; max-width: fit-content;">
        <button @click="startAlgorithm(0)">Ford Fulkerson</button>
        <button @click="startAlgorithm(1)">Edmonds Karp</button>
        <button @click="startAlgorithm(2)">Dinics</button>
        <button @click="startAlgorithm(3)">Push Relabel</button>
      </div>
    </div>
  </template>
  

<style scoped>
.graph {
  width: 1200px;
  height: 900px;
  border: 1px solid #000;
}
</style>
