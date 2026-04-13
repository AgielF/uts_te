import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [role, setRole] = useState('Landing'); // Landing, Admin, Kasir
  const [products, setProducts] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [cart, setCart] = useState(null);
  
  // State Form Kontrak (B2B)
  const [newContract, setNewContract] = useState({
    supplier_id: 2, reseller_id: 3, product_id: '', qty: 0, price_agreed: 0, payment_type: 'Cash', return_policy: false
  });

  useEffect(() => {
    if (role !== 'Landing') {
      axios.get('http://localhost:8080/products').then(res => setProducts(res.data));
      axios.get('http://localhost:8080/contracts').then(res => setContracts(res.data));
    }
  }, [role]);

  const submitContract = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/contracts', {
      ...newContract, 
      vendor_id: 1,
      qty: parseInt(newContract.qty),
      price_agreed: parseFloat(newContract.price_agreed),
      return_policy: newContract.return_policy === 'true'
    }).then(() => {
      alert("Kontrak B2B Berhasil Dibuat!");
      window.location.reload();
    });
  };

  if (role === 'Landing') {
    return (
      <div className="landing-overlay">
        <div className="landing-card">
          <h1 style={{fontSize:'2.5rem', margin:'0'}}>TOKO<span>GO</span></h1>
          <p style={{color:'#64748b', marginBottom:'2rem'}}>Supply Chain & POS System v2.0</p>
          <div className="btn-group">
            <button className="btn-admin" onClick={() => setRole('Admin')}>DASHBOARD ADMIN</button>
            <button className="btn-kasir" onClick={() => setRole('Kasir')}>SISTEM KASIR</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h2 style={{color: 'white', marginBottom: '2rem'}}>MENU UTAMA</h2>
        <ul style={{listStyle: 'none', padding: 0}}>
          <li style={{padding: '1rem 0', borderBottom: '1px solid #334155', cursor: 'pointer'}} onClick={() => setRole('Admin')}>📊 Dashboard</li>
          <li style={{padding: '1rem 0', borderBottom: '1px solid #334155', cursor: 'pointer'}} onClick={() => setRole('Kasir')}>🛒 Kasir POS</li>
          <li style={{padding: '1rem 0', color: '#f87171', marginTop: '2rem', cursor: 'pointer'}} onClick={() => setRole('Landing')}>🏃 Keluar</li>
        </ul>
      </div>

      <div className="main-content">
        {role === 'Admin' ? (
          <div className="admin-view">
            <h1 style={{marginBottom: '2rem'}}>Dashboard Suplay Chain (B2B)</h1>
            
            <div className="stat-grid">
              <div className="stat-card"><h3>{products.length}</h3><p>Total Produk</p></div>
              <div className="stat-card"><h3>{contracts.length}</h3><p>Kontrak Aktif</p></div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
              {/* Form Kontrak Baru */}
              <div className="data-card">
                <div className="card-header"><b>Buat Kesepakatan Kontrak Baru</b></div>
                <form className="p-20" style={{padding: '20px'}} onSubmit={submitContract}>
                  <div className="form-group">
                    <label>Pilih Barang</label>
                    <select className="input-style" onChange={(e) => setNewContract({...newContract, product_id: parseInt(e.target.value)})}>
                      <option>Pilih...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <div className="form-group">
                      <label>Banyaknya (Qty)</label>
                      <input type="number" className="input-style" onChange={(e) => setNewContract({...newContract, qty: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Harga Sepakat (Rp)</label>
                      <input type="number" className="input-style" onChange={(e) => setNewContract({...newContract, price_agreed: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Jenis Pembayaran</label>
                    <select className="input-style" onChange={(e) => setNewContract({...newContract, payment_type: e.target.value})}>
                      <option value="Cash">Cash Before Delivery</option>
                      <option value="TOP">TOP (Term of Payment)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Simpan Kontrak</button>
                </form>
              </div>

              {/* List Kontrak */}
              <div className="data-card">
                <div className="card-header"><b>Daftar Kontrak Berjalan</b></div>
                <table>
                  <thead>
                    <tr><th>ID</th><th>Produk</th><th>Qty</th><th>Bayar</th></tr>
                  </thead>
                  <tbody>
                    {contracts.map(c => (
                      <tr key={c.id}>
                        <td>#{c.id}</td>
                        <td>ID Produk: {c.product_id}</td>
                        <td>{c.qty}</td>
                        <td><span style={{padding: '4px 8px', borderRadius: '4px', background: c.payment_type === 'TOP' ? '#fef3c7' : '#d1fae5'}}>{c.payment_type}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="pos-view">
            <h1>Point of Sale (Kasir B2C)</h1>
            <div className="pos-layout">
              <div className="product-grid">
                {products.map(p => (
                  <div key={p.id} className={`product-item ${cart?.id === p.id ? 'active' : ''}`} onClick={() => setCart(p)}>
                    <div style={{width: '100%', height: '100px', background: '#f1f5f9', borderRadius: '0.5rem', marginBottom: '1rem'}}></div>
                    <b>{p.name}</b>
                    <p style={{color: 'var(--primary)', fontWeight: 'bold'}}>Rp {p.price?.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="bill-card">
                <h3>Struk Belanja</h3>
                <hr style={{border: '1px dashed #e2e8f0', margin: '1rem 0'}} />
                {cart ? (
                  <div style={{marginBottom: '2rem'}}>
                    <p><b>{cart.name}</b></p>
                    <p>1x Rp {cart.price?.toLocaleString()}</p>
                  </div>
                ) : <p style={{color: '#94a3b8'}}>Belum ada item terpilih</p>}
                
                <div className="total-box">
                  <small>TOTAL TAGIHAN</small>
                  <div style={{fontSize: '1.5rem', fontWeight: '900'}}>Rp {cart ? cart.price?.toLocaleString() : 0}</div>
                </div>

                <div className="form-group">
                  <label>Metode Pembayaran</label>
                  <select className="input-style">
                    <option>Uang Real (Cash)</option>
                    <option>Kartu Debit/Kredit</option>
                    <option>QRIS Digital</option>
                  </select>
                </div>
                
                <button className="btn btn-success" style={{width: '100%', padding: '1.25rem'}} onClick={() => alert("Transaksi Berhasil!")}>PROSES TRANSAKSI</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;