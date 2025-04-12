
import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export default function BureauNode({ data }: NodeProps) {
  const isAnd = (data.operation as string)?.toUpperCase() === "AND";
  
  const getBureauName = (code: string) => {
    switch (code.toLowerCase()) {
      case "paynet":
        return "PayNet";
      case "dnb":
        return "Dun & Bradstreet";
      case "experian":
        return "Experian";
      case "equifax":
        return "Equifax";
      default:
        return code;
    }
  };

  return (
    <div className="credit-flow-node bureau-node">
      <div className="node-header">
        <span className="node-title">{(data.label || getBureauName(data.bureau as string)) as React.ReactNode}</span>
        <span className={`operation-badge ${isAnd ? 'and' : 'or'}`}>
          {data.operation as React.ReactNode}
        </span>
      </div>
      <div className="node-content">
        <div className="node-description">Source: {data.bureau as React.ReactNode}</div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        style={{ top: -8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{ bottom: -8 }}
      />
    </div>
  );
}
