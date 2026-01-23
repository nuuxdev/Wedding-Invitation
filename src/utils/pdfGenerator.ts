
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


// Define the shape of data we need for the PDF
export interface GuestForPDF {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    plus: number;
    willAttend: string; // 'yes', 'maybe', 'no', 'not-filled'
    checkedIn: boolean;
}

export const generateGuestListPDF = (guests: GuestForPDF[]) => {
    const doc = new jsPDF();

    // Add customized font if needed, but for now we'll use standard font
    // Note: Standard fonts don't support Amharic. We will use English names.

    // Title
    doc.setFontSize(18);
    doc.text('Guest List', 14, 22);
    doc.setFontSize(11);
    doc.text(`Total Guests: ${guests.length}`, 14, 30);

    // Calculate stats
    const attending = guests.filter(g => g.willAttend === 'yes').length;
    const checkedIn = guests.filter(g => g.checkedIn).length;

    doc.text(`Attending: ${attending} | Checked In: ${checkedIn}`, 14, 36);

    const tableColumn = ["First Name", "Last Name", "Phone", "Plus", "Will Attend", "Checked In"];
    const tableRows: any[] = [];

    guests.forEach(guest => {
        const guestData = [
            guest.firstName,
            guest.lastName,
            guest.phoneNumber,
            guest.plus > 0 ? guest.plus.toString() : "0",
            guest.willAttend,
            guest.checkedIn ? "Yes" : "" // Using "Yes" text for checkmark representation in standard font
        ];
        tableRows.push(guestData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [66, 66, 66], // Dark gray
        },
        didParseCell: (data) => {
            // Optional: Custom styling for cells if needed
            if (data.section === 'body' && data.column.index === 5) {
                // Check In column
                if (data.cell.raw === "Yes") {
                    data.cell.styles.textColor = [0, 128, 0]; // Green for checked in
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        }
    });

    doc.save(`guest_list_${new Date().toISOString().slice(0, 10)}.pdf`);
};
