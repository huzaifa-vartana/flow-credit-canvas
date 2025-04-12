
import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export default function ConditionGroupNode({ data }: NodeProps) {
  const isAnd = (data.operation as string)?.toUpperCase() === "AND";
  
  return (
    <div className="credit-flow-node condition-group-node">
      <div className="node-header">
        <span className="node-title">{data.label as React.ReactNode}</span>
        <span className={`operation-badge ${isAnd ? 'and' : 'or'}`}>
          {data.operation as React.ReactNode}
        </span>
      </div>
      <div className="node-content">
        <div className="node-description">All conditions must be met</div>
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
