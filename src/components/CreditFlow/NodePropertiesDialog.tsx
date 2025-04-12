
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Node, useReactFlow } from "@xyflow/react";

interface NodePropertiesDialogProps {
  selectedNode: Node | null;
  onClose: () => void;
}

export default function NodePropertiesDialog({
  selectedNode,
  onClose,
}: NodePropertiesDialogProps) {
  const [formData, setFormData] = useState<any>({});
  const { setNodes } = useReactFlow();

  useEffect(() => {
    if (selectedNode) {
      setFormData(selectedNode.data || {});
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData((prev: any) => ({
        ...prev,
        [name]: parseInt(value, 10) || 0,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: formData,
          };
        }
        return node;
      })
    );
    onClose();
  };

  const renderFields = () => {
    switch (selectedNode.type) {
      case "ratingNode":
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label" className="text-right">
                  Label
                </Label>
                <Input
                  id="label"
                  name="label"
                  value={formData.label || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Rating
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  value={formData.rating || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <div className="flex col-span-3 gap-2 items-center">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    value={formData.color || "#64748b"}
                    onChange={handleInputChange}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    name="color"
                    value={formData.color || "#64748b"}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case "conditionGroupNode":
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label" className="text-right">
                  Label
                </Label>
                <Input
                  id="label"
                  name="label"
                  value={formData.label || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="operation" className="text-right">
                  Operation
                </Label>
                <Select
                  value={formData.operation || "AND"}
                  onValueChange={(value) => handleSelectChange("operation", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      case "conditionNode":
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="operator" className="text-right">
                  Operator
                </Label>
                <Select
                  value={formData.operator || ">="}
                  onValueChange={(value) => handleSelectChange("operator", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">=">≥ (Greater than or equal)</SelectItem>
                    <SelectItem value="<=">≤ (Less than or equal)</SelectItem>
                    <SelectItem value="<">{'<'} (Less than)</SelectItem>
                    <SelectItem value=">">{'>'} (Greater than)</SelectItem>
                    <SelectItem value="=">=  (Equal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  Value
                </Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  value={formData.value || 0}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
          </>
        );

      case "bureauNode":
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label" className="text-right">
                  Label
                </Label>
                <Input
                  id="label"
                  name="label"
                  value={formData.label || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bureau" className="text-right">
                  Bureau
                </Label>
                <Select
                  value={formData.bureau || "custom"}
                  onValueChange={(value) => handleSelectChange("bureau", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select bureau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paynet">PayNet</SelectItem>
                    <SelectItem value="dnb">Dun & Bradstreet</SelectItem>
                    <SelectItem value="experian">Experian</SelectItem>
                    <SelectItem value="equifax">Equifax</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="operation" className="text-right">
                  Operation
                </Label>
                <Select
                  value={formData.operation || "AND"}
                  onValueChange={(value) => handleSelectChange("operation", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      case "scoreNode":
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="operator" className="text-right">
                  Operator
                </Label>
                <Select
                  value={formData.operator || ">="}
                  onValueChange={(value) => handleSelectChange("operator", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">=">≥ (Greater than or equal)</SelectItem>
                    <SelectItem value="<=">≤ (Less than or equal)</SelectItem>
                    <SelectItem value="<">{'<'} (Less than)</SelectItem>
                    <SelectItem value=">">{'>'} (Greater than)</SelectItem>
                    <SelectItem value="=">=  (Equal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  Value
                </Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  value={formData.value || 0}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="applyScoreAdjustment" className="text-right">
                  Apply Score Adjustment
                </Label>
                <div className="flex items-center gap-2 col-span-3">
                  <Switch
                    id="applyScoreAdjustment"
                    checked={formData.applyScoreAdjustment || false}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("applyScoreAdjustment", checked)
                    }
                  />
                  <span className="text-sm text-gray-500">
                    {formData.applyScoreAdjustment
                      ? "Adjustment will be applied"
                      : "No adjustment"}
                  </span>
                </div>
              </div>
            </div>
          </>
        );

      case "flowRoot":
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label" className="text-right">
                  Label
                </Label>
                <Input
                  id="label"
                  name="label"
                  value={formData.label || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="py-4">
            <p className="text-center text-gray-500">
              No editable properties for this node type.
            </p>
          </div>
        );
    }
  };

  // Get a nice title for the dialog based on node type
  const getDialogTitle = () => {
    switch (selectedNode.type) {
      case "ratingNode":
        return "Edit Rating";
      case "conditionGroupNode":
        return "Edit Condition Group";
      case "conditionNode":
        return "Edit Condition";
      case "bureauNode":
        return "Edit Bureau";
      case "scoreNode":
        return "Edit Score";
      case "flowRoot":
        return "Edit Root Node";
      default:
        return "Edit Node";
    }
  };

  return (
    <Dialog open={!!selectedNode} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            Make changes to the node properties. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {renderFields()}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
