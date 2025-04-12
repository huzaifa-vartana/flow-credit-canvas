
import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export default function RatingNode({ data }: NodeProps) {
  return (
    <div className="credit-flow-node rating-node">
      <div className="node-header">
        <span className="node-title">{data.label as React.ReactNode}</span>
        <span 
          className="node-badge" 
          style={{ 
            backgroundColor: data.color as string || "#64748b", 
            color: "white" 
          }}
        >
          {data.rating as React.ReactNode}
        </span>
      </div>
      <div className="node-content">
        <div className="node-description">{data.description as React.ReactNode}</div>
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
