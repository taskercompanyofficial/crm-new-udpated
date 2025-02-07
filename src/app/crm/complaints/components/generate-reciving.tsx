import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  complaint: any;
  username: string;
  role: string;
}

export default function ProductReceipt({ complaint, username, role }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the receipt");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { 
              font-family: sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 10px;
            }
            .hidden { 
              display: block !important;
            }
            @media print {
              body { 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${content.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const receiptContainerStyle = {
    position: "relative" as const,
    display: "none",
  };

  const receiptContentStyle = {
    fontFamily: "sans-serif",
    backgroundColor: "white",
    color: "black",
    padding: "16px",
    border: "1px dashed #1f2937",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  };

  const headerStyle = {
    width: "100%",
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  };

  const titleStyle = {
    fontSize: "10px",
    fontWeight: "500",
    margin: "0",
  };

  const companyNameStyle = {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0",
  };

  const contactInfoStyle = {
    fontSize: "10px",
    margin: "0",
  };

  const addressStyle = {
    fontSize: "10px",
    margin: "0",
  };

  const detailsRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    fontSize: "10px",
  };

  const underlinedTextStyle = {
    borderBottom: "1px dashed #1f2937",
  };

  const urduTextStyle = {
    fontFamily: "Urdu",
    textAlign: "right" as const,
    fontSize: "10px",
  };

  const qrCodeStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "8px",
    flexDirection: "column" as const,
    marginBottom: "8px",
  };

  const urduSectionStyle = {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row-reverse" as const,
    alignItems: "center",
    gap: "8px",
  };

  const trackerUrl = `https://www.taskercompany.com/tracker/${complaint.complain_num}`;

  return (
    <div>
      <Button size="sm" variant="outline" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print Receipt
      </Button>

      <div style={receiptContainerStyle}>
        <div ref={receiptRef} style={receiptContentStyle}>
          <img
            src="/simple-icon.png"
            alt="logo"
            style={{
              position: "absolute",
              top: "40px",
              left: "40px",
              width: "150px",
              height: "auto",
            }}
          />
          <div style={headerStyle}>
            <h2 style={titleStyle}>PRODUCT RECEIPT</h2>
            <h3 style={companyNameStyle}>
              Tasker Company <span style={{ fontSize: "10px" }}>(ASC)</span>
            </h3>
            <p style={contactInfoStyle}>
              <strong>WHATSAPP</strong> 03025117000 - <strong>Landline</strong>{" "}
              04236667000
            </p>
            <p style={addressStyle}>
              St: 09 Iqbal Park DHA Main Boulevard Lahore
            </p>
          </div>
          <div style={detailsRowStyle}>
            <div>
              <strong>Receipt Date/Time:</strong>
              <span style={{ ...underlinedTextStyle }}>
                {new Date().toLocaleString()}
              </span>
            </div>
            <div>
              <strong>Complaint No:</strong>{" "}
              <span style={underlinedTextStyle}>{complaint.complain_num}</span>
            </div>
          </div>
          <div style={detailsRowStyle}>
            <div>
              <strong>Customer Name:</strong>{" "}
              <span style={underlinedTextStyle}>
                {complaint.applicant_name}
              </span>
            </div>
            <div>
              <strong>Product:</strong>{" "}
              <span style={underlinedTextStyle}>{complaint.product}</span>
            </div>
          </div>
          <div style={detailsRowStyle}>
            <div>
              <strong>Model:</strong>{" "}
              <span style={underlinedTextStyle}>{complaint.model}</span>
            </div>
            <div>
              <strong>Serial No:</strong>{" "}
              <span style={underlinedTextStyle}>
                {complaint.serial_number_ind}
              </span>
            </div>
          </div>
          <div style={detailsRowStyle}>
            <div>
              <strong>Contact:</strong>{" "}
              <span style={underlinedTextStyle}>
                {complaint.applicant_phone}
              </span>
            </div>
            <div>
              <strong>Advance:</strong>{" "}
              <span style={underlinedTextStyle}></span>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: "10px" }}>
            <strong>Public Dealing Timing:</strong>
          </p>
          <p style={{ fontSize: "10px", margin: "0", marginLeft: "8px" }}>
            9:00 AM - 6:00 PM (Monday to Saturday)
          </p>
          <div style={urduSectionStyle}>
            <div style={urduTextStyle}>
              <h4 style={{ fontWeight: "bold", fontSize: "10px" }}>
                شرائط و ضوابط:
              </h4>
              <div style={{ paddingRight: "16px", textAlign: "right" }}>
                <p>
                  مصنوعات کی سروس چارجز کے بارے میں معلومات حاصل کرنے کے لیے کم
                  از کم دو گھنٹے بعد رابطہ کریں۔
                </p>
                <p>
                  سروس کسٹمر کی اجازت اور مکمل پیمنٹ کی ادائیگی کے بعد شروع کی
                  جائے گی۔
                </p>
                <p>سلپ تاریخ اجرا کے دو مہینے بعد تک کارآمد رہے گی۔</p>
                <p>اوریجنل رسید کے بغیر مصنوعات نہیں دی جائے گی۔</p>
                <p>
                  مصنوعات کی معلومات کے لیے اپنا کمپلین نمبر دفتری اوقات میں
                  سروس کے نمائیندے کو بتائیں۔
                </p>
                <p>
                  وارنٹی میں سروس حاصل کرنے کے لیے اپنی مصنوعات کا اوریجنل
                  وارنٹی کارڈ بمع فوٹو کاپی ہمراہ لائیں۔
                </p>
                <p>
                  ابتدائی معائینہ چارجز یونٹ کی مرمت ہونے یا نہ ہونے دونوں
                  صورتوں میں ادا کرنے ہوں گے۔
                </p>
                <p>
                  یوںٹ کی رپیرنگ مکمل ہونے کے بعد <strong>بقایا چارجز</strong>{" "}
                  آفس میں یا{" "}
                  <strong>فیصل بینک اکاؤنٹ نمبر 3287787000003300</strong> ٹاسکر
                  کمپنی کے نام میں جمع کروائیں۔{" "}
                  <strong>صرف آفیشل رسید قابل قبول ہوگی۔</strong>
                </p>
              </div>
            </div>
            <div style={qrCodeStyle}>
              <QRCodeSVG value={trackerUrl} size={100} />
              <p style={{ fontSize: "8px", textAlign: "center" }}>
                Track Your Complaint
              </p>
            </div>
          </div>
          <p style={{ fontWeight: "600", fontSize: "10px" }}>
            Prepared By:{" "}
            <span style={underlinedTextStyle}>
              {username} -{" "}
              <span style={{ fontSize: "6px" }}>
                ({role} in Tasker Company)
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
