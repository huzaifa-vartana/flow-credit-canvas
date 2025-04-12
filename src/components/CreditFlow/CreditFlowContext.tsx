
import React, { createContext, useContext, useState, useCallback } from "react";
import { 
  Node, 
  Edge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect, 
  NodeChange, 
  EdgeChange, 
  Connection, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges 
} from "@xyflow/react";
import { sampleCreditRules, parseRulesToFlow } from "./CreditFlowParser";

// Generate initial flow data from the sample rules
const flowData = parseRulesToFlow(sampleCreditRules);

interface CreditFlowContextType {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNewNode: (type: string, data: any) => void;
  loadRulesData: (rulesData: any) => void;
}

const CreditFlowContext = createContext<CreditFlowContextType | null>(null);

export function CreditFlowProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>(flowData.nodes);
  const [edges, setEdges] = useState<Edge[]>(flowData.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  const addNewNode = useCallback(
    (type: string, data: any) => {
      const newId = `node_${nodes.length + 1}`;
      const position = { x: 100, y: 100 };
      
      setNodes((nds) => [
        ...nds,
        {
          id: newId,
          type,
          position,
          data: { ...data, label: data.label || `New ${type}` },
        },
      ]);
    },
    [nodes, setNodes]
  );

  const loadRulesData = useCallback(
    (rulesData: any) => {
      try {
        const { nodes: newNodes, edges: newEdges } = parseRulesToFlow(rulesData);
        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error("Error loading rules data:", error);
      }
    },
    [setNodes, setEdges]
  );

  return (
    <CreditFlowContext.Provider
      value={{
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNewNode,
        loadRulesData,
      }}
    >
      {children}
    </CreditFlowContext.Provider>
  );
}

export function useCreditFlow() {
  const context = useContext(CreditFlowContext);
  if (!context) {
    throw new Error("useCreditFlow must be used within a CreditFlowProvider");
  }
  return context;
}
