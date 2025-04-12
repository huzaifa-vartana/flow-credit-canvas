
import { Node, Edge, MarkerType } from "@xyflow/react";

// Sample data representing the structure from the user's request
export const initialNodes: Node[] = [
  // Root node
  {
    id: "ratings",
    type: "flowRoot",
    position: { x: 400, y: 50 },
    data: { label: "Credit Rating Rules" },
    style: {
      width: 180,
      backgroundColor: "#f8fafc",
      borderColor: "#64748b",
      borderWidth: 2,
    },
  },
  
  // Rating nodes
  {
    id: "rating-AA",
    type: "ratingNode",
    position: { x: 100, y: 160 },
    data: { 
      label: "Rating AA",
      rating: "AA",
      description: "Prime",
      color: "#15803d" // green-700
    },
  },
  {
    id: "rating-A",
    type: "ratingNode",
    position: { x: 300, y: 160 },
    data: { 
      label: "Rating A",
      rating: "A",
      description: "Strong",
      color: "#65a30d" // lime-600
    },
  },
  {
    id: "rating-B",
    type: "ratingNode",
    position: { x: 500, y: 160 },
    data: { 
      label: "Rating B",
      rating: "B",
      description: "Good",
      color: "#ca8a04" // yellow-600
    },
  },
  {
    id: "rating-C",
    type: "ratingNode",
    position: { x: 700, y: 160 },
    data: { 
      label: "Rating C",
      rating: "C",
      description: "Fair",
      color: "#ea580c" // orange-600
    },
  },
  {
    id: "rating-D",
    type: "ratingNode",
    position: { x: 900, y: 160 },
    data: { 
      label: "Rating D",
      rating: "D",
      description: "Poor",
      color: "#dc2626" // red-600
    },
  },
  
  // Example condition groups for AA
  {
    id: "aa-common",
    type: "conditionGroupNode",
    position: { x: 100, y: 280 },
    data: { 
      label: "Common Conditions",
      operation: "AND",
      parentRating: "AA"
    },
  },
  
  // Example conditions for AA common conditions
  {
    id: "aa-common-1",
    type: "conditionNode",
    position: { x: 40, y: 380 },
    data: { 
      name: "years_in_business",
      description: "Years in business",
      value: 7,
      operator: ">=",
      parentGroup: "aa-common"
    },
  },
  {
    id: "aa-common-2",
    type: "conditionNode",
    position: { x: 160, y: 380 },
    data: { 
      name: "number_of_trades",
      description: "Number of trades",
      value: 10,
      operator: ">=",
      parentGroup: "aa-common"
    },
  },
  
  // Example bureau node for AA
  {
    id: "aa-paynet",
    type: "bureauNode",
    position: { x: 100, y: 480 },
    data: { 
      label: "PayNet",
      bureau: "paynet",
      operation: "AND",
      parentRating: "AA"
    },
  },
  
  // Example score for PayNet
  {
    id: "aa-paynet-1",
    type: "scoreNode",
    position: { x: 100, y: 580 },
    data: { 
      name: "master_score",
      value: 700,
      operator: ">=",
      applyScoreAdjustment: true,
      parentBureau: "aa-paynet"
    },
  },
];

export const initialEdges: Edge[] = [
  // Connect root to rating nodes
  {
    id: "e-root-aa",
    source: "ratings",
    target: "rating-AA",
    type: "smoothstep",
    animated: true,
    style: { stroke: '#94a3b8' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-root-a",
    source: "ratings",
    target: "rating-A",
    type: "smoothstep",
    animated: true,
    style: { stroke: '#94a3b8' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-root-b",
    source: "ratings",
    target: "rating-B",
    type: "smoothstep",
    animated: true,
    style: { stroke: '#94a3b8' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-root-c",
    source: "ratings",
    target: "rating-C",
    type: "smoothstep",
    animated: true,
    style: { stroke: '#94a3b8' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-root-d",
    source: "ratings",
    target: "rating-D",
    type: "smoothstep",
    animated: true,
    style: { stroke: '#94a3b8' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  
  // Connect AA to its condition groups
  {
    id: "e-aa-common",
    source: "rating-AA",
    target: "aa-common",
    type: "smoothstep",
    animated: true,
    style: { stroke: '#15803d' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  
  // Connect AA common to its conditions
  {
    id: "e-aa-common-1",
    source: "aa-common",
    target: "aa-common-1",
    type: "smoothstep",
    animated: true,
    style: { stroke: '#64748b' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e-aa-common-2",
    source: "aa-common",
    target: "aa-common-2",
    type: "smoothstep",
    animated: true,
    style: { stroke: '#64748b' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  
  // Connect AA to bureaus
  {
    id: "e-aa-paynet",
    source: "rating-AA",
    target: "aa-paynet",
    type: "smoothstep",
    animated: true,
    style: { stroke: '#15803d' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  
  // Connect bureau to scores
  {
    id: "e-aa-paynet-1",
    source: "aa-paynet",
    target: "aa-paynet-1",
    type: "smoothstep",
    animated: true,
    style: { stroke: '#64748b' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];
