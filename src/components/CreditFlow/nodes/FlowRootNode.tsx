
import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export default function FlowRootNode({ data }: NodeProps) {
  return (
    <div className="credit-flow-node root-node">
      <div className="node-header">
        <span className="node-title">{data.label as React.ReactNode}</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{ bottom: -8 }}
      />
    </div>
  );
}
