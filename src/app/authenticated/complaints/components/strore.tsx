"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchSelect from "@/components/custom/search-select";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { SelectInput } from "@/components/custom/SelectInput";
import { Skeleton } from "@/components/ui/skeleton";

type ApplianceType =
  | "AC"
  | "Washing-Machine"
  | "Refrigerator" 
  | "Oven"
  | "Microwave"
  | "Water-Dispenser"
  | "TV"
  | "Air-Purifier";

type ProductType =
  | "Indoor-Unit"
  | "Outdoor-Unit" 
  | "Top-Load"
  | "Front-Load"
  | "Double-Door"
  | "Single-Door"
  | "Built-in"
  | "Counter-Top"
  | "Bottom-Load"
  | "LED"
  | "LCD"
  | "Smart-TV"
  | "HEPA-Filter"
  | "Carbon-Filter";

type PartStatus = "Pending" | "Ordered" | "Received" | "Cancelled" | "Returned";

interface Part {
  id: number;
  name: string;
  quantity: number;
  used: boolean;
  appliance: ApplianceType;
  product: ProductType;
  serialNumber?: string;
  warranty?: string;
}

const PRODUCTS: Record<ApplianceType, ProductType[]> = {
  AC: ["Indoor-Unit", "Outdoor-Unit"],
  "Washing-Machine": ["Top-Load", "Front-Load"],
  Refrigerator: ["Double-Door", "Single-Door"],
  Oven: ["Built-in", "Counter-Top"],
  Microwave: ["Counter-Top"],
  "Water-Dispenser": ["Bottom-Load", "Top-Load"],
  TV: ["LED", "LCD", "Smart-TV"],
  "Air-Purifier": ["HEPA-Filter", "Carbon-Filter"]
} as const;

const APPLIANCE_PARTS: Record<
  ApplianceType,
  Partial<Record<ProductType, string[]>>
> = {
  AC: {
    "Indoor-Unit": ["Evaporator Coil", "Blower Motor", "PCB", "Display", "Remote Control", "Air Filter"],
    "Outdoor-Unit": ["Compressor", "Condenser", "Fan Motor", "Capacitor", "Refrigerant", "Control Board"],
  },
  "Washing-Machine": {
    "Top-Load": ["Agitator", "Lid Switch", "Timer", "Drain Pump", "Motor", "Control Panel"],
    "Front-Load": ["Door Lock", "Drum", "Shock Absorbers", "Belt", "Heating Element", "Seal"],
  },
  Refrigerator: {
    "Double-Door": ["Compressor", "Defrost Timer", "Fan Motor", "Thermostat", "Ice Maker", "Door Seal"],
    "Single-Door": ["Compressor", "Door Seal", "Thermostat", "Shelf", "Crisper", "Light"],
  },
  Oven: {
    "Built-in": ["Heating Element", "Thermostat", "Control Panel", "Fan", "Door Hinge", "Light"],
    "Counter-Top": ["Timer", "Heating Element", "Door Switch", "Tray", "Control Knob", "Glass"],
  },
  Microwave: {
    "Counter-Top": ["Magnetron", "Turntable", "Door Switch", "Control Panel", "Waveguide", "Transformer"],
  },
  "Water-Dispenser": {
    "Bottom-Load": ["Compressor", "Water Pump", "Cooling Tank", "Filter", "Tap", "Thermostat"],
    "Top-Load": ["Tap", "Float Valve", "Water Tank", "Filter", "Cooling System", "Heating Element"],
  },
  TV: {
    "LED": ["Screen", "Power Board", "Main Board", "Backlight", "Speakers", "Remote"],
    "LCD": ["Display Panel", "Inverter", "T-Con Board", "Power Supply", "Buttons", "Stand"],
    "Smart-TV": ["Motherboard", "WiFi Module", "Display", "Power Board", "IR Sensor", "HDMI Ports"]
  },
  "Air-Purifier": {
    "HEPA-Filter": ["Filter Element", "Fan", "Control Board", "Sensor", "Pre-filter", "Motor"],
    "Carbon-Filter": ["Carbon Layer", "Fan Assembly", "Circuit Board", "Filter Frame", "UV Lamp", "Ionizer"]
  }
} as const;

const BRANDS = [
  "Samsung",
  "LG",
  "Haier",
  "Dawlance",
  "Orient",
  "PEL",
  "Gree",
  "Kenwood",
  "Sony",
  "Panasonic",
  "TCL",
  "Philips"
] as const;

type Brand = (typeof BRANDS)[number];

interface BrandPart {
  id: number;
  brand: Brand;
  appliance: ApplianceType;
  product: ProductType;
  part: string;
  quantity: number;
  isCustom?: boolean;
  status: PartStatus;
  serialNumber?: string;
  warranty?: string;
  price?: number;
}

