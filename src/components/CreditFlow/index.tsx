
import { CreditFlowProvider } from "./CreditFlowContext";
import CreditFlowCanvas from "./CreditFlowCanvas";
import CreditFlowSidebar from "./CreditFlowSidebar";

export default function CreditFlow() {
  return (
    <CreditFlowProvider>
      <div className="flex h-screen bg-gray-50">
        <CreditFlowSidebar />
        <div className="flex-1 h-full">
          <CreditFlowCanvas />
        </div>
      </div>
    </CreditFlowProvider>
  );
}

export { CreditFlowProvider } from "./CreditFlowContext";
