const ItemTemplate = ({ data }) => (
  <div>
    <h3>{data.name}</h3>
    <p><b>Category:</b> {data.category}</p>
    <p><b>Price:</b> ₹{data.price}</p>
    <p><b>Description:</b> {data.description}</p>
  </div>
);

export default ItemTemplate;