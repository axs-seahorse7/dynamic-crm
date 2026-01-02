const DocumentTemplate = ({ data }) => (
  <div>
    <h3>{data.documentType}</h3>
    <p><b>Invoice No:</b> {data.invoiceNo}</p>
    <p><b>Total:</b> ₹{data.total}</p>
  </div>
);

export default DocumentTemplate;