export default function Store() {
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);
  const [brandParts, setBrandParts] = useState<BrandPart[]>([]);

  const [selectedAppliance, setSelectedAppliance] =
    useState<ApplianceType>("AC");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductType>("Indoor-Unit");

  const [newPart, setNewPart] = useState<{
    name: string;
    quantity: number;
    appliance: ApplianceType;
    product: ProductType;
    serialNumber?: string;
    warranty?: string;
  }>({
    name: "",
    quantity: 0,
    appliance: selectedAppliance,
    product: selectedProduct,
    serialNumber: "",
    warranty: ""
  });

  const [newBrandPart, setNewBrandPart] = useState<{
    brand: string;
    appliance: ApplianceType;
    product: ProductType;
    part: string;
    quantity: number;
    isCustom: boolean;
    status: PartStatus;
    serialNumber?: string;
    warranty?: string;
    price?: number;
  }>({
    brand: "",
    appliance: selectedAppliance,
    product: selectedProduct,
    part: "",
    quantity: 0,
    isCustom: false,
    status: "Pending",
    serialNumber: "",
    warranty: "",
    price: 0
  });

  const handleAddPart = () => {
    if (newPart.name && newPart.quantity > 0) {
      setLoading(true);
      setTimeout(() => {
        setParts([
          ...parts,
          {
            id: parts.length + 1,
            name: newPart.name,
            quantity: newPart.quantity,
            used: false,
            appliance: selectedAppliance,
            product: selectedProduct,
            serialNumber: newPart.serialNumber,
            warranty: newPart.warranty
          },
        ]);
        setNewPart({
          name: "",
          quantity: 0,
          appliance: selectedAppliance,
          product: selectedProduct,
          serialNumber: "",
          warranty: ""
        });
        setLoading(false);
      }, 500);
    }
  };

  const handleAddBrandPart = () => {
    if (newBrandPart.brand && newBrandPart.part && newBrandPart.quantity > 0) {
      setLoading(true);
      setTimeout(() => {
        setBrandParts([
          ...brandParts,
          {
            id: brandParts.length + 1,
            brand: newBrandPart.brand as Brand,
            appliance: newBrandPart.appliance,
            product: newBrandPart.product,
            part: newBrandPart.part,
            quantity: newBrandPart.quantity,
            isCustom: newBrandPart.isCustom,
            status: newBrandPart.status,
            serialNumber: newBrandPart.serialNumber,
            warranty: newBrandPart.warranty,
            price: newBrandPart.price
          },
        ]);
        setNewBrandPart({
          brand: "",
          appliance: selectedAppliance,
          product: selectedProduct,
          part: "",
          quantity: 0,
          isCustom: false,
          status: "Pending",
          serialNumber: "",
          warranty: "",
          price: 0
        });
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Store Inventory</TabsTrigger>
          <TabsTrigger value="brand-demands">Brand Part Demands</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-semibold">Parts Inventory</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPart();
              }}
              className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              <SelectInput
                options={
                  Object.keys(APPLIANCE_PARTS).map((appliance) => ({
                    label: appliance,
                    value: appliance,
                  })) || []
                }
                onChange={(value: string) => {
                  setSelectedAppliance(value as ApplianceType);
                  setSelectedProduct(PRODUCTS[value as ApplianceType][0]);
                  setNewPart((prev) => ({ ...prev, name: "" }));
                }}
                selected={selectedAppliance}
                label="Search Appliance"
              />

              <SelectInput
                options={
                  PRODUCTS[selectedAppliance]?.map((product) => ({
                    label: product,
                    value: product,
                  })) || []
                }
                onChange={(value: string) => {
                  setSelectedProduct(value as ProductType);
                  setNewPart((prev) => ({ ...prev, name: "" }));
                }}
                selected={selectedProduct}
                label="Search Type"
              />
              <SearchSelect
                value={newPart.name}
                onChange={(value: string) =>
                  setNewPart({ ...newPart, name: value })
                }
                options={
                  APPLIANCE_PARTS[selectedAppliance]?.[selectedProduct]?.map(
                    (part) => ({
                      label: part,
                      value: part,
                    }),
                  ) || []
                }
                label="Search parts"
                width="full"
              />

              <LabelInputContainer
                type="number"
                label="Quantity"
                min={0}
                value={newPart.quantity}
                onChange={(e) =>
                  setNewPart({
                    ...newPart,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Enter quantity"
                className="w-full"
              />
              <br />
              <div className="flex items-center justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Appliance</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Part Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell>{part.appliance}</TableCell>
                        <TableCell>{part.product}</TableCell>
                        <TableCell>{part.name}</TableCell>
                        <TableCell>{part.quantity}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={part.used}
                            onCheckedChange={() =>
                              setParts(
                                parts.map((p) =>
                                  p.id === part.id
                                    ? { ...p, used: !p.used }
                                    : p,
                                ),
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setParts(parts.filter((p) => p.id !== part.id))
                            }
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="brand-demands">
          <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-semibold">Brand Part Demands</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddBrandPart();
              }}
              className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <SearchSelect
                value={newBrandPart.brand}
                onChange={(value: string) =>
                  setNewBrandPart({ ...newBrandPart, brand: value })
                }
                options={BRANDS.map((brand) => ({
                  label: brand,
                  value: brand,
                }))}
                label="Search brands"
                width="full"
              />

              <SelectInput
                options={Object.keys(APPLIANCE_PARTS).map((appliance) => ({
                  label: appliance,
                  value: appliance,
                }))}
                onChange={(value: string) => {
                  setNewBrandPart({
                    ...newBrandPart,
                    appliance: value as ApplianceType,
                    product: PRODUCTS[value as ApplianceType][0],
                    part: "",
                  });
                }}
                selected={newBrandPart.appliance}
                label="Appliance Type"
              />

              <SelectInput
                options={PRODUCTS[newBrandPart.appliance].map((product) => ({
                  label: product,
                  value: product,
                }))}
                onChange={(value: string) =>
                  setNewBrandPart({
                    ...newBrandPart,
                    product: value as ProductType,
                    part: "",
                  })
                }
                selected={newBrandPart.product}
                label="Product Type"
              />

              <div className="space-y-2">
                {newBrandPart.isCustom ? (
                  <div>
                    <Label>Custom Part Name</Label>
                    <Input
                      value={newBrandPart.part}
                      onChange={(e) =>
                        setNewBrandPart({
                          ...newBrandPart,
                          part: e.target.value,
                        })
                      }
                      placeholder="Enter custom part name"
                    />
                  </div>
                ) : (
                  <SearchSelect
                    value={newBrandPart.part}
                    onChange={(value: string) =>
                      setNewBrandPart({ ...newBrandPart, part: value })
                    }
                    options={
                      APPLIANCE_PARTS[newBrandPart.appliance]?.[
                        newBrandPart.product
                      ]?.map((part) => ({
                        label: part,
                        value: part,
                      })) || []
                    }
                    label="Search parts"
                    width="full"
                  />
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom-part"
                    checked={newBrandPart.isCustom}
                    onCheckedChange={(checked: boolean) =>
                      setNewBrandPart({
                        ...newBrandPart,
                        isCustom: checked,
                        part: "",
                      })
                    }
                  />
                  <Label htmlFor="custom-part">Custom part</Label>
                </div>
              </div>

              <SelectInput
                options={[
                  { label: "Pending", value: "Pending" },
                  { label: "Ordered", value: "Ordered" },
                  { label: "Received", value: "Received" },
                  { label: "Cancelled", value: "Cancelled" },
                  { label: "Returned", value: "Returned" }
                ]}
                onChange={(value: string) =>
                  setNewBrandPart({
                    ...newBrandPart,
                    status: value as PartStatus,
                  })
                }
                selected={newBrandPart.status}
                label="Status"
              />

              <div className="space-y-2">
                <div className="flex gap-2">
                  <LabelInputContainer
                    type="number"
                    label="Quantity"
                    min={0}
                    value={newBrandPart.quantity}
                    onChange={(e) =>
                      setNewBrandPart({
                        ...newBrandPart,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter quantity"
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Brand</TableHead>
                      <TableHead>Appliance</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Part Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Custom</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brandParts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell>{part.brand}</TableCell>
                        <TableCell>{part.appliance}</TableCell>
                        <TableCell>{part.product}</TableCell>
                        <TableCell>{part.part}</TableCell>
                        <TableCell>{part.quantity}</TableCell>
                        <TableCell>
                          <SelectInput
                            options={[
                              { label: "Pending", value: "Pending" },
                              { label: "Ordered", value: "Ordered" },
                              { label: "Received", value: "Received" },
                              { label: "Cancelled", value: "Cancelled" },
                              { label: "Returned", value: "Returned" }
                            ]}
                            onChange={(value: string) =>
                              setBrandParts(
                                brandParts.map((p) =>
                                  p.id === part.id
                                    ? { ...p, status: value as PartStatus }
                                    : p,
                                ),
                              )
                            }
                            selected={part.status}
                            label=""
                          />
                        </TableCell>
                        <TableCell>{part.isCustom ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setBrandParts(
                                brandParts.filter((p) => p.id !== part.id),
                              )
                            }
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
