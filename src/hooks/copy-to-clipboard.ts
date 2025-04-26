import { toast } from "react-toastify";

export const copyToClipboard = (data: any | any[]) => {
    console.log(data);
    const rows = Array.isArray(data) ? data : [data];

    const formattedText = rows
        .map((data) => {
            return `
📋 *Complaint #${data.complain_num}*
*Brand Ref:* ${data.brand_complaint_no}

👤 *Applicant Details*
*Name:* ${data.applicant_name}
*Phone:* ${data.applicant_phone}
*WhatsApp:* ${data.applicant_whatsapp || "N/A"}
*Extra Numbers:* ${data.extra_numbers || "N/A"}
*Address:* ${data.applicant_adress}

📦 *Product Details*
*Product:* ${data.product || "N/A"}
*Brand:* ${data.brand_id || "N/A"}
*Model:* ${data.model || "N/A"}
*Serial (IND):* ${data.serial_number_ind || "N/A"}
*Serial (OUD):* ${data.serial_number_oud || "N/A"}

🔧 *Service Information*
*Branch:* ${data.branch_id || "N/A"}
*Type:* ${data.complaint_type}
*Complaint:* ${data.description}

*Created:* ${new Date(data.created_at).toLocaleDateString()}
-------------------`;
        })
        .join("\n\n");

    navigator.clipboard.writeText(formattedText);
    toast.success("Details copied to clipboard");
};