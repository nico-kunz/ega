<script setup lang="ts">
import { Edges, Layouts, Nodes } from 'v-network-graph';
import { VNetworkGraph, VEdgeLabel } from 'v-network-graph';
import { reactive } from 'vue';

  const nodes : Nodes = reactive({
    node1: { name: "Node 1"},
    node2: { name: "Node 2"},
    node3: { name: "Node 3"},
    node4: { name: "Node 4"}
  })

  const layout : Layouts = reactive({
    nodes: {
      node1: { x: 0, y: 100 },
      node2: { x: 200, y: 200 },
      node3: { x: 300, y: 300 },
      node4: { x: 700, y: 400 },
    },
  })

  const edges : Edges = reactive({
    edge1: { source: "node1", target: "node2", label: "Edge 1"},
    edge2: { source: "node2", target: "node3" },
    edge3: { source: "node3", target: "node4" },
    edge4: { source: "node2", target: "node1" },
  })

  function addNode() {
    const newNode = `node${Object.keys(nodes).length + 1}`;
    nodes[newNode] = { name: newNode };
    layout.nodes[newNode] = { x: 0, y: 0 };
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
