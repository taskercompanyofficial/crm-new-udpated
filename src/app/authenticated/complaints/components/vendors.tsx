import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchSelect from "@/components/custom/search-select";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { TextareaInput } from "@/components/custom/TextareaInput";

interface Service {
  service_type: string;
  work_type: string;
  service_amount: string;
  work_description: string;
}

export default function Services() {
  const [services, setServices] = React.useState<Service[]>([{
    service_type: "",
    work_type: "",
    service_amount: "",
    work_description: ""
  }]);

  const updateService = (index: number, field: keyof Service, value: string) => {
    setServices(prev => prev.map((s, i) =>
      i === index ? {...s, [field]: value} : s
    ));
  };

  return (
    <div className="p-4 mt-4 space-y-4 bg-white border rounded dark:bg-slate-900">
      <h3 className="text-base font-medium">External Services Details</h3>
      
      {services.map((service, index) => (
        <Collapsible key={index} className="border rounded">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800">
            <span>Service Details #{index + 1}</span>
            <ChevronDown className="w-4 h-4" />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="p-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <SearchSelect
                options={[
                  { value: "1", label: "External Repair Service" },
                  { value: "2", label: "Specialized Testing" },
                  { value: "3", label: "Component Replacement" },
                  { value: "4", label: "Expert Consultation" },
                  { value: "5", label: "Quality Inspection" }
                ]}
                label="Service Type"
                value={service.service_type}
                onChange={e => updateService(index, 'service_type', e)}
                width="full"
              />

              <SearchSelect
                options={[
                  { value: "repair", label: "General Repair & Maintenance" },
                  { value: "pcb", label: "Circuit Board Service" },
                  { value: "display", label: "Display & Screen Service" },
                  { value: "chip", label: "Microchip Service" },
                  { value: "diagnostic", label: "Technical Diagnosis" },
                  { value: "component", label: "Parts Replacement" },
                  { value: "software", label: "Software & Firmware Update" }
                ]}
                label="Service Category"
                value={service.work_type}
                onChange={e => updateService(index, 'work_type', e)}
                width="full"
              />

              <LabelInputContainer
                label="Service Charges"
                type="number"
                placeholder="Enter service amount"
                value={service.service_amount}
                onChange={e => updateService(index, 'service_amount', e.target.value)}
              />

              <TextareaInput
                label="Work Description"
                placeholder="Enter detailed service description..."
                value={service.work_description}
                onChange={e => updateService(index, 'work_description', e.target.value)}
              />
            </div>

            {services.length > 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setServices(prev => prev.filter((_, i) => i !== index))}
              >
                Remove Service
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setServices(prev => [...prev, {
          service_type: "",
          work_type: "",
          service_amount: "",
          work_description: ""
        }])}
      >
        Add New Service
      </Button>
    </div>
  );
}
