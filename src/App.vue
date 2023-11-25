<script setup lang="ts">
import { Edges, Layouts, Nodes } from 'v-network-graph';
import { VNetworkGraph, VEdgeLabel } from 'v-network-graph';
import { reactive } from 'vue';
import { getRandomCoordinatesWihoutIntersection } from './utils/RandomMaxFlowGenerator';

  const nodes : Nodes = reactive({

  })

  const layout : Layouts = reactive({
    nodes: {

    },
  })

  const n = 100;
  const coords = getRandomCoordinatesWihoutIntersection(n, { width: 800, height: 600 })
  for (let i = 0; i < coords.length; i++) {
    const newNode = `node${i + 1}`;
    nodes[newNode] = { name: newNode };
    layout.nodes[newNode] = { x: coords[i].x, y: coords[i].y };
  }
  

  const edges : Edges = reactive({

  })


  function addNode(test = 0) {
    const newNode = `node${Object.keys(nodes).length + 1}`;
    nodes[newNode] = { name: newNode };
    layout.nodes[newNode] = { x: 10 + test, y: 10 };
    edges[`edge${Object.keys(edges).length + 1}`] = { source: "node1", target: newNode };
  }
</script>

<template>
  <v-network-graph
    class="graph"
    :nodes="nodes"
    :edges="edges"
    :layouts="layout"
  >
    <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps" />
    </template>
  </v-network-graph>
  <button @click="layout.nodes.node1.x += 10">Move node 1</button>
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
