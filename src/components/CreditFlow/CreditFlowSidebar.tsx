
import { useCreditFlow } from "./CreditFlowContext";
import { useState } from "react";
import { sampleCreditRules } from "./CreditFlowParser";

const nodeTypes = [
  {
    type: "ratingNode",
    label: "Rating",
    description: "Add a new credit rating category",
    icon: "⭐",
    defaultData: { 
      label: "New Rating", 
      rating: "Custom",
      description: "Custom Rating",
      color: "#64748b"
    }
  },
  {
    type: "conditionGroupNode",
    label: "Condition Group",
    description: "Group of conditions with AND/OR logic",
    icon: "🔀",
    defaultData: { 
      label: "Condition Group", 
      operation: "AND",
      parentRating: ""
    }
  },
  {
    type: "conditionNode",
    label: "Condition",
    description: "Individual condition with operator",
    icon: "📏",
    defaultData: { 
      name: "custom_condition",
      description: "Custom condition",
      value: 0,
      operator: ">=",
      parentGroup: ""
    }
  },
  {
    type: "bureauNode",
    label: "Bureau",
    description: "Credit bureau source",
    icon: "🏢",
    defaultData: { 
      label: "Bureau",
      bureau: "custom",
      operation: "AND",
      parentRating: ""
    }
  },
  {
    type: "scoreNode",
    label: "Score",
    description: "Credit score threshold",
    icon: "📊",
    defaultData: { 
      name: "custom_score",
      value: 0,
      operator: ">=",
      applyScoreAdjustment: false,
      parentBureau: ""
    }
  }
];

export default function CreditFlowSidebar() {
  const { addNewNode, loadRulesData } = useCreditFlow();
  const [expanded, setExpanded] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ type: nodeType, data }));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleLoadSample = () => {
    loadRulesData(sampleCreditRules);
  };

  const handleImportJson = () => {
    try {
      const rulesData = JSON.parse(jsonInput);
      loadRulesData(rulesData);
      setShowImport(false);
      setJsonInput("");
    } catch (error) {
      console.error("Invalid JSON:", error);
      alert("Invalid JSON format");
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${expanded ? 'w-64' : 'w-16'} flex flex-col h-full`}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className={`font-medium text-gray-800 ${expanded ? 'block' : 'hidden'}`}>Credit Flow Nodes</h3>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {expanded ? '◀' : '▶'}
        </button>
      </div>
      
      <div className={`p-2 overflow-y-auto flex-grow ${showImport ? 'hidden' : 'block'}`}>
        {nodeTypes.map((item) => (
          <div
            key={item.type}
            className="bg-gray-50 p-3 mb-2 rounded shadow-sm border border-gray-200 cursor-grab hover:bg-gray-100 transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, item.type, item.defaultData)}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-2">{item.icon}</span>
              <div className={expanded ? 'block' : 'hidden'}>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showImport && expanded && (
        <div className="p-4 overflow-y-auto flex-grow">
          <h4 className="font-medium text-gray-800 mb-2">Import Rules JSON</h4>
          <textarea 
            className="w-full h-64 p-2 text-sm border border-gray-300 rounded mb-3"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your rules JSON here..."
          />
          <div className="flex gap-2">
            <button 
              onClick={handleImportJson}
              className="bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition-colors text-sm"
            >
              Import
            </button>
            <button 
              onClick={() => setShowImport(false)}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded shadow hover:bg-gray-300 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {expanded && (
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex gap-2 mb-3">
            <button 
              onClick={() => setShowImport(!showImport)}
              className="flex-1 bg-gray-100 text-gray-800 px-2 py-1.5 rounded shadow hover:bg-gray-200 transition-colors text-sm"
            >
              {showImport ? 'Show Nodes' : 'Import JSON'}
            </button>
            <button 
              onClick={handleLoadSample}
              className="flex-1 bg-gray-100 text-gray-800 px-2 py-1.5 rounded shadow hover:bg-gray-200 transition-colors text-sm"
            >
              Load Sample
            </button>
          </div>
          
          <h4 className="font-medium text-sm text-gray-700 mb-2">Instructions</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Drag nodes to the canvas</li>
            <li>• Connect nodes by dragging between handles</li>
            <li>• Double-click nodes to edit properties</li>
            <li>• Use the controls to zoom and pan</li>
          </ul>
        </div>
      )}
    </div>
  );
}
