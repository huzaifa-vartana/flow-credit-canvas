
import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export default function ScoreNode({ data }: NodeProps) {
  const getOperatorSymbol = (op: string) => {
    switch (op) {
      case ":>=":
      case ">=":
        return "≥";
      case ":<=":
      case "<=":
        return "≤";
      case ":<":
      case "<":
        return "<";
      case ":>":
      case ">":
        return ">";
      case ":=":
      case "=":
        return "=";
      default:
        return op;
    }
  };

  return (
    <div className="credit-flow-node score-node">
      <div className="node-header">
        <span className="node-title">{data.name as React.ReactNode}</span>
      </div>
      <div className="node-content">
        <div className="node-value">
          <span>{getOperatorSymbol(data.operator as string)}</span>
          <span>{data.value as React.ReactNode}</span>
        </div>
        {data.applyScoreAdjustment && (
          <div className="mt-2 text-xs text-blue-600 font-medium">
            Score adjustment applies
          </div>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        style={{ top: -8 }}
      />
    </div>
  );
}
