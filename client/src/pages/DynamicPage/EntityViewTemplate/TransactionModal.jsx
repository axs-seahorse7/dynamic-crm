const TransactionTemplate = ({ data }) => (
  <div>
    <h3>Transaction #{data.transactionId}</h3>
    <p><b>Status:</b> {data.status}</p>
    <p><b>Amount:</b> ₹{data.amount}</p>
    <p><b>Date:</b> {data.date}</p>
  </div>
);
export default TransactionTemplate;