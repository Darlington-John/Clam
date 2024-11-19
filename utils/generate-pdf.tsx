import { jsPDF } from 'jspdf';
import fontBase64, { expense, income } from '~/app/fonts/fonts.base64';
import { formatDate } from './formattedDate';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';
export function generatePDF(
   allBookData: any,
   user: any,
   setStatus: (status: 'idle' | 'printing' | 'success' | 'error') => void
) {
   try {
      const doc: any = new jsPDF();
      const logoUrl =
         'https://res.cloudinary.com/dycw73vuy/image/upload/v1731705634/Logo_awtr8a.png';
      const margin = 10;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const imageWidth = 30;
      const imageHeight = 30 / 2;
      doc.setFillColor('#F1F1F4');
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.addFileToVFS('InstrumentSerif.ttf', fontBase64);
      doc.addFont('InstrumentSerif.ttf', 'InstrumentSerif', 'normal');
      doc.addImage(logoUrl, 'PNG', margin, 10, imageWidth, imageHeight);
      doc.setFontSize(22);
      doc.setFont('InstrumentSerif');
      const statementText = 'Statement';
      const textWidth = doc.getTextWidth(statementText);
      const textX = pageWidth - margin - textWidth;
      doc.text(statementText, textX, 20);
      const currentDate = new Date().toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
      });
      const details = [
         { header: 'NAME', body: user?.name || user?.email },
         { header: 'PRINTED ON', body: currentDate },
         { header: 'BOOK NAME', body: allBookData?.name },
         { header: 'INCOME', body: `$${allBookData?.incomeTotal}` },
         { header: 'EXPENSE', body: `$${allBookData?.expenseTotal}` },
      ];
      const sectionX = 10;
      const sectionY = 35;
      const sectionWidth = pageWidth - 20;
      const sectionHeight = 33;
      const borderRadius = 5;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(
         sectionX,
         sectionY,
         sectionWidth,
         sectionHeight,
         borderRadius,
         borderRadius,
         'F'
      );
      doc.setTextColor(0, 0, 0);
      const textPadding = 10;
      const availableWidth = sectionWidth - 2 * textPadding;
      const numDetails = details.length;
      const columnWidth = availableWidth / numDetails + 5;
      let currentY = sectionY + textPadding + 5;
      details.forEach((detail, index) => {
         const currentX = sectionX + textPadding + index * columnWidth;
         doc.setFontSize(10);
         doc.setFont('Helvetica', 'normal');
         doc.text(detail?.header, currentX, currentY);
         const bodyText = String(detail.body || '');
         doc.setFontSize(14);
         doc.setFont('InstrumentSerif', 'normal');
         doc.text(bodyText, currentX, currentY + 5);
      });
      currentY += 35;
      doc.setFontSize(17);
      doc.text('Transactions', margin, currentY);
      const incomeIcon = income;
      const expenseIcon = expense;
      const columns = [
         { header: 'Amount ($)', dataKey: 'amount' },
         { header: '', dataKey: 'typeIcon' },
         { header: 'Date', dataKey: 'date' },
         { header: 'Tag', dataKey: 'tag' },
         { header: 'Note', dataKey: 'note' },
      ];
      const formattedData = Array.isArray(allBookData?.entries)
         ? allBookData.entries.map((entry: any, index: number) => {
              return {
                 amount: `$${entry?.amount}`,
                 typeIcon: '',
                 date: formatDate(entry?.createdAt),
                 tag: entry?.tag || '-',
                 note: entry?.note || '-',
                 expense: entry.expense,
                 income: entry.income,
              };
           })
         : [];
      const tableWidth = doc.internal.pageSize.width - 28;

      doc.autoTable({
         startY: currentY + 10,
         columns: columns,
         body: formattedData,
         tableLineColor: ['#DFDDE3'],
         tableLineWidth: 0.5,
         cellBorderRadius: 5,
         styles: {
            cellPadding: 3,
         },
         headStyles: {
            fillColor: ['#EAEAEC'],
            textColor: [0, 0, 0],
            fontSize: 10,
            fontStyle: 'normal',
         },
         tableWidth: '100%',
         theme: 'grid',
         columnStyles: {
            0: {
               cellWidth: tableWidth * 0.15,
               lineWidth: { top: 0, right: 0, bottom: 0.2, left: 0 },
            },
            1: {
               cellWidth: tableWidth * 0.05,
               lineWidth: { top: 0, right: 0, bottom: 0.2, left: 0 },
            },
            2: {
               cellWidth: tableWidth * 0.15,
               lineWidth: { top: 0, right: 0, bottom: 0.2, left: 0 },
            },
            3: {
               cellWidth: tableWidth * 0.2,
               fontSize: 9,
               lineWidth: { top: 0, right: 0, bottom: 0.2, left: 0 },
            },
            4: {
               cellWidth: tableWidth * 0.45,
               lineWidth: { top: 0, right: 0, bottom: 0.2, left: 0 },
            },
         },
         didDrawCell: function (data: any) {
            if (
               data.column.dataKey === 'typeIcon' &&
               (data.row.raw.expense || data.row.raw.income)
            ) {
               // Only add image to data cells
               const row = data.row.raw;
               const icon = row.expense ? expenseIcon : incomeIcon;

               if (icon) {
                  data.cell.text = [];

                  try {
                     doc.addImage(
                        icon,
                        'PNG',
                        data.cell.x + 2,
                        data.cell.y + 3,
                        data.cell.width - 5,
                        data.cell.height - 130
                     );
                  } catch (e) {
                     console.error('Error adding image:', e);
                  }
               }
            }
         },
      });

      const pdfBlobUrl = doc.output('bloburl');
      const iframe = document.getElementById(
         'pdf-preview'
      ) as HTMLIFrameElement;
      if (iframe) {
         iframe.src = pdfBlobUrl;
      }
      doc.save(`${allBookData?.name}_statement.pdf`);
      toast.success('Entries printed', {
         icon: <FaCheck color="white" />,
      });
      setStatus('success');
   } catch (error) {
      console.error('Error generating PDF:', error);
      setStatus('error');
      toast.error('Failed to generate PDF. Please try again.');
   }
}
