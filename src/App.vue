<script setup lang="ts">
import { Edges, Layouts, Nodes, defineConfigs } from 'v-network-graph';
import { VNetworkGraph, VEdgeLabel } from 'v-network-graph';
import { reactive } from 'vue';
import { getRandomNodes } from './utils/RandomMaxFlowGenerator';

  const nodes : Nodes = reactive({
    
  })

  const layout : Layouts = reactive({
    nodes: {

    },
  })

  const configs = reactive(
    defineConfigs({
      view: {
        scalingObjects: true,
      },
  })
)
  const n = 100;
  const coords = getRandomNodes(n, { width: 800, height: 600 })
  for (let i = 0; i < coords.length; i++) {
    const newNode = `node${i + 1}`;
    nodes[newNode] = { name: newNode };
    layout.nodes[newNode] = { x: coords[i].x, y: coords[i].y };
  }
  

  const edges : Edges = reactive({

  })


  function addNode() {
    const newNode = `node${Object.keys(nodes).length + 1}`;
    nodes[newNode] = { name: newNode };
    layout.nodes[newNode] = { x: 32, y: 40 };
    //edges[`edge${Object.keys(edges).length + 1}`] = { source: "node1", target: newNode };
  }
</script>

<template>
  <v-network-graph
    class="graph"
    :nodes="nodes"
    :edges="edges"
    :layouts="layout"
    :configs="configs"
  >
    <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps" />
    </template>
  </v-network-graph>
  <button @click="layout.nodes.node1.y -= 10">Move node 1</button>
  <button @click="nodes.node1.name = 'Node 1 changed'">Change node 1 name</button>
  <button @click="addNode">Add node</button>
</template>

<style scoped>
.graph {
  width: 800px;
  height: 600px;
  border: 1px solid #000;
}
</style>
