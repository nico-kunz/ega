<script setup lang="ts">
import { Edges } from 'v-network-graph';
import { VNetworkGraph, VEdgeLabel } from 'v-network-graph';

  const nodes = {
    node1: { name: "Node 1" },
    node2: { name: "Node 2" },
    node3: { name: "Node 3" },
    node4: { name: "Node 4" },
  }

  const edges : Edges = {
    edge1: { source: "node1", target: "node2", label: "Edge 1"},
    edge2: { source: "node2", target: "node3" },
    edge3: { source: "node3", target: "node4" },
  }
</script>

<template>
  <v-network-graph
    class="graph"
    :nodes="nodes"
    :edges="edges"
  >
    <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps" />
    </template>
  </v-network-graph>
</template>

<style scoped>
.graph {
  width: 800px;
  height: 600px;
  border: 1px solid #000;
}
</style>
