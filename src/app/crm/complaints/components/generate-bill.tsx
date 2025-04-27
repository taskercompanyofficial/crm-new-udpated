import React, { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Receipt,
    Plus,
    Trash2,
    Printer,
    Save
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const BUSINESS_INFO = {
    name: "Tasker Company",
    ntn: "5054911-7",
    contact: "03015117000",
    contactPerson: "Naveed Majeed",
    email: "info@taskercompany.com",
    address: "#1030 AA, near xyz, Lahore"
};

interface BillItem {
    description: string;
    quantity: number;
    amount: number;
}

interface GenerateBillProps {
    complaint: any;
}

export function GenerateBill({ complaint }: GenerateBillProps) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<BillItem[]>([
        { description: "", quantity: 1, amount: 0 }
    ]);
    const [headerText, setHeaderText] = useState("Bill For");
    const printRef = useRef<HTMLDivElement>(null);

    const totalAmount = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);

    const handleAddItem = () => {
        setItems([...items, { description: "", quantity: 1, amount: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
        const newItems = [...items];
        if (field === "quantity" || field === "amount") {
            newItems[index][field] = Number(value) || 0;
        } else {
            newItems[index][field] = value as never;
        }
        setItems(newItems);
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
    };

    const handleSaveBill = () => {
        console.log("Saving bill:", {
            complaintId: complaint.complain_num,
            headerText,
            items,
            totalAmount,
            date: new Date()
        });
        setOpen(false);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-PK').format(num);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Receipt className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="h-full overflow-y-auto scrollbar-hide p-4">
                <DialogHeader>
                    <DialogTitle>Generate Bill</DialogTitle>
                    <DialogDescription>
                        Create a bill for complaint #{complaint?.complain_num}
                    </DialogDescription>
                </DialogHeader>

                <div ref={printRef} className="p-8 border rounded-md bg-white">
                    <div className="flex items-center gap-4">
                        <img src="/tasker-latterhead.png" alt="Tasker Logo" className="h-50 w-full" />
                    </div>

                    <div className="flex justify-between mb-6">
                        <p className="text-sm"><strong>Ref:</strong> {complaint.complain_num}</p>
                        <p className="text-sm"><strong>NTN:</strong> {BUSINESS_INFO.ntn}</p>
                        <p className="text-sm"><strong>Date:</strong> {formatDate(new Date().toISOString())}</p>
                    </div>

                    <div className="mb-6">
                        <p><span className="font-medium"><strong>Kind Attn:</strong></span> {complaint.applicant_name}</p>
                        <p><span className="font-medium"><strong>Site:</strong></span> {complaint.applicant_adress}</p>
                    </div>

                    <div className="mb-6 flex justify-center">
                        <input
                            value={headerText}
                            onChange={(e) => setHeaderText(e.target.value)}
                            className="text-lg font-bold border-none p-0 bg-transparent focus:outline-none focus:ring-0"
                            placeholder="Bill For"
                        />
                    </div>

                    <table className="w-full mb-6">
                        <thead className="border-b border-gray-600">
                            <tr >
                                <th className="text-left border-b py-2">Description</th>
                                <th className="text-center border-b py-2">Qty</th>
                                <th className="text-right border-b py-2">Amount</th>
                                <th className="w-10 border-b py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-600 group">
                                    <td className="py-2">
                                        <input
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                            className="border-none w-full bg-transparent focus:outline-none focus:ring-0 text-xs font-bold"
                                            required
                                        />
                                    </td>
                                    <td className="text-center py-2">
                                        <input
                                            type="number"
                                            value={item.quantity === 0 ? "" : item.quantity}
                                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                            className="border-none text-center w-20 mx-auto bg-transparent focus:outline-none focus:ring-0 text-xs"
                                            required
                                            min="1"
                                        />
                                    </td>
                                    <td className="text-right py-2">
                                        <input
                                            type="number"
                                            value={item.amount === 0 ? "" : item.amount}
                                            onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                                            className="border-none text-right w-full bg-transparent focus:outline-none focus:ring-0 text-xs"
                                            required
                                            min="0"
                                        />
                                    </td>
                                    <td className="py-2">
                                        <div className="flex gap-1">
                                            {items.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0 h-8 w-8 text-red-500 hover:text-red-600 no-print"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {index === items.length - 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setItems([...items, { description: '', quantity: 0, amount: 0 }])}
                                                    className="p-0 h-8 w-8 text-gray-500 hover:text-gray-600 no-print opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold border-t">
                                <td colSpan={2} className="text-right py-2">Total Amount:</td>
                                <td className="text-right py-2">{formatNumber(totalAmount)}/-</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="mt-12">
                        <p className="mb-6">Yours truly,</p>
                        <p className="font-bold">{BUSINESS_INFO.name}</p>
                        <p>{BUSINESS_INFO.contactPerson}</p>
                        <p>{BUSINESS_INFO.contact}</p>
                    </div>
                </div>

                <DialogFooter>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrint}
                            className="flex items-center gap-1"
                        >
                            <Printer className="h-4 w-4" />
                            Print
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSaveBill}
                            className="flex items-center gap-1"
                        >
                            <Save className="h-4 w-4" />
                            Save & Close
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}