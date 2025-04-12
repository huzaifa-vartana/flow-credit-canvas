
import { useMemo, useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Panel,
  BackgroundVariant,
  Node,
  ReactFlowProvider,
  useReactFlow,
  NodeMouseHandler
} from "@xyflow/react";
import { useCreditFlow } from "./CreditFlowContext";
import RatingNode from "./nodes/RatingNode";
import ConditionGroupNode from "./nodes/ConditionGroupNode";
import ConditionNode from "./nodes/ConditionNode";
import BureauNode from "./nodes/BureauNode";
import ScoreNode from "./nodes/ScoreNode";
import FlowRootNode from "./nodes/FlowRootNode";
import CustomEdge from "./edges/CustomEdge";
import NodePropertiesDialog from "./NodePropertiesDialog";

import "@xyflow/react/dist/style.css";
import "./flowStyles.css";

const FlowContent = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useCreditFlow();
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      ratingNode: RatingNode,
      conditionGroupNode: ConditionGroupNode,
      conditionNode: ConditionNode,
      bureauNode: BureauNode,
      scoreNode: ScoreNode,
      flowRoot: FlowRootNode,
    }),
    []
  );

  // Define custom edge types
  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    []
  );

  // Handle drop event for new nodes
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!reactFlowBounds) return;

    const dataStr = event.dataTransfer.getData('application/reactflow');
    if (!dataStr) return;

    try {
      const { type, data } = JSON.parse(dataStr);
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const newNode = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data,
      };
      
      reactFlowInstance.addNodes(newNode);
    } catch (error) {
      console.error('Error adding new node:', error);
    }
  }, [reactFlowInstance]);

  // Double click to edit node
  const onNodeDoubleClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle closing the properties dialog
  const handleCloseDialog = () => {
    setSelectedNode(null);
  };

  // Function to get node colors for minimap
  const nodeColor = (node: Node) => {
    switch (node.type) {
      case 'ratingNode':
        return node.data?.color?.toString() || '#64748b';
      case 'conditionGroupNode':
        return '#3b82f6';
      case 'conditionNode':
        return '#8b5cf6';
      case 'bureauNode':
        return '#06b6d4';
      case 'scoreNode':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  // Function to export the flow as JSON
  const onExport = useCallback(() => {
    const flowData = reactFlowInstance.toObject();
    const jsonString = JSON.stringify(flowData, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "credit-flow-export.json";
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [reactFlowInstance]);

  return (
    <div ref={reactFlowWrapper} className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
        attributionPosition="bottom-right"
        connectionLineStyle={{ stroke: "#64748b", strokeWidth: 2 }}
        defaultEdgeOptions={{ 
          style: { stroke: "#64748b", strokeWidth: 2 },
          type: "smoothstep"
        }}
      >
        <Background variant={BackgroundVariant.Dots} color="#e2e8f0" gap={16} />
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          nodeColor={nodeColor}
        />
        <Panel position="top-right">
          <button 
            onClick={onExport} 
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
          >
            Export Flow
          </button>
        </Panel>
      </ReactFlow>
      
      <NodePropertiesDialog
        selectedNode={selectedNode}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default function CreditFlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}
