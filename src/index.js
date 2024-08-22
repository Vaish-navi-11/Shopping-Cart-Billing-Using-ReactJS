import React, { useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css'
const initialState = {
  items: [],
};

const reducer = (state, action) => {
  switch (action.category) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    case 'DECREMENT':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const BillPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [showBill, setShowBill] = useState(false);

  const handleAddItem = () => {
    if (itemName && itemPrice) {
      const newItem = {
        id: Date.now(),
        name: itemName,
        price: parseFloat(itemPrice),
        quantity: 1,
      };
      dispatch({category: 'ADD_ITEM', payload: newItem });
      setItemName('');
      setItemPrice('');
      setShowBill(true);
    }
  };

  const handleRemoveItem = (id) => {
    dispatch({ category: 'REMOVE_ITEM', payload: { id } });
  };

  const handleIncrement = (id) => {
    dispatch({ category: 'INCREMENT', payload: { id } });
  };

  const handleDecrement = (id) => {
    dispatch({ category: 'DECREMENT', payload: { id } });
  };

  const handleReset = () => {
    dispatch({ category: 'RESET' });
    setShowBill(false);
  };

  const handleCancel = () => {
    dispatch({ category: 'RESET' });
    setShowBill(false);
  };

  const totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div class='Content'>
      <h1>Shopping Cart Bill Page</h1>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Item Price"
        value={itemPrice}
        onChange={(e) => setItemPrice(e.target.value)}
      />
      <button onClick={handleAddItem}>Add Item</button>
      <button onClick={handleReset}>Reset</button>
      {showBill && (
        <div class="bill">
          <h2>Bill Summary</h2>
          <table>
            <tr>
              <th>S.No</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Edit</th>
            </tr>
            {state.items.map((item, index) => (
  <><tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>Rs {item.price.toFixed(2)}</td>
                <td class="counter">
                  <button onClick={() => handleIncrement(item.id)}>+</button>
                  {item.quantity}
                  <button onClick={() => handleDecrement(item.id)}>-</button>
                </td>
                <td>Rs {(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                </td>
              </tr><tr>
                  <td colSpan={4}><h3>Total Amount</h3></td>
                  <td>Rs {totalAmount.toFixed(2)}</td>
                  <td><button onClick={handleCancel}>Cancel</button></td>
                </tr></>
 
))}
          </table></div>
      )}
    </div>
  );
};
ReactDOM.render(<BillPage />,document.getElementById('root'));