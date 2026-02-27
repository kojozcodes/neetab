import { useState, useCallback } from 'react';
import { Button } from '../../components/ui/FormControls';
import { DownloadButton } from '../../components/ui/FileComponents';
import { XIcon } from '../../components/ui/Icons';

interface LineItem {
  id: number;
  description: string;
  qty: number;
  price: number;
}

let nextId = 1;

export default function InvoiceGenerator() {
  const [from, setFrom] = useState({ name: '', address: '', email: '' });
  const [to, setTo] = useState({ name: '', address: '', email: '' });
  const [invoiceNo, setInvoiceNo] = useState(`INV-${String(Date.now()).slice(-6)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ id: nextId++, description: '', qty: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [currency, setCurrency] = useState('$');
  const [notes, setNotes] = useState('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  const addItem = () => setItems(prev => [...prev, { id: nextId++, description: '', qty: 1, price: 0 }]);
  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const subtotal = items.reduce((sum, i) => sum + (i.qty * i.price), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const fmt = (n: number) => `${currency}${n.toFixed(2)}`;

  const generatePDF = useCallback(async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pw = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', pw - 20, y, { align: 'right' });

      // Invoice details
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      y += 8;
      doc.text(`Invoice #: ${invoiceNo}`, pw - 20, y, { align: 'right' });
      y += 5;
      doc.text(`Date: ${date}`, pw - 20, y, { align: 'right' });
      if (dueDate) { y += 5; doc.text(`Due: ${dueDate}`, pw - 20, y, { align: 'right' }); }

      // From / To
      y = 28;
      doc.setTextColor(0);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('FROM', 20, y); doc.text('BILL TO', 90, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      if (from.name) { doc.setFont('helvetica', 'bold'); doc.text(from.name, 20, y); doc.setFont('helvetica', 'normal'); y += 4.5; }
      if (from.address) { from.address.split('\n').forEach(line => { doc.text(line, 20, y); y += 4; }); }
      if (from.email) { doc.text(from.email, 20, y); }

      y = 33;
      if (to.name) { doc.setFont('helvetica', 'bold'); doc.text(to.name, 90, y); doc.setFont('helvetica', 'normal'); y += 4.5; }
      if (to.address) { to.address.split('\n').forEach(line => { doc.text(line, 90, y); y += 4; }); }
      if (to.email) { doc.text(to.email, 90, y); }

      // Table header
      y = Math.max(y, 60) + 10;
      doc.setFillColor(245, 245, 245);
      doc.rect(20, y - 4, pw - 40, 8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Description', 22, y);
      doc.text('Qty', 120, y, { align: 'center' });
      doc.text('Price', 145, y, { align: 'right' });
      doc.text('Total', pw - 22, y, { align: 'right' });
      y += 8;

      // Table rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      items.forEach(item => {
        if (item.description || item.price > 0) {
          doc.text(item.description || '—', 22, y);
          doc.text(String(item.qty), 120, y, { align: 'center' });
          doc.text(fmt(item.price), 145, y, { align: 'right' });
          doc.text(fmt(item.qty * item.price), pw - 22, y, { align: 'right' });
          y += 6;
        }
      });

      // Totals
      y += 4;
      doc.setDrawColor(220);
      doc.line(120, y, pw - 20, y);
      y += 6;
      doc.text('Subtotal:', 130, y);
      doc.text(fmt(subtotal), pw - 22, y, { align: 'right' });
      if (taxRate > 0) {
        y += 5;
        doc.text(`Tax (${taxRate}%):`, 130, y);
        doc.text(fmt(tax), pw - 22, y, { align: 'right' });
      }
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Total:', 130, y);
      doc.text(fmt(total), pw - 22, y, { align: 'right' });

      // Notes
      if (notes) {
        y += 14;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Notes', 20, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100);
        const noteLines = doc.splitTextToSize(notes, pw - 40);
        doc.text(noteLines, 20, y);
      }

      setPdfBlob(doc.output('blob'));
    } catch (e) {
      console.error('PDF generation failed:', e);
    }
    setLoading(false);
  }, [from, to, invoiceNo, date, dueDate, items, taxRate, currency, notes, subtotal, tax, total]);

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="block text-[10px] font-semibold text-surface-500 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="input-field !py-1.5 text-xs" />
    </div>
  );

  return (
    <div>
      {/* Invoice meta */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <InputField label="Invoice #" value={invoiceNo} onChange={setInvoiceNo} />
        <InputField label="Date" value={date} onChange={setDate} type="date" />
        <InputField label="Due Date" value={dueDate} onChange={setDueDate} type="date" />
      </div>

      {/* From / To */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="p-2.5 bg-surface-100 dark:bg-surface-800 rounded-xl">
          <div className="text-[10px] font-bold text-surface-400 uppercase mb-1.5">From (Your info)</div>
          <div className="space-y-1.5">
            <input value={from.name} onChange={e => setFrom(p => ({ ...p, name: e.target.value }))}
              placeholder="Business name" className="input-field !py-1.5 text-xs" />
            <textarea value={from.address} onChange={e => setFrom(p => ({ ...p, address: e.target.value }))}
              placeholder="Address" className="input-field !py-1.5 text-xs min-h-[40px] resize-none" rows={2} />
            <input value={from.email} onChange={e => setFrom(p => ({ ...p, email: e.target.value }))}
              placeholder="Email" className="input-field !py-1.5 text-xs" />
          </div>
        </div>
        <div className="p-2.5 bg-surface-100 dark:bg-surface-800 rounded-xl">
          <div className="text-[10px] font-bold text-surface-400 uppercase mb-1.5">Bill To</div>
          <div className="space-y-1.5">
            <input value={to.name} onChange={e => setTo(p => ({ ...p, name: e.target.value }))}
              placeholder="Client name" className="input-field !py-1.5 text-xs" />
            <textarea value={to.address} onChange={e => setTo(p => ({ ...p, address: e.target.value }))}
              placeholder="Address" className="input-field !py-1.5 text-xs min-h-[40px] resize-none" rows={2} />
            <input value={to.email} onChange={e => setTo(p => ({ ...p, email: e.target.value }))}
              placeholder="Email" className="input-field !py-1.5 text-xs" />
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-surface-400 uppercase">Items</span>
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-surface-500">Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              className="text-xs bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded px-1.5 py-0.5">
              {['$', '€', '£', '¥', '₹', '₦', 'C$', 'A$'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        {items.map((item, idx) => (
          <div key={item.id} className="flex gap-1.5 mb-1.5 items-center">
            <input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)}
              placeholder="Description" className="input-field !py-1.5 text-xs flex-1" />
            <input type="number" value={item.qty || ''} onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
              placeholder="Qty" className="input-field !py-1.5 text-xs w-14 text-center" min={0} />
            <input type="number" value={item.price || ''} onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
              placeholder="Price" className="input-field !py-1.5 text-xs w-20 text-right" min={0} step="0.01" />
            <span className="text-xs font-semibold text-surface-500 w-16 text-right">{fmt(item.qty * item.price)}</span>
            {items.length > 1 && (
              <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-500 flex-shrink-0"><XIcon /></button>
            )}
          </div>
        ))}
        <button onClick={addItem} className="text-xs font-semibold text-brand-500 hover:text-brand-600 mt-1">
          + Add item
        </button>
      </div>

      {/* Tax + Totals */}
      <div className="flex items-center justify-end gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-surface-500">Tax %</span>
          <input type="number" value={taxRate || ''} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
            className="input-field !py-1 text-xs w-16 text-center" min={0} max={100} step="0.5" />
        </div>
        <div className="text-right">
          <div className="text-surface-500">Subtotal: <strong>{fmt(subtotal)}</strong></div>
          {taxRate > 0 && <div className="text-surface-500">Tax: <strong>{fmt(tax)}</strong></div>}
          <div className="text-lg font-bold text-brand-500">{fmt(total)}</div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-3">
        <label className="block text-[10px] font-semibold text-surface-500 mb-1">Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Payment terms, bank details, thank you message..."
          className="input-field !py-1.5 text-xs min-h-[40px] resize-none" rows={2} maxLength={500} />
      </div>

      <Button onClick={generatePDF} className="w-full" disabled={loading}>
        {loading ? 'Generating...' : '📄 Generate Invoice PDF'}
      </Button>

      {pdfBlob && (
        <DownloadButton blob={pdfBlob} filename={`${invoiceNo || 'invoice'}.pdf`} label="⬇ Download Invoice" />
      )}
    </div>
  );
}